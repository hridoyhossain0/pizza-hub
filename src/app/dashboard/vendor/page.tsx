import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    Crown,
    PlusCircle,
    Store,
    ThumbsUp,
    UtensilsCrossed,
} from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    getVendorMenuItems,
    getVendorOrders,
    getVendorProfile,
    getVendorStats,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function VendorOverviewPage() {
    const user = await requireRole("vendor");

    const [profile, stats, orders, items] = await Promise.all([
        getVendorProfile(user.id),
        getVendorStats(user.id),
        getVendorOrders(user.id),
        getVendorMenuItems(user.id),
    ]);

    const recentOrders = orders.slice(0, 5);
    const recentItems = items.slice(0, 4);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={profile ? profile.restaurantName : "Vendor overview"}
                description="Track your menu, incoming orders and subscription from one place."
            >
                <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href="/dashboard/vendor/add-item">
                        <PlusCircle aria-hidden="true" />
                        Add menu item
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard/vendor/menu">
                        My menu
                        <ArrowRight aria-hidden="true" />
                    </Link>
                </Button>
            </PageHeader>

            {!profile ? (
                <Card className="border-orange-200 bg-orange-50/60">
                    <CardContent className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                                <Store className="size-5" />
                            </span>
                            <div>
                                <p className="font-bold">
                                    Set up your restaurant profile
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Add your restaurant name, location and logo
                                    before publishing menu items.
                                </p>
                            </div>
                        </div>
                        <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                            <Link href="/dashboard/vendor/profile">
                                Create profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : null}

            {stats.plan !== "premium" ? (
                <Card className="border-amber-200 bg-amber-50/60">
                    <CardContent className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                                <Crown className="size-5" />
                            </span>
                            <div>
                                <p className="font-bold">You are on the Free plan</p>
                                <p className="text-sm text-muted-foreground">
                                    Publish up to 3 active items. Upgrade for
                                    unlimited items, a Premium badge and
                                    featured homepage placement.
                                </p>
                            </div>
                        </div>
                        <Button asChild className="bg-amber-500 text-white hover:bg-amber-600">
                            <Link href="/dashboard/vendor/subscription">
                                Upgrade to Premium
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    label="Total menu items"
                    value={stats.totalItems}
                    icon={UtensilsCrossed}
                    hint="All submitted items"
                />
                <StatCard
                    label="Active items"
                    value={stats.activeItems}
                    icon={CheckCircle2}
                    accent="green"
                    hint="Visible when approved"
                />
                <StatCard
                    label="Pending orders"
                    value={stats.pendingOrders}
                    icon={ClipboardList}
                    accent="amber"
                    hint="Awaiting your decision"
                />
                <StatCard
                    label="Accepted orders"
                    value={stats.acceptedOrders}
                    icon={ThumbsUp}
                    accent="blue"
                    hint="Confirmed by you"
                />
                <StatCard
                    label="Subscription"
                    value={stats.plan === "premium" ? "Premium" : "Free"}
                    icon={CreditCard}
                    accent={stats.plan === "premium" ? "orange" : "violet"}
                    hint={
                        stats.plan === "premium"
                            ? "Unlimited items"
                            : "Max 3 active items"
                    }
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent orders</CardTitle>
                            <CardDescription>
                                The latest orders placed with your restaurant.
                            </CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/vendor/orders">
                                View all
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <EmptyState
                                icon={ClipboardList}
                                title="No orders yet"
                                description="Orders placed by customers will appear here."
                                className="py-8"
                            />
                        ) : (
                            <ul className="divide-y">
                                {recentOrders.map((order) => (
                                    <li
                                        key={order._id}
                                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <img
                                            src={order.itemImage}
                                            alt={order.itemName}
                                            className="size-11 shrink-0 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {order.itemName}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {order.customerName} ·{" "}
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent menu items</CardTitle>
                            <CardDescription>
                                Approval status of your latest submissions.
                            </CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/vendor/menu">
                                View all
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentItems.length === 0 ? (
                            <EmptyState
                                icon={UtensilsCrossed}
                                title="No menu items yet"
                                description="Add your first dish to get started."
                                className="py-8"
                            >
                                <Button asChild size="sm">
                                    <Link href="/dashboard/vendor/add-item">
                                        Add menu item
                                    </Link>
                                </Button>
                            </EmptyState>
                        ) : (
                            <ul className="divide-y">
                                {recentItems.map((item) => (
                                    <li
                                        key={item._id}
                                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="size-11 shrink-0 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(item.price)} ·{" "}
                                                {item.category}
                                            </p>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
