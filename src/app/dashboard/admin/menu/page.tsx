import Link from "next/link";
import { Search, UtensilsCrossed } from "lucide-react";

import { AdminMenuActions } from "@/components/dashboard/admin/menu-actions";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getAdminMenuItems } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { requireRole } from "@/lib/session";

export const instant = false;

const STATUS_OPTIONS = ["all", "pending", "approved", "rejected"] as const;

export default async function AdminMenuPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string }>;
}) {
    await requireRole("admin");
    const params = await searchParams;
    const q = params.q?.trim() ?? "";
    const status = STATUS_OPTIONS.includes(
        (params.status ?? "all") as (typeof STATUS_OPTIONS)[number]
    )
        ? (params.status ?? "all")
        : "all";

    const items = await getAdminMenuItems({ q, status });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Manage menu items"
                description="Review pending submissions, change the status of published items, and remove inappropriate content. Only approved and active items appear on the public menu."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Search and filter</CardTitle>
                    <CardDescription>
                        Search by item name or vendor name, then narrow the
                        results by approval status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        method="get"
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                name="q"
                                defaultValue={q}
                                placeholder="Search by item or vendor"
                                className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <select
                            name="status"
                            defaultValue={status}
                            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option === "all"
                                        ? "All statuses"
                                        : option.charAt(0).toUpperCase() +
                                          option.slice(1)}
                                </option>
                            ))}
                        </select>

                        <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                            Apply filters
                        </Button>

                        {q || status !== "all" ? (
                            <Button asChild variant="outline">
                                <Link href="/dashboard/admin/menu">
                                    Clear
                                </Link>
                            </Button>
                        ) : null}
                    </form>
                </CardContent>
            </Card>

            {items.length === 0 ? (
                <EmptyState
                    icon={UtensilsCrossed}
                    title="No menu items found"
                    description="Try a different search term or status filter."
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{items.length} menu items</CardTitle>
                        <CardDescription>
                            Rejected items are hidden from customers even if the
                            vendor marked them available.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 font-semibold">Item</th>
                                    <th className="pb-3 font-semibold">Vendor</th>
                                    <th className="pb-3 font-semibold">Price</th>
                                    <th className="pb-3 font-semibold">Submitted</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Availability</th>
                                    <th className="pb-3 text-right font-semibold">
                                        Review
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
                                                    <p className="max-w-48 truncate font-semibold">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.category} ·{" "}
                                                        {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <p className="max-w-40 truncate">
                                                {item.vendorName}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4 font-semibold">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="py-4 pr-4 text-muted-foreground">
                                            {formatDate(item.createdAt)}
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
                                            <AdminMenuActions
                                                itemId={item._id}
                                                itemName={item.name}
                                                status={item.status}
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
