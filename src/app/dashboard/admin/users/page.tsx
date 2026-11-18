import Link from "next/link";
import { Search, Users } from "lucide-react";

import { AdminUserActions } from "@/components/dashboard/admin/user-actions";
import { EmptyState } from "@/components/dashboard/empty-state";
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
import { getAdminUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/roles";
import { requireRole } from "@/lib/session";

export const instant = false;

const ROLE_OPTIONS = ["all", "customer", "vendor", "admin"] as const;

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; role?: string }>;
}) {
    await requireRole("admin");
    const params = await searchParams;
    const q = params.q?.trim() ?? "";
    const role = ROLE_OPTIONS.includes(
        (params.role ?? "all") as (typeof ROLE_OPTIONS)[number]
    )
        ? (params.role ?? "all")
        : "all";

    const users = await getAdminUsers({ q, role });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Manage users"
                description="View every registered account, search by name or email, filter by role, and block or unblock vendors and customers."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Search and filter</CardTitle>
                    <CardDescription>
                        Blocked users cannot sign in to protected dashboard
                        features or place orders.
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
                                placeholder="Search by name or email"
                                className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <select
                            name="role"
                            defaultValue={role}
                            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        >
                            {ROLE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option === "all"
                                        ? "All roles"
                                        : ROLE_LABELS[option]}
                                </option>
                            ))}
                        </select>

                        <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                            Apply filters
                        </Button>

                        {q || role !== "all" ? (
                            <Button asChild variant="outline">
                                <Link href="/dashboard/admin/users">
                                    Clear
                                </Link>
                            </Button>
                        ) : null}
                    </form>
                </CardContent>
            </Card>

            {users.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No users found"
                    description="Try a different search term or role filter."
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{users.length} users</CardTitle>
                        <CardDescription>
                            Administrator accounts are protected and cannot be
                            blocked.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="pb-3 font-semibold">User</th>
                                    <th className="pb-3 font-semibold">Role</th>
                                    <th className="pb-3 font-semibold">Joined</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 text-right font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <tr key={user._id} className="align-top">
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        className="size-10 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                                                        {user.name
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <Badge variant="secondary">
                                                {ROLE_LABELS[user.role]}
                                            </Badge>
                                        </td>
                                        <td className="py-4 pr-4 text-muted-foreground">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <StatusBadge
                                                status={
                                                    user.blocked
                                                        ? "blocked"
                                                        : "active"
                                                }
                                            />
                                        </td>
                                        <td className="py-4">
                                            <AdminUserActions
                                                userId={user._id}
                                                userName={user.name}
                                                blocked={user.blocked}
                                                role={user.role}
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
