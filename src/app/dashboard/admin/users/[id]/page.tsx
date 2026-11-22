import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    Mail,
    MapPin,
    ShoppingBag,
    Store,
    UtensilsCrossed,
} from "lucide-react";

import { AdminUserActions } from "@/components/dashboard/admin/user-actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getAdminUser } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/roles";
import { requireRole } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
    title: "User details",
};

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                <Icon className="size-4" />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

export default async function AdminUserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireRole("admin");
    const { id } = await params;
    const user = await getAdminUser(id);

    if (!user) {
        notFound();
    }

    const isVendor = user.role === "vendor";

    return (
        <div className="flex flex-col gap-6">
            <div>
                <Button asChild variant="ghost" size="sm" className="-ml-2">
                    <Link href="/dashboard/admin/users">
                        <ArrowLeft aria-hidden="true" />
                        Back to users
                    </Link>
                </Button>
            </div>

            <PageHeader
                title={user.name}
                description={`${ROLE_LABELS[user.role]} account · joined ${formatDate(
                    user.createdAt
                )}`}
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Account information</CardTitle>
                        <CardDescription>
                            {ROLE_DESCRIPTIONS[user.role]}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 sm:grid-cols-2">
                        <DetailRow icon={Mail} label="Email" value={user.email} />
                        <DetailRow
                            icon={CalendarDays}
                            label="Joined"
                            value={formatDate(user.createdAt)}
                        />
                        <DetailRow
                            icon={isVendor ? Store : ShoppingBag}
                            label="Role"
                            value={ROLE_LABELS[user.role]}
                        />
                        <div className="flex items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                <UtensilsCrossed className="size-4" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Status
                                </p>
                                <div className="mt-1">
                                    <StatusBadge
                                        status={
                                            user.blocked ? "blocked" : "active"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity</CardTitle>
                        <CardDescription>
                            Related records in the marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl border p-3">
                            <span className="text-sm text-muted-foreground">
                                {isVendor ? "Menu items" : "Orders placed"}
                            </span>
                            <span className="text-lg font-extrabold">
                                {isVendor ? user.itemCount : user.orderCount}
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border p-3">
                            <span className="text-sm text-muted-foreground">
                                Subscription
                            </span>
                            <Badge
                                variant={
                                    user.subscriptionPlan === "premium"
                                        ? "default"
                                        : "secondary"
                                }
                                className={
                                    user.subscriptionPlan === "premium"
                                        ? "bg-orange-500 text-white"
                                        : undefined
                                }
                            >
                                {user.subscriptionPlan === "premium"
                                    ? "Premium"
                                    : "Free"}
                            </Badge>
                        </div>
                        <div className="pt-1">
                            <AdminUserActions
                                userId={user._id}
                                userName={user.name}
                                blocked={user.blocked}
                                role={user.role}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {isVendor && user.businessName ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Restaurant profile</CardTitle>
                        <CardDescription>
                            Public information shown next to this vendor&apos;s
                            menu items.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <DetailRow
                            icon={Store}
                            label="Restaurant"
                            value={user.businessName}
                        />
                        <DetailRow
                            icon={MapPin}
                            label="Location"
                            value={
                                [user.businessArea, user.businessCity]
                                    .filter(Boolean)
                                    .join(", ") || "Not provided"
                            }
                        />
                        <div className="md:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Description
                            </p>
                            <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                {user.businessDescription ||
                                    "This vendor has not added a description yet."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
