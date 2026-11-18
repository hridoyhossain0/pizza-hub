import { getSessionUser } from "@/lib/session";
import type { UserRole } from "@/lib/roles";

/** Shape expected by the public menu pages. */
export interface CurrentUser {
    _id: string;
    role: UserRole;
}

/**
 * Returns the signed-in user in the shape used by the storefront, or `null`
 * for guests.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
    const user = await getSessionUser();

    if (!user) {
        return null;
    }

    return { _id: user.id, role: user.role };
}
