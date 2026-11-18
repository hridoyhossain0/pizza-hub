import {
    ClipboardList,
    CreditCard,
    House,
    LayoutDashboard,
    PlusCircle,
    Receipt,
    ShoppingBag,
    Store,
    Users,
    UtensilsCrossed,
    type LucideIcon,
} from "lucide-react";

import { USER_ROLES, type UserRole } from "@/lib/roles";

export interface DashboardNavItem {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    /** Roles allowed to see (and open) this item. */
    roles: readonly UserRole[];
    /** Match the pathname exactly instead of treating it as a prefix. */
    exact?: boolean;
}

export interface DashboardNavGroup {
    label: string;
    items: DashboardNavItem[];
}

const ALL_ROLES = USER_ROLES;

/**
 * Declarative navigation model. The sidebar never hardcodes the current
 * user's role — it renders whatever this configuration returns for the
 * role resolved from the server session.
 */
export const DASHBOARD_NAVIGATION: DashboardNavGroup[] = [
    {
        label: "Dashboard",
        items: [
            {
                title: "Overview",
                description: "A summary of your customer activity.",
                href: "/dashboard/customer",
                icon: LayoutDashboard,
                roles: ["customer"],
                exact: true,
            },
            {
                title: "Overview",
                description: "A summary of your restaurant.",
                href: "/dashboard/vendor",
                icon: LayoutDashboard,
                roles: ["vendor"],
                exact: true,
            },
            {
                title: "Overview",
                description: "A summary of the PizzaHub platform.",
                href: "/dashboard/admin",
                icon: LayoutDashboard,
                roles: ["admin"],
                exact: true,
            },
        ],
    },
    {
        label: "Customer",
        items: [
            {
                title: "My Orders",
                description: "Track your orders and cancel pending ones.",
                href: "/dashboard/customer/orders",
                icon: ShoppingBag,
                roles: ["customer"],
            },
        ],
    },
    {
        label: "Vendor",
        items: [
            {
                title: "Add Menu Item",
                description: "Create a new dish for admin review.",
                href: "/dashboard/vendor/add-item",
                icon: PlusCircle,
                roles: ["vendor"],
            },
            {
                title: "My Menu Items",
                description: "Update, delete and manage availability.",
                href: "/dashboard/vendor/menu",
                icon: UtensilsCrossed,
                roles: ["vendor"],
            },
            {
                title: "Customer Orders",
                description: "Accept or reject incoming orders.",
                href: "/dashboard/vendor/orders",
                icon: ClipboardList,
                roles: ["vendor"],
            },
            {
                title: "Subscription",
                description: "Compare plans and upgrade to Premium.",
                href: "/dashboard/vendor/subscription",
                icon: CreditCard,
                roles: ["vendor"],
            },
            {
                title: "Restaurant Profile",
                description: "Manage your public restaurant details.",
                href: "/dashboard/vendor/profile",
                icon: Store,
                roles: ["vendor"],
            },
        ],
    },
    {
        label: "Admin",
        items: [
            {
                title: "Manage Users",
                description: "Search, inspect, block and unblock accounts.",
                href: "/dashboard/admin/users",
                icon: Users,
                roles: ["admin"],
            },
            {
                title: "Manage Menu Items",
                description: "Approve, reject or remove submitted items.",
                href: "/dashboard/admin/menu",
                icon: UtensilsCrossed,
                roles: ["admin"],
            },
            {
                title: "Transactions",
                description: "Review subscription payment records.",
                href: "/dashboard/admin/transactions",
                icon: Receipt,
                roles: ["admin"],
            },
        ],
    },
    {
        label: "Explore",
        items: [
            {
                title: "Browse Menu",
                description: "Explore approved dishes from PizzaHub vendors.",
                href: "/menu",
                icon: UtensilsCrossed,
                roles: ALL_ROLES,
            },
            {
                title: "Back to Store",
                description: "Return to the public PizzaHub storefront.",
                href: "/",
                icon: House,
                roles: ALL_ROLES,
                exact: true,
            },
        ],
    },
];

/** Navigation visible to a role, with empty groups removed. */
export function getNavigationForRole(role: UserRole): DashboardNavGroup[] {
    return DASHBOARD_NAVIGATION.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.roles.includes(role)),
    })).filter((group) => group.items.length > 0);
}

/** Flat title lookup used by breadcrumbs. */
export function getNavTitleForPath(pathname: string): string | undefined {
    const items = DASHBOARD_NAVIGATION.flatMap((group) => group.items);

    return items.find((item) =>
        item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.title;
}
