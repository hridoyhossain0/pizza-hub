"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

import {
    menuItemsCollection,
    sessionsCollection,
    usersCollection,
} from "@/lib/db";
import type {
    ActionResult,
    MenuStatus,
} from "@/lib/types/dashboard";
import { guard } from "@/lib/actions/guard";

function fail(message: string): ActionResult {
    return { ok: false, message };
}

function done(message: string): ActionResult {
    return { ok: true, message };
}

function revalidateAdmin() {
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/admin/menu");
    revalidatePath("/dashboard/admin/transactions");
    revalidatePath("/menu");
    revalidatePath("/");
}

export async function setUserBlocked(
    userId: string,
    blocked: boolean
): Promise<ActionResult> {
    const { user, error } = await guard(["admin"]);

    if (!user) {
        return fail(error);
    }

    if (userId === user.id) {
        return fail("You cannot block your own administrator account.");
    }

    const target = await usersCollection.findOne({ _id: userId });

    if (!target) {
        return fail("User not found.");
    }

    if (target.role === "admin") {
        return fail("Administrator accounts cannot be blocked.");
    }

    await usersCollection.updateOne(
        { _id: userId },
        { $set: { blocked, updatedAt: new Date() } }
    );

    if (blocked) {
        // Invalidate every active session immediately.
        await sessionsCollection.deleteMany({ userId });
    }

    revalidateAdmin();

    return done(
        blocked
            ? "User blocked. Their active sessions have been signed out."
            : "User unblocked successfully."
    );
}

export async function setMenuItemStatus(
    itemId: string,
    status: MenuStatus
): Promise<ActionResult> {
    const { user, error } = await guard(["admin"]);

    if (!user) {
        return fail(error);
    }

    if (
        status !== "pending" &&
        status !== "approved" &&
        status !== "rejected"
    ) {
        return fail("Invalid menu item status.");
    }

    if (!ObjectId.isValid(itemId)) {
        return fail("The selected menu item could not be found.");
    }

    const result = await menuItemsCollection.updateOne(
        { _id: new ObjectId(itemId) },
        { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        return fail("Menu item not found.");
    }

    revalidateAdmin();

    return done(
        status === "approved"
            ? "Menu item approved. It is now visible on the public menu when active."
            : status === "rejected"
              ? "Menu item rejected. It is hidden from customers."
              : "Menu item moved back to pending review."
    );
}

export async function adminDeleteMenuItem(
    itemId: string
): Promise<ActionResult> {
    const { user, error } = await guard(["admin"]);

    if (!user) {
        return fail(error);
    }

    if (!ObjectId.isValid(itemId)) {
        return fail("The selected menu item could not be found.");
    }

    const result = await menuItemsCollection.deleteOne({
        _id: new ObjectId(itemId),
    });

    if (result.deletedCount === 0) {
        return fail("Menu item not found.");
    }

    revalidateAdmin();

    return done("Menu item deleted.");
}
