import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { normalizeUserRole, ROLE_HOME, type UserRole } from "@/lib/roles";

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
    blocked: boolean;
    roleConfigured: boolean;
    createdAt: Date;
}

/**
 * Raw Better Auth session (server-side). Memoized per request so the layout
 * and page guards share a single lookup.
 */
export const getSession = cache(async () => {
    return auth.api.getSession({ headers: await headers() });
});

/**
 * Returns the signed-in user with a normalized role, or `null` when the
 * request is not authenticated.
 */
export const getSessionUser = cache(
    async (): Promise<SessionUser | null> => {
        const session = await getSession();

        if (!session?.user) {
            return null;
        }

        const { user } = session;

        // `role` is an additional field on the user model. Read it defensively
        // so accounts created before the field existed still resolve to a
        // valid role.
        const role = normalizeUserRole(
            (user as { role?: unknown }).role
        );
        const blocked = (user as { isBlocked?: unknown }).isBlocked === true;
        const roleConfigured =
            (user as { roleConfigured?: unknown }).roleConfigured === true;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? null,
            role,
            blocked,
            roleConfigured,
            createdAt: user.createdAt,
        };
    }
);

/** Server-side guard for authenticated pages. Redirects to sign-in. */
export async function requireUser(): Promise<SessionUser> {
    const user = await getSessionUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.blocked) {
        redirect("/blocked");
    }

    return user;
}

/**
 * Server-side authorization guard. Unauthenticated visitors are sent to
 * sign-in, authenticated visitors without an allowed role are redirected to
 * their own dashboard.
 */
export async function requireRole(
    allowed: UserRole | UserRole[]
): Promise<SessionUser> {
    const user = await requireUser();
    const roles = Array.isArray(allowed) ? allowed : [allowed];

    if (!roles.includes(user.role)) {
        redirect(ROLE_HOME[user.role]);
    }

    return user;
}
