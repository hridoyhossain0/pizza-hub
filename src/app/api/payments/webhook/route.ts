import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import type Stripe from "stripe";

import {
    idFilter,
    transactionsCollection,
    vendorProfilesCollection,
} from "@/lib/db";
import {
    activateVendorPremium,
    ensurePaymentIndexes,
} from "@/lib/payments";
import { getPremiumPriceConfig, getStripe } from "@/lib/stripe";

function revalidatePaymentPaths() {
    revalidatePath("/dashboard/vendor");
    revalidatePath("/dashboard/vendor/subscription");
    revalidatePath("/dashboard/vendor/menu");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/transactions");
    revalidatePath("/menu");
    revalidatePath("/");
}

function paymentIntentId(session: Stripe.Checkout.Session) {
    if (typeof session.payment_intent === "string") {
        return session.payment_intent;
    }

    return session.payment_intent?.id ?? null;
}

function customerId(session: Stripe.Checkout.Session) {
    if (typeof session.customer === "string") {
        return session.customer;
    }

    return session.customer?.id ?? null;
}

async function markSessionFailed(sessionId: string) {
    await transactionsCollection.updateOne(
        { stripeSessionId: sessionId, paymentStatus: "pending" },
        {
            $set: {
                paymentStatus: "failed",
                transactionDate: new Date(),
            },
        }
    );
}

/**
 * The only place where a Premium subscription becomes active.
 *
 * The browser success redirect never grants Premium. Signature verification
 * plus an amount/currency/session re-check guarantee that only a genuinely
 * paid Stripe Checkout can upgrade a vendor.
 */
async function handleCheckoutPaid(session: Stripe.Checkout.Session) {
    // Premium is sold as a one-time payment, never as a recurring subscription.
    if (session.mode !== "payment") {
        return;
    }

    if (session.payment_status !== "paid") {
        return;
    }

    const vendorId =
        typeof session.metadata?.vendorId === "string"
            ? session.metadata.vendorId
            : "";

    if (!vendorId || session.metadata?.plan !== "premium") {
        console.error("Checkout session is missing PizzaHub metadata", session.id);
        return;
    }

    if (
        session.client_reference_id &&
        session.client_reference_id !== vendorId
    ) {
        console.error("Checkout session vendor mismatch", session.id);
        return;
    }

    let price: ReturnType<typeof getPremiumPriceConfig>;

    try {
        price = getPremiumPriceConfig();
    } catch (error) {
        console.error("Invalid Premium price configuration", error);
        return;
    }

    if (
        session.amount_total !== price.unitAmount ||
        (session.currency ?? "").toLowerCase() !== price.currency
    ) {
        console.error("Checkout session amount mismatch", {
            sessionId: session.id,
            amountTotal: session.amount_total,
            currency: session.currency,
        });
        return;
    }

    // Stripe can deliver the same event more than once. If this session is
    // already recorded as paid, do not extend the vendor's period again.
    const existing = await transactionsCollection.findOne({
        stripeSessionId: session.id,
    });

    if (existing?.paymentStatus === "paid") {
        return;
    }

    const profile = await vendorProfilesCollection.findOne({
        userId: idFilter(vendorId),
    });

    if (!profile) {
        console.error("Paid checkout for a missing vendor profile", vendorId);
        return;
    }

    const now = new Date();

    await transactionsCollection.updateOne(
        { stripeSessionId: session.id },
        {
            $set: {
                vendorId,
                vendorName: profile.restaurantName,
                plan: "premium",
                amount: (session.amount_total ?? 0) / 100,
                currency: (session.currency ?? price.currency).toLowerCase(),
                paymentStatus: "paid",
                transactionDate: new Date(session.created * 1000),
                stripePaymentIntentId: paymentIntentId(session),
            },
            $setOnInsert: {
                _id: new ObjectId(),
                createdAt: now,
                stripeSessionId: session.id,
            },
        },
        { upsert: true }
    );

    await activateVendorPremium({
        vendorId,
        checkoutSessionId: session.id,
        stripeCustomerId: customerId(session),
        now,
    });

    revalidatePaymentPaths();
}

export async function POST(request: Request) {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

    if (!stripe) {
        console.error("Stripe webhook received before Stripe was configured.");
        return Response.json(
            { message: "Stripe is not configured." },
            { status: 503 }
        );
    }

    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is not configured.");
        return Response.json(
            { message: "Stripe webhook is not configured." },
            { status: 503 }
        );
    }

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return Response.json(
            { message: "Missing Stripe signature." },
            { status: 400 }
        );
    }

    const payload = await request.text();
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
        );
    } catch (error) {
        console.error("Invalid Stripe webhook signature", error);
        return Response.json(
            { message: "Invalid Stripe signature." },
            { status: 400 }
        );
    }

    await ensurePaymentIndexes().catch((error) => {
        console.error("Could not create payment indexes", error);
    });

    try {
        switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded": {
                await handleCheckoutPaid(
                    event.data.object as Stripe.Checkout.Session
                );
                break;
            }
            case "checkout.session.async_payment_failed":
            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                await markSessionFailed(session.id);
                break;
            }
            case "payment_intent.payment_failed": {
                const intent = event.data.object as Stripe.PaymentIntent;

                // Match the exact payment intent. Never fail every pending
                // checkout belonging to the vendor — they may have a second,
                // unrelated session in progress.
                await transactionsCollection.updateOne(
                    {
                        stripePaymentIntentId: intent.id,
                        paymentStatus: "pending",
                    },
                    {
                        $set: {
                            paymentStatus: "failed",
                            transactionDate: new Date(),
                        },
                    }
                );
                break;
            }
            default:
                // Unrecognised events are acknowledged so Stripe stops
                // retrying them.
                break;
        }
    } catch (error) {
        console.error("Stripe webhook processing failed", error);
        return Response.json(
            { message: "Webhook processing failed." },
            { status: 500 }
        );
    }

    return Response.json({ received: true });
}
