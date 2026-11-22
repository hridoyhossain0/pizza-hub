"use server";

import { revalidatePath } from "next/cache";

import { idFilter, usersCollection } from "@/lib/db";
import type { ActionResult } from "@/lib/types/dashboard";
import { ROLE_HOME } from "@/lib/roles";
import { guard } from "@/lib/actions/guard";

/**
 * Assigns the account type chosen on the sign-up form (email or Google).
 *
 * Only `customer` and `vendor` are accepted. `roleConfigured` makes this a
 * one-time operation, so a signed-in user can never switch roles later, and
 * administrators can never be created through this endpoint.
 */
export async function setInitialRole(
    role: "customer" | "vendor"
): Promise<ActionResult> {
    const { user, error } = await guard();

    if (!user) {
        return { ok: false, message: error };
    }

    if (role !== "customer" && role !== "vendor") {
        return { ok: false, message: "Invalid account type." };
    }

    if (user.role === "admin") {
        return { ok: true, message: "Your account role is already configured." };
    }

    if (user.roleConfigured) {
        return {
            ok: true,
            message: "Your account role is already configured.",
        };
    }

    await usersCollection.updateOne(
        { _id: idFilter(user.id) },
        {
            $set: {
                role,
                roleConfigured: true,
                isBlocked: false,
                updatedAt: new Date(),
            },
        }
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/vendor");
    revalidatePath("/", "layout");

    return {
        ok: true,
        message: `Account type saved. Welcome to your ${ROLE_HOME[role] ? "dashboard" : "account"}.`,
    };
}
