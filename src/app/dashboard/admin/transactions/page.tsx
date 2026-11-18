import { Lock, Receipt } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getAdminTransactions } from "@/lib/data";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function AdminTransactionsPage() {
    await requireRole("admin");
    const transactions = await getAdminTransactions();

    const paid = transactions.filter(
        (transaction) => transaction.paymentStatus === "paid"
    );
    const revenue = paid.reduce(
        (total, transaction) => total + transaction.amount,
        0
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Transactions"
                description="Review subscription payment records. Payment records are read-only and cannot be edited by administrators."
            >
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                    <Lock className="size-4" />
                    Read-only
                </span>
            </PageHeader>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Total transactions"
                    value={transactions.length}
                    icon={Receipt}
                    hint="All payment records"
                />
                <StatCard
                    label="Paid transactions"
                    value={paid.length}
                    icon={Receipt}
                    accent="green"
                    hint="Successfully paid"
                />
                <StatCard
                    label="Collected revenue"
                    value={formatCurrency(revenue)}
                    icon={Receipt}
                    accent="amber"
                    hint="Total paid amount"
                />
            </div>

            {transactions.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="No transactions yet"
                    description="A transaction is recorded whenever a vendor upgrades to Premium."
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment records</CardTitle>
                        <CardDescription>
                            Vendor, plan, amount, payment status and transaction
                            date. There are no edit controls by design.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 font-semibold">Vendor</th>
                                    <th className="pb-3 font-semibold">Plan</th>
                                    <th className="pb-3 font-semibold">Amount</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Payment date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {transactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold">
                                                {transaction.vendorName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.vendorId}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4 capitalize">
                                            {transaction.plan}
                                        </td>
                                        <td className="py-4 pr-4 font-semibold">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge
                                                status={
                                                    transaction.paymentStatus
                                                }
                                            />
                                        </td>
                                        <td className="py-4 text-muted-foreground">
                                            {formatDateTime(
                                                transaction.transactionDate
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
