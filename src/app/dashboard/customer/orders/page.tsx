import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { CancelOrderButton } from "@/components/dashboard/customer/cancel-order";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getCustomerOrders } from "@/lib/data";
import {
    formatCurrency,
    formatDateTime,
    formatDeliveryDate,
} from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function CustomerOrdersPage() {
    const user = await requireRole("customer");
    const orders = await getCustomerOrders(user.id);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="My orders"
                description="View your order details. Pending orders can be cancelled; accepted, rejected and cancelled orders cannot be changed."
            >
                <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href="/menu">
                        <ShoppingBag aria-hidden="true" />
                        Order again
                    </Link>
                </Button>
            </PageHeader>

            {orders.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="No orders yet"
                    description="When you order from the menu, your requests will appear here."
                >
                    <Button asChild>
                        <Link href="/menu">Browse menu</Link>
                    </Button>
                </EmptyState>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All orders ({orders.length})</CardTitle>
                        <CardDescription>
                            Only your own orders are shown here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 font-semibold">Item</th>
                                    <th className="pb-3 font-semibold">Vendor</th>
                                    <th className="pb-3 font-semibold">Delivery</th>
                                    <th className="pb-3 font-semibold">Address</th>
                                    <th className="pb-3 font-semibold">Requested</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 text-right font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order._id} className="align-top">
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={order.itemImage}
                                                    alt={order.itemName}
                                                    className="size-12 shrink-0 rounded-lg object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <p className="max-w-44 truncate font-semibold">
                                                        {order.itemName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.quantity} ×{" "}
                                                        {formatCurrency(
                                                            order.unitPrice
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            {order.vendorName}
                                        </td>
                                        <td className="py-4 pr-4">
                                            {formatDeliveryDate(
                                                order.deliveryDate
                                            )}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <p className="max-w-48">
                                                {order.deliveryAddress}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4 text-xs text-muted-foreground">
                                            {formatDateTime(order.createdAt)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col items-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/dashboard/customer/orders/${order._id}`}
                                                    >
                                                        <Eye aria-hidden="true" />
                                                        Details
                                                    </Link>
                                                </Button>
                                                {order.status === "pending" ? (
                                                    <CancelOrderButton
                                                        orderId={order._id}
                                                    />
                                                ) : null}
                                            </div>
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
