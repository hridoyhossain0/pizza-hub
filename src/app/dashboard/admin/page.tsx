import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Receipt,
    ShoppingBag,
    Store,
    Users,
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
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import {
    getAdminMenuItems,
    getAdminStats,
    getAdminTransactions,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";
import type { PaymentStatus } from "@/lib/types/dashboard";

export const instant = false;

export default async function AdminOverviewPage() {
    await requireRole("admin");

    const [stats, pendingItems, transactions] = await Promise.all([
        getAdminStats(),
        getAdminMenuItems({ status: "pending" }),
        getAdminTransactions(),
    ]);

    const recentPending = pendingItems.slice(0, 5);
    const recentTransactions = transactions.slice(0, 5);
    const adminCount = Math.max(
        0,
        stats.totalUsers - stats.totalVendors - stats.totalCustomers
    );
    const paymentStatusCounts: Record<PaymentStatus, number> = {
        paid: 0,
        pending: 0,
        failed: 0,
    };

    for (const transaction of transactions) {
        paymentStatusCounts[transaction.paymentStatus] += 1;
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Admin overview"
                description="Monitor users, menu approvals and subscription payments across PizzaHub."
            >
                <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href="/dashboard/admin/menu">
                        Review menu items
                        <ArrowRight aria-hidden="true" />
                    </Link>
                </Button>
            </PageHeader>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    label="Registered users"
                    value={stats.totalUsers}
                    icon={Users}
                    hint="All accounts on the platform"
                />
                <StatCard
                    label="Vendors"
                    value={stats.totalVendors}
                    icon={Store}
                    accent="violet"
                    hint="Restaurant accounts"
                />
                <StatCard
                    label="Customers"
                    value={stats.totalCustomers}
                    icon={ShoppingBag}
                    accent="blue"
                    hint="Customer accounts"
                />
                <StatCard
                    label="Menu items"
                    value={stats.totalMenuItems}
                    icon={UtensilsCrossed}
                    hint="All submitted items"
                />
                <StatCard
                    label="Pending items"
                    value={stats.pendingMenuItems}
                    icon={BadgeCheck}
                    accent="amber"
                    hint="Awaiting approval"
                />
                <StatCard
                    label="Transactions"
                    value={stats.totalTransactions}
                    icon={Receipt}
                    accent="green"
                    hint="Subscription payments"
                />
            </div>

            <AnalyticsCharts
                panels={[
                    {
                        title: "Accounts by role",
                        description:
                            "Current customer, vendor and admin account counts.",
                        data: [
                            { label: "Customers", value: stats.totalCustomers },
                            { label: "Vendors", value: stats.totalVendors },
                            { label: "Admins", value: adminCount },
                        ],
                    },
                    {
                        title: "Subscription payment status",
                        description:
                            "Payment outcomes recorded for Premium subscriptions.",
                        data: [
                            {
                                label: "Paid",
                                value: paymentStatusCounts.paid,
                            },
                            {
                                label: "Pending",
                                value: paymentStatusCounts.pending,
                            },
                            {
                                label: "Failed",
                                value: paymentStatusCounts.failed,
                            },
                        ],
                    },
                ]}
            />

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pending menu items</CardTitle>
                            <CardDescription>
                                New vendor submissions waiting for review.
                            </CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/admin/menu?status=pending">
                                Review all
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentPending.length === 0 ? (
                            <EmptyState
                                icon={BadgeCheck}
                                title="Nothing waiting"
                                description="All submitted menu items have been reviewed."
                                className="py-8"
                            />
                        ) : (
                            <ul className="divide-y">
                                {recentPending.map((item) => (
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
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.vendorName} ·{" "}
                                                {formatDate(item.createdAt)}
                                            </p>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent transactions</CardTitle>
                            <CardDescription>
                                Premium subscription payments.
                            </CardDescription>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/admin/transactions">
                                View all
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length === 0 ? (
                            <EmptyState
                                icon={Receipt}
                                title="No transactions yet"
                                description="Transactions appear when a vendor upgrades to Premium."
                                className="py-8"
                            />
                        ) : (
                            <ul className="divide-y">
                                {recentTransactions.map((transaction) => (
                                    <li
                                        key={transaction._id}
                                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {transaction.vendorName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(
                                                    transaction.transactionDate
                                                )}{" "}
                                                · {transaction.plan}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">
                                                {formatCurrency(
                                                    transaction.amount
                                                )}
                                            </p>
                                            <StatusBadge
                                                status={
                                                    transaction.paymentStatus
                                                }
                                            />
                                        </div>
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
