"use server";

import { revalidatePath } from "next/cache";

import { usersCollection } from "@/lib/db";
import type { ActionResult } from "@/lib/types/dashboard";
import { guard } from "@/lib/actions/guard";

/**
 * Assigns the account type chosen on the sign-up form.
 *
 * Only `customer` and `vendor` are accepted, and an existing vendor/admin
 * role can never be changed through this endpoint. Administrators are
 * created out-of-band (see `scripts/set-role.mjs`).
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

    if (user.role === "vendor" || user.role === "admin") {
        return {
            ok: true,
            message: "Your account role is already configured.",
        };
    }

    await usersCollection.updateOne(
        { _id: user.id },
        {
            $set: {
                role,
                blocked: false,
                updatedAt: new Date(),
            },
        }
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/vendor");

    return { ok: true, message: "Account type saved." };
}
