import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { transactionsCollection } from "@/lib/db";
import {
    ensurePaymentIndexes,
    expireVendorSubscription,
} from "@/lib/payments";
import { normalizeUserRole } from "@/lib/roles";
import {
    getPremiumPriceConfig,
    getStripe,
    STRIPE_NOT_CONFIGURED_MESSAGE,
} from "@/lib/stripe";

/**
 * Creates a Stripe Checkout Session for the signed-in vendor.
 *
 * The vendor id always comes from the server session. Any vendor id, role or
 * plan sent by the browser is ignored, so a user can never create a checkout
 * session for another vendor.
 */
export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        return NextResponse.json(
            { message: "Please sign in to upgrade your subscription." },
            { status: 401 }
        );
    }

    const user = session.user as typeof session.user & {
        role?: unknown;
        blocked?: unknown;
    };
    const role = normalizeUserRole(user.role);

    if (role !== "vendor") {
        return NextResponse.json(
            {
                message:
                    "Only vendor accounts can purchase a Premium subscription.",
            },
            { status: 403 }
        );
    }

    if (user.blocked === true) {
        return NextResponse.json(
            {
                message:
                    "Your account has been blocked by an administrator and cannot start a payment.",
            },
            { status: 403 }
        );
    }

    // Apply lazy expiry first so a vendor whose paid period has ended can
    // renew instead of being told they are "already Premium".
    const profile = await expireVendorSubscription(user.id);

    if (!profile) {
        return NextResponse.json(
            {
                message:
                    "Create your restaurant profile before upgrading your subscription.",
            },
            { status: 400 }
        );
    }

    if (profile.subscriptionPlan === "premium") {
        return NextResponse.json(
            { message: "Your subscription is already Premium." },
            { status: 409 }
        );
    }

    const stripe = getStripe();

    if (!stripe) {
        return NextResponse.json(
            { message: STRIPE_NOT_CONFIGURED_MESSAGE },
            { status: 503 }
        );
    }

    let price: ReturnType<typeof getPremiumPriceConfig>;

    try {
        price = getPremiumPriceConfig();
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "The payment amount is not configured correctly.",
            },
            { status: 500 }
        );
    }

    const origin = (
        process.env.APP_URL?.trim() || new URL(request.url).origin
    ).replace(/\/$/, "");

    try {
        await ensurePaymentIndexes().catch((error) => {
            console.error("Could not create payment indexes", error);
        });

        const checkout = await stripe.checkout.sessions.create({
            mode: "payment",
            client_reference_id: user.id,
            customer_email: user.email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: price.currency,
                        unit_amount: price.unitAmount,
                        product_data: {
                            name: "PizzaHub Premium",
                            description:
                                "Unlimited active menu items, Premium badge and featured placement for 30 days.",
                        },
                    },
                },
            ],
            metadata: {
                vendorId: user.id,
                plan: "premium",
            },
            payment_intent_data: {
                metadata: {
                    vendorId: user.id,
                    plan: "premium",
                },
            },
            success_url: `${origin}/dashboard/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/vendor/subscription/cancel`,
        });

        if (!checkout.url) {
            return NextResponse.json(
                {
                    message:
                        "Stripe did not return a checkout URL. Please try again.",
                },
                { status: 502 }
            );
        }

        const now = new Date();

        try {
            // A pending record lets admins see abandoned checkout attempts.
            // It is upgraded to "paid" only by the verified webhook.
            await transactionsCollection.insertOne({
                _id: new ObjectId(),
                vendorId: user.id,
                vendorName: profile.restaurantName,
                plan: "premium",
                amount: price.unitAmount / 100,
                currency: price.currency,
                paymentStatus: "pending",
                transactionDate: now,
                createdAt: now,
                stripeSessionId: checkout.id,
                stripePaymentIntentId: null,
            });
        } catch (error) {
            // A retried checkout can hit the unique session index. The webhook
            // still upserts the final transaction, so this is not fatal.
            console.error("Could not save pending transaction", error);
        }

        return NextResponse.json(
            { url: checkout.url },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("Stripe checkout session failed", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to start checkout. Please try again.",
            },
            { status: 502 }
        );
    }
}
