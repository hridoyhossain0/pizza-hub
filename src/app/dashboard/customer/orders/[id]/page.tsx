import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    MessageSquare,
    Package,
    Store,
} from "lucide-react";

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
import { getCustomerOrder } from "@/lib/data";
import {
    formatCurrency,
    formatDateTime,
    formatDeliveryDate,
} from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function CustomerOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireRole("customer");
    const { id } = await params;
    const order = await getCustomerOrder(user.id, id);

    if (!order) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Order details"
                description="Everything you submitted with this order."
            >
                <Button asChild variant="outline">
                    <Link href="/dashboard/customer/orders">
                        <ArrowLeft aria-hidden="true" />
                        Back to my orders
                    </Link>
                </Button>
            </PageHeader>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg">
                                    {order.itemName}
                                </CardTitle>
                                <CardDescription>
                                    Order #{order._id.slice(-8).toUpperCase()}
                                </CardDescription>
                            </div>
                            <StatusBadge
                                status={order.status}
                                className="h-7 px-3 text-sm"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center gap-4">
                            <img
                                src={order.itemImage}
                                alt={order.itemName}
                                className="size-24 shrink-0 rounded-xl object-cover"
                            />
                            <div>
                                <p className="flex items-center gap-2 font-semibold">
                                    <Store className="size-4 text-orange-500" />
                                    {order.vendorName}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {order.quantity} ×{" "}
                                    {formatCurrency(order.unitPrice)}
                                </p>
                                <p className="mt-1 text-lg font-extrabold text-orange-600">
                                    {formatCurrency(
                                        order.unitPrice * order.quantity
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                    Delivery date
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                    <CalendarDays className="size-4 text-orange-500" />
                                    {formatDeliveryDate(order.deliveryDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                    Requested on
                                </p>
                                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                    <Package className="size-4 text-orange-500" />
                                    {formatDateTime(order.createdAt)}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                    Delivery address
                                </p>
                                <p className="mt-1 flex items-start gap-2 text-sm">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />
                                    {order.deliveryAddress}
                                </p>
                            </div>
                            {order.message ? (
                                <div className="sm:col-span-2">
                                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                        Special instructions
                                    </p>
                                    <p className="mt-1 flex items-start gap-2 text-sm">
                                        <MessageSquare className="mt-0.5 size-4 shrink-0 text-orange-500" />
                                        {order.message}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {order.status === "pending" ? (
                            <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-amber-800">
                                    The restaurant has not answered yet. You can
                                    still cancel this order.
                                </p>
                                <CancelOrderButton orderId={order._id} />
                            </div>
                        ) : (
                            <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                                This order is {order.status} and can no longer
                                be cancelled or changed.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order status</CardTitle>
                        <CardDescription>
                            Statuses update as the restaurant responds.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        {[
                            {
                                label: "Pending",
                                active: order.status === "pending",
                                text: "Waiting for the restaurant to accept or reject.",
                            },
                            {
                                label: "Accepted",
                                active: order.status === "accepted",
                                text: "The restaurant confirmed your order.",
                            },
                            {
                                label: "Rejected",
                                active: order.status === "rejected",
                                text: "The restaurant could not fulfil this order.",
                            },
                            {
                                label: "Cancelled",
                                active: order.status === "cancelled",
                                text: "You cancelled this order before a decision.",
                            },
                        ].map((step) => (
                            <div
                                key={step.label}
                                className={
                                    step.active
                                        ? "rounded-lg border border-orange-200 bg-orange-50 p-3"
                                        : "rounded-lg border p-3 opacity-70"
                                }
                            >
                                <p className="font-semibold">{step.label}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
