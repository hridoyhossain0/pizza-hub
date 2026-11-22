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
import { idFilter, transactionsCollection } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";

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

    // The API server writes the transaction only after Stripe's signature is
    // verified. Filtering by `vendorId` means one vendor can never read another
    // vendor's payment, and no Stripe secret key is needed in this frontend.
    const payment = sessionId
        ? await transactionsCollection.findOne({
              stripeSessionId: sessionId,
              vendorId: idFilter(user.id),
          })
        : null;

    const paid = payment?.status === "paid";
    const stillPending = payment?.status === "pending";
    const activationPending = paid && !isPremium;

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
                        ) : activationPending || stillPending ? (
                            <Clock3 className="size-5 text-amber-600" />
                        ) : (
                            <XCircle className="size-5 text-red-600" />
                        )}
                        {isPremium
                            ? "You are Premium"
                            : activationPending
                              ? "Payment received — activating Premium"
                              : stillPending
                                ? "Payment is being confirmed"
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
                              ? "Stripe confirmed the payment. The API server is finishing your transaction and subscription update. This usually takes a few seconds."
                              : stillPending
                                ? "Checkout was recorded. The signed Stripe webhook has not marked it paid yet, so your plan has not changed."
                                : "If you completed a payment, give it a moment and check again. No charge is recorded until the Stripe webhook verifies it."}
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

                    {payment ? (
                        <div className="grid gap-2 rounded-xl border bg-muted/30 p-4 text-sm sm:grid-cols-3">
                            <p>
                                <span className="text-muted-foreground">
                                    Amount:{" "}
                                </span>
                                <span className="font-semibold">
                                    {payment.currency &&
                                    payment.currency !== "bdt"
                                        ? `${payment.amount.toLocaleString(
                                              "en-US"
                                          )} ${payment.currency.toUpperCase()}`
                                        : formatCurrency(payment.amount)}
                                </span>
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Recorded:{" "}
                                </span>
                                <span className="font-semibold">
                                    {formatDate(payment.transactionDate)}
                                </span>
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Status:{" "}
                                </span>
                                <span className="font-semibold capitalize">
                                    {payment.status}
                                </span>
                            </p>
                        </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                        {activationPending || stillPending ? (
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
