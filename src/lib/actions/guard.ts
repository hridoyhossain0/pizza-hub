import "server-only";

import type { UserRole } from "@/lib/roles";
import { getSessionUser, type SessionUser } from "@/lib/session";

type GuardResult =
    | { user: SessionUser; error: null }
    | { user: null; error: string };

/**
 * Authoritative authorization check for server actions and route handlers.
 * The role always comes from the server session, never from the request body.
 */
export async function guard(roles?: UserRole[]): Promise<GuardResult> {
    const user = await getSessionUser();

    if (!user) {
        return { user: null, error: "You must be signed in to continue." };
    }

    if (user.blocked) {
        return {
            user: null,
            error: "Your account has been blocked by an administrator.",
        };
    }

    if (roles && !roles.includes(user.role)) {
        return {
            user: null,
            error: "You do not have permission to perform this action.",
        };
    }

    return { user, error: null };
}
