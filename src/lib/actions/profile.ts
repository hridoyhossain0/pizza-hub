"use server";

import { revalidatePath } from "next/cache";

import { guard } from "@/lib/actions/guard";
import { idFilter, usersCollection } from "@/lib/db";
import { getImageFile, uploadImage } from "@/lib/upload";
import type { ActionResult } from "@/lib/types/dashboard";

const PROTECTED_FIELDS = [
    "role",
    "roleConfigured",
    "blocked",
    "isBlocked",
    "email",
    "businessName",
    "businessDescription",
    "businessArea",
    "businessCity",
    "businessImage",
    "subscriptionPlan",
    "subscriptionStatus",
    "subscriptionExpiresAt",
    "premiumSince",
] as const;

function text(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): ActionResult {
    return { ok: false, message };
}

function done(message: string): ActionResult {
    return { ok: true, message };
}

/**
 * Updates the account-level profile shared by every role.
 *
 * Only `name` and `image` are accepted. Role, blocked state and subscription
 * fields are deliberately rejected even if a crafted request includes them —
 * those values are only changed by administrators or the payment webhook.
 */
export async function saveAccountProfile(
    _previous: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    const { user, error } = await guard();

    if (!user) {
        return fail(error);
    }

    if (PROTECTED_FIELDS.some((field) => formData.has(field))) {
        return fail(
            "Your role, email and subscription details cannot be changed from this form."
        );
    }

    const name = text(formData, "name");

    if (name.length < 2 || name.length > 80) {
        return fail("Your name must be between 2 and 80 characters.");
    }

    let image = user.image ?? "";
    const imageFile = getImageFile(formData, "image");

    if (imageFile) {
        try {
            image = await uploadImage(imageFile);
        } catch (uploadError) {
            return fail(
                uploadError instanceof Error
                    ? uploadError.message
                    : "The profile image could not be uploaded."
            );
        }
    } else if (text(formData, "removeImage") === "on") {
        image = "";
    }

    const now = new Date();

    const result = await usersCollection.updateOne(
        { _id: idFilter(user.id) },
        {
            $set: {
                name,
                image: image || null,
                updatedAt: now,
            },
        }
    );

    if (result.matchedCount === 0) {
        return fail("Your account could not be found. Please sign in again.");
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/customer/profile");
    revalidatePath("/dashboard/vendor");
    revalidatePath("/dashboard/vendor/profile");
    revalidatePath("/menu");
    revalidatePath("/");

    return done("Your profile has been updated successfully.");
}
