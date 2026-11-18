import { ClipboardList, MessageSquare, PackageOpen } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { VendorOrderActions } from "@/components/dashboard/vendor/order-actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getVendorOrders } from "@/lib/data";
import {
    formatCurrency,
    formatDateTime,
    formatDeliveryDate,
} from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function VendorOrdersPage() {
    const user = await requireRole("vendor");
    const orders = await getVendorOrders(user.id);

    const pending = orders.filter((order) => order.status === "pending").length;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Customer orders"
                description="Review orders placed with your restaurant. Only pending orders can be accepted or rejected, and only once."
            >
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                    <ClipboardList className="size-4" />
                    {pending} pending
                </span>
            </PageHeader>

            {orders.length === 0 ? (
                <EmptyState
                    icon={PackageOpen}
                    title="No orders yet"
                    description="When a customer orders from your approved menu, the order will appear here."
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All orders ({orders.length})</CardTitle>
                        <CardDescription>
                            You can only manage orders that belong to your own
                            restaurant.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 font-semibold">Customer</th>
                                    <th className="pb-3 font-semibold">Item</th>
                                    <th className="pb-3 font-semibold">Delivery</th>
                                    <th className="pb-3 font-semibold">Address & message</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 text-right font-semibold">
                                        Decision
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order._id} className="align-top">
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold">
                                                {order.customerName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.customerEmail}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Requested{" "}
                                                {formatDateTime(order.createdAt)}
                                            </p>
                                        </td>
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
                                                    <p className="text-xs font-semibold text-orange-600">
                                                        {formatCurrency(
                                                            order.unitPrice *
                                                                order.quantity
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <p className="font-medium">
                                                {formatDeliveryDate(
                                                    order.deliveryDate
                                                )}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <p className="max-w-56 text-sm">
                                                {order.deliveryAddress}
                                            </p>
                                            {order.message ? (
                                                <p className="mt-1 flex max-w-56 items-start gap-1 text-xs text-muted-foreground">
                                                    <MessageSquare className="mt-0.5 size-3 shrink-0" />
                                                    {order.message}
                                                </p>
                                            ) : null}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="py-4">
                                            <VendorOrderActions
                                                orderId={order._id}
                                                status={order.status}
                                            />
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
