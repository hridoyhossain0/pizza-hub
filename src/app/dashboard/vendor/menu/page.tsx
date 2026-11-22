import Link from "next/link";
import {
    Eye,
    PlusCircle,
    Store,
    UtensilsCrossed,
} from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { MenuRowActions } from "@/components/dashboard/vendor/menu-row-actions";
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
    getVendorProfile,
    getVendorStats,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function VendorMenuPage() {
    const user = await requireRole("vendor");
    const [profile, items, stats] = await Promise.all([
        getVendorProfile(user.id),
        getVendorMenuItems(user.id),
        getVendorStats(user.id),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="My menu items"
                description="Only your own submissions are shown here, with their admin approval status."
            >
                <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                    <Link href="/dashboard/vendor/add-item">
                        <PlusCircle aria-hidden="true" />
                        Add menu item
                    </Link>
                </Button>
            </PageHeader>

            {!profile ? (
                <Card className="border-orange-200 bg-orange-50/60">
                    <CardContent className="flex items-center justify-between gap-4 py-2">
                        <p className="text-sm font-medium">
                            Create your restaurant profile before publishing
                            menu items.
                        </p>
                        <Button asChild size="sm">
                            <Link href="/dashboard/vendor/profile">
                                Create profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : null}

            {stats.plan === "free" ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    <strong>Free plan:</strong> {stats.activeItems} of 3 active
                    items used.{" "}
                    <Link
                        href="/dashboard/vendor/subscription"
                        className="font-bold underline"
                    >
                        Upgrade to Premium
                    </Link>{" "}
                    for unlimited items.
                </p>
            ) : (
                <p className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                    <strong>Premium plan:</strong> unlimited active menu items
                    plus featured placement and a Premium badge.
                </p>
            )}

            {items.length === 0 ? (
                <EmptyState
                    icon={UtensilsCrossed}
                    title="No menu items yet"
                    description="Add your first dish. It will be reviewed by an administrator before appearing on the public menu."
                >
                    <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                        <Link href="/dashboard/vendor/add-item">
                            <PlusCircle aria-hidden="true" />
                            Add your first item
                        </Link>
                    </Button>
                </EmptyState>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Submitted items ({items.length})</CardTitle>
                        <CardDescription>
                            Rejected items are never visible to customers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 font-semibold">Item</th>
                                    <th className="pb-3 font-semibold">Category</th>
                                    <th className="pb-3 font-semibold">Price</th>
                                    <th className="pb-3 font-semibold">Approval</th>
                                    <th className="pb-3 font-semibold">Availability</th>
                                    <th className="pb-3 text-right font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items.map((item) => (
                                    <tr key={item._id} className="align-top">
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="size-12 shrink-0 rounded-lg object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {item.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {item.location} ·{" "}
                                                        {formatDate(
                                                            item.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">{item.category}</td>
                                        <td className="py-4 pr-4 font-semibold">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge
                                                status={
                                                    item.isActive
                                                        ? "active"
                                                        : "inactive"
                                                }
                                            />
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col items-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/dashboard/vendor/menu/${item._id}`}
                                                    >
                                                        <Eye aria-hidden="true" />
                                                        View / edit
                                                    </Link>
                                                </Button>
                                                <MenuRowActions
                                                    itemId={item._id}
                                                    itemName={item.name}
                                                    isActive={item.isActive}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {!profile ? (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Store className="size-4" />
                    Your restaurant name is shown on every menu item.
                </p>
            ) : null}
        </div>
    );
}
