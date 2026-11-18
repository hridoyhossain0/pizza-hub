import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ShoppingBag,
    UtensilsCrossed,
    XCircle,
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
import { getCustomerOrders, getCustomerStats } from "@/lib/data";
import {
    formatCurrency,
    formatDate,
    formatDeliveryDate,
} from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function CustomerOverviewPage() {
    const user = await requireRole("customer");
    const [stats, orders] = await Promise.all([
        getCustomerStats(user.id),
        getCustomerOrders(user.id),
    ]);

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={`Welcome back, ${user.name.split(" ")[0]}`}
                description="Track your orders and discover something delicious."
            >
                <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href="/menu">
                        <UtensilsCrossed aria-hidden="true" />
                        Browse menu
                    </Link>
                </Button>
            </PageHeader>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total orders"
                    value={stats.total}
                    icon={ShoppingBag}
                    hint="All orders you have placed"
                />
                <StatCard
                    label="Pending"
                    value={stats.pending}
                    icon={Clock}
                    accent="amber"
                    hint="Waiting for the restaurant"
                />
                <StatCard
                    label="Accepted"
                    value={stats.accepted}
                    icon={CheckCircle2}
                    accent="green"
                    hint="Confirmed by the restaurant"
                />
                <StatCard
                    label="Rejected"
                    value={stats.rejected}
                    icon={XCircle}
                    accent="red"
                    hint="Declined orders"
                />
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent orders</CardTitle>
                        <CardDescription>
                            Your latest requests and their current status.
                        </CardDescription>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/dashboard/customer/orders">
                            View all
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <EmptyState
                            icon={ShoppingBag}
                            title="No orders yet"
                            description="Browse the menu and place your first order."
                            className="py-10"
                        >
                            <Button asChild>
                                <Link href="/menu">Browse menu</Link>
                            </Button>
                        </EmptyState>
                    ) : (
                        <ul className="divide-y">
                            {recentOrders.map((order) => (
                                <li key={order._id}>
                                    <Link
                                        href={`/dashboard/customer/orders/${order._id}`}
                                        className="flex items-center gap-3 py-3 transition hover:bg-muted/40 first:pt-0 last:pb-0"
                                    >
                                        <img
                                            src={order.itemImage}
                                            alt={order.itemName}
                                            className="size-12 shrink-0 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">
                                                {order.itemName}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {order.vendorName} · Delivery{" "}
                                                {formatDeliveryDate(
                                                    order.deliveryDate
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(
                                                    order.unitPrice *
                                                        order.quantity
                                                )}{" "}
                                                · Requested{" "}
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
