import {
    BadgeCheck,
    ClipboardList,
    CreditCard,
    House,
    LayoutDashboard,
    PlusCircle,
    Receipt,
    ShieldCheck,
    ShoppingBag,
    Store,
    UserRound,
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
                description: "A summary of your PizzaHub workspace.",
                href: "/dashboard",
                icon: LayoutDashboard,
                roles: ALL_ROLES,
                exact: true,
            },
        ],
    },
    {
        label: "Customer",
        items: [
            {
                title: "Overview",
                description: "Your order activity at a glance.",
                href: "/dashboard/customer",
                icon: UserRound,
                roles: ["customer"],
                exact: true,
            },
            {
                title: "My Orders",
                description: "Track and manage the orders you placed.",
                href: "/dashboard/customer/orders",
                icon: ShoppingBag,
                roles: ["customer"],
            },
            {
                title: "My Profile",
                description: "Update your name and profile image.",
                href: "/dashboard/customer/profile",
                icon: UserRound,
                roles: ["customer"],
            },
        ],
    },
    {
        label: "My Restaurant",
        items: [
            {
                title: "Overview",
                description: "Menu, orders, and subscription at a glance.",
                href: "/dashboard/vendor",
                icon: Store,
                roles: ["vendor"],
                exact: true,
            },
            {
                title: "Add Menu Item",
                description: "Submit a new dish for admin approval.",
                href: "/dashboard/vendor/add-item",
                icon: PlusCircle,
                roles: ["vendor"],
            },
            {
                title: "My Menu Items",
                description: "Update, remove, or pause your dishes.",
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
                title: "Restaurant Profile",
                description: "Manage the public details of your restaurant.",
                href: "/dashboard/vendor/profile",
                icon: Store,
                roles: ["vendor"],
            },
            {
                title: "Subscription",
                description: "Manage your Free or Premium plan.",
                href: "/dashboard/vendor/subscription",
                icon: CreditCard,
                roles: ["vendor"],
            },
        ],
    },
    {
        label: "Administration",
        items: [
            {
                title: "Overview",
                description: "Platform-wide activity at a glance.",
                href: "/dashboard/admin",
                icon: ShieldCheck,
                roles: ["admin"],
                exact: true,
            },
            {
                title: "Manage Users",
                description: "Search, inspect, block, and unblock accounts.",
                href: "/dashboard/admin/users",
                icon: Users,
                roles: ["admin"],
            },
            {
                title: "Manage Menu Items",
                description: "Approve, reject, and remove submissions.",
                href: "/dashboard/admin/menu",
                icon: BadgeCheck,
                roles: ["admin"],
            },
            {
                title: "Transactions",
                description: "Read-only subscription payment records.",
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

/**
 * Flat title lookup used by breadcrumbs. Exact matches win, then the most
 * specific path prefix (so `/dashboard/vendor/menu/:id` resolves to
 * "My Menu Items" instead of the parent Overview entry).
 */
export function getNavTitleForPath(pathname: string): string | undefined {
    const items = DASHBOARD_NAVIGATION.flatMap((group) => group.items);

    const exact = items.find(
        (item) => item.exact && pathname === item.href
    );

    if (exact) {
        return exact.title;
    }

    return items
        .filter(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
        )
        .sort((a, b) => b.href.length - a.href.length)[0]?.title;
}
