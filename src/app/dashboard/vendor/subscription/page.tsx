import Link from "next/link";
import { Check, Crown, ShieldCheck, Store } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { CancelPremiumButton } from "@/components/dashboard/vendor/cancel-premium-button";
import { UpgradeButton } from "@/components/dashboard/vendor/upgrade-button";
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
import { PREMIUM_PRICE } from "@/lib/types/dashboard";
import { requireRole } from "@/lib/session";

export const instant = false;

const FREE_FEATURES = [
    "Maximum 3 active menu items",
    "Basic vendor dashboard",
    "Order management",
    "Restaurant profile",
];

const PREMIUM_FEATURES = [
    "Unlimited active menu items",
    "Premium vendor badge",
    "Featured placement on the homepage",
    "Everything in the Free plan",
];

export default async function VendorSubscriptionPage() {
    const user = await requireRole("vendor");
    const profile = await getVendorProfile(user.id);
    const plan = profile?.subscriptionPlan ?? "free";
    const isPremium = plan === "premium";

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Subscription"
                description="Manage the plan that controls your menu limits and promotional benefits."
            >
                <StatusBadge status={plan} className="h-7 px-3 text-sm" />
            </PageHeader>

            {!profile ? (
                <Card className="border-orange-200 bg-orange-50/60">
                    <CardContent className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <Store className="mt-1 size-5 shrink-0 text-orange-600" />
                            <div>
                                <p className="font-bold">
                                    Create your restaurant profile first
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Your plan is attached to your restaurant
                                    profile.
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/vendor/profile">
                                Create profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card
                        className={
                            !isPremium ? "border-2 border-orange-300" : ""
                        }
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Free</CardTitle>
                                {!isPremium ? (
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                                        Current plan
                                    </span>
                                ) : null}
                            </div>
                            <CardDescription>
                                Everything you need to start selling.
                            </CardDescription>
                            <p className="pt-2 text-3xl font-extrabold">
                                ৳0
                                <span className="text-sm font-medium text-muted-foreground">
                                    {" "}
                                    / forever
                                </span>
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {FREE_FEATURES.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-start gap-2 text-sm"
                                >
                                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                    {feature}
                                </div>
                            ))}
                            {FREE_FEATURES.length > 0 && isPremium ? (
                                <p className="pt-2 text-xs text-muted-foreground">
                                    You have outgrown these limits.
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card
                        className={
                            isPremium
                                ? "border-2 border-amber-300"
                                : "bg-gradient-to-br from-amber-50 to-orange-50"
                        }
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Crown className="size-5 text-amber-500" />
                                    Premium
                                </CardTitle>
                                {isPremium ? (
                                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                                        Current plan
                                    </span>
                                ) : null}
                            </div>
                            <CardDescription>
                                Grow without limits and stand out on PizzaHub.
                            </CardDescription>
                            <p className="pt-2 text-3xl font-extrabold">
                                ৳{PREMIUM_PRICE}
                                <span className="text-sm font-medium text-muted-foreground">
                                    {" "}
                                    / 30 days
                                </span>
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {PREMIUM_FEATURES.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-start gap-2 text-sm"
                                >
                                    <Check className="mt-0.5 size-4 shrink-0 text-amber-600" />
                                    {feature}
                                </div>
                            ))}

                            <div className="pt-4">
                                {isPremium ? (
                                    <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                                        <div>
                                            <p className="font-bold">
                                                Premium is active
                                            </p>
                                            <p className="mt-1 text-xs leading-6">
                                                {profile.premiumSince
                                                    ? `Since ${formatDate(profile.premiumSince)}. `
                                                    : ""}
                                                {profile.premiumExpiresAt
                                                    ? `Your paid access runs until ${formatDate(profile.premiumExpiresAt)}. `
                                                    : ""}
                                                Your items are featured on the
                                                homepage and carry the Premium
                                                badge.
                                            </p>
                                        </div>

                                        {profile.subscriptionStatus ===
                                        "cancelled" ? (
                                            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                                                Premium is cancelled. It stays
                                                active until the end of the paid
                                                period and will not continue
                                                afterwards.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-xs text-emerald-700">
                                                    Premium is a one-time
                                                    30-day payment. Renew it when
                                                    the current period ends to
                                                    keep unlimited items.
                                                </p>
                                                <CancelPremiumButton />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <UpgradeButton />
                                        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                                            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                                            You will be redirected to Stripe
                                            Checkout. Premium activates only
                                            after Stripe verifies the payment.
                                        </p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
