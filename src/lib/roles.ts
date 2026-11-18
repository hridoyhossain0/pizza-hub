/**
 * Single source of truth for user roles.
 *
 * The role value is stored on the Better Auth user record (see
 * `src/lib/auth.ts`) and is always read from the session — never from
 * client input, cookies or URL parameters.
 */

export const USER_ROLES = ["customer", "vendor", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Role assigned to accounts that do not have one yet. */
export const DEFAULT_USER_ROLE: UserRole = "customer";

export const ROLE_LABELS: Record<UserRole, string> = {
    customer: "Customer",
    vendor: "Vendor",
    admin: "Administrator",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    customer: "Browse the menu, follow your orders and manage your profile.",
    vendor: "Manage your store, menu and the orders customers place with you.",
    admin: "Oversee the marketplace, its vendors, customers and menus.",
};

/** What each role is allowed to do in the dashboard. */
export const ROLE_CAPABILITIES: Record<UserRole, string[]> = {
    customer: [
        "Browse the full menu and place orders",
        "Track your orders and order history",
        "Manage your account details",
    ],
    vendor: [
        "Manage your store profile",
        "Publish and update menu items",
        "Handle incoming orders",
    ],
    admin: [
        "Manage customers, vendors and accounts",
        "Approve or reject menu submissions",
        "Monitor the whole marketplace",
    ],
};

/** Landing page shown after signing in with a given role. */
export const ROLE_HOME: Record<UserRole, string> = {
    customer: "/dashboard/customer",
    vendor: "/dashboard/vendor",
    admin: "/dashboard/admin",
};

export function isUserRole(value: unknown): value is UserRole {
    return (
        typeof value === "string" &&
        (USER_ROLES as readonly string[]).includes(value)
    );
}

/**
 * Coerces an unknown value (e.g. a session field that is missing for
 * accounts created before roles existed) into a valid role.
 */
export function normalizeUserRole(value: unknown): UserRole {
    return isUserRole(value) ? value : DEFAULT_USER_ROLE;
}
