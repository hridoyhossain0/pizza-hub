import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Crown,
    ShieldCheck,
    XCircle,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getVendorProfile } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

export const instant = false;

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const user = await requireRole("vendor");
    const params = await searchParams;
    const sessionId = params.session_id?.trim() ?? "";
    const profile = await getVendorProfile(user.id);
    const isPremium = profile?.subscriptionPlan === "premium";

    let paid = false;
    let belongsToUser = false;
    const stripe = getStripe();
    // Without Stripe keys we cannot verify the session, so never hint that the
    // session belongs to a different account.
    let lookupFailed = Boolean(sessionId) && !stripe;

    if (sessionId && stripe) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            belongsToUser = session.metadata?.vendorId === user.id;
            paid = belongsToUser && session.payment_status === "paid";
        } catch {
            lookupFailed = true;
        }
    }

    const activationPending = paid && !isPremium;
    const wrongAccount = Boolean(sessionId) && !lookupFailed && !belongsToUser;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Payment confirmation"
                description="This page only displays the Stripe result. Premium is activated by Stripe's verified webhook, never by this redirect."
            >
                <StatusBadge
                    status={isPremium ? "premium" : "pending"}
                    className="h-7 px-3 text-sm"
                />
            </PageHeader>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isPremium ? (
                            <CheckCircle2 className="size-5 text-emerald-600" />
                        ) : activationPending ? (
                            <Clock3 className="size-5 text-amber-600" />
                        ) : (
                            <XCircle className="size-5 text-red-600" />
                        )}
                        {isPremium
                            ? "You are Premium"
                            : activationPending
                              ? "Payment received — activating Premium"
                              : wrongAccount
                                ? "This payment belongs to another account"
                                : "We could not confirm a payment yet"}
                    </CardTitle>
                    <CardDescription>
                        {isPremium
                            ? `Your Premium subscription is active${
                                  profile?.premiumExpiresAt
                                      ? ` until ${formatDate(profile.premiumExpiresAt)}`
                                      : ""
                              }.`
                            : activationPending
                              ? "Stripe confirmed the payment. The webhook is still saving your transaction and updating your subscription. This usually takes a few seconds."
                              : wrongAccount
                                ? "For security, a payment session can only be viewed by the vendor who created it."
                                : "If you completed a payment, give Stripe a moment and check again. No charge is recorded until Stripe verifies it."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        <p className="flex items-center gap-2 font-bold">
                            <ShieldCheck className="size-4" />
                            Verified by Stripe
                        </p>
                        <p className="mt-1 text-xs leading-6">
                            Premium changes only after a signature-verified
                            webhook and an amount check. Refreshing or editing
                            this URL cannot activate Premium.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {activationPending ? (
                            <Button asChild className="bg-amber-500 text-white hover:bg-amber-600">
                                <a
                                    href={`/dashboard/vendor/subscription/success?session_id=${encodeURIComponent(
                                        sessionId
                                    )}`}
                                >
                                    Check status again
                                    <ArrowRight aria-hidden="true" />
                                </a>
                            </Button>
                        ) : null}

                        <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                            <Link href="/dashboard/vendor/subscription">
                                <Crown aria-hidden="true" />
                                Go to subscription
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href="/dashboard/vendor">
                                Vendor dashboard
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
