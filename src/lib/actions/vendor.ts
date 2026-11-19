"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    vendorProfilesCollection,
} from "@/lib/db";
import { getImageFile, uploadImage } from "@/lib/upload";
import type { ActionResult } from "@/lib/types/dashboard";
import { guard } from "@/lib/actions/guard";

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

function revalidateVendor() {
    revalidatePath("/dashboard/vendor");
    revalidatePath("/dashboard/vendor/profile");
    revalidatePath("/dashboard/vendor/menu");
    revalidatePath("/dashboard/vendor/subscription");
    revalidatePath("/menu");
    revalidatePath("/");
}

export async function saveVendorProfile(
    _previous: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    const restaurantName = text(formData, "restaurantName");
    const description = text(formData, "description");
    const area = text(formData, "area");
    const city = text(formData, "city");

    if (restaurantName.length < 2 || restaurantName.length > 80) {
        return fail("Restaurant name must be between 2 and 80 characters.");
    }

    if (description.length < 10 || description.length > 1000) {
        return fail(
            "Restaurant description must be between 10 and 1000 characters."
        );
    }

    if (area.length < 2 || area.length > 60) {
        return fail("Area is required (2-60 characters).");
    }

    if (city.length < 2 || city.length > 60) {
        return fail("City is required (2-60 characters).");
    }

    const existing = await vendorProfilesCollection.findOne({
        userId: idFilter(user.id),
    });

    let image = existing?.image ?? "";
    const imageFile = getImageFile(formData, "image");

    if (imageFile) {
        try {
            image = await uploadImage(imageFile);
        } catch (uploadError) {
            return fail(
                uploadError instanceof Error
                    ? uploadError.message
                    : "The image could not be uploaded."
            );
        }
    }

    const now = new Date();
    const location = `${area}, ${city}`;

    await vendorProfilesCollection.updateOne(
        { userId: idFilter(user.id) },
        {
            $set: {
                restaurantName,
                description,
                area,
                city,
                image,
                updatedAt: now,
            },
            $setOnInsert: {
                _id: new ObjectId(),
                userId: user.id,
                subscriptionPlan: "free",
                createdAt: now,
            },
        },
        { upsert: true }
    );

    // Keep the denormalised vendor snapshot on menu items in sync.
    await menuItemsCollection.updateMany(
        { vendorId: idFilter(user.id) },
        {
            $set: {
                vendorName: restaurantName,
                vendorImage: image || undefined,
                vendorLocation: location,
                updatedAt: now,
            },
        }
    );

    revalidateVendor();

    return done("Restaurant profile saved successfully.");
}

/**
 * Cancels the automatic continuation of Premium. The current paid period is
 * preserved; the shared expiry helpers downgrade the vendor once it ends.
 */
export async function cancelPremium(): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    const profile = await vendorProfilesCollection.findOne({
        userId: idFilter(user.id),
    });

    if (!profile || profile.subscriptionPlan !== "premium") {
        return fail("You do not have an active Premium subscription.");
    }

    if (profile.subscriptionStatus === "cancelled") {
        return done(
            "Premium is already scheduled to end at the close of your paid period."
        );
    }

    await vendorProfilesCollection.updateOne(
        { userId: idFilter(user.id), subscriptionPlan: "premium" },
        {
            $set: {
                subscriptionStatus: "cancelled",
                updatedAt: new Date(),
            },
        }
    );

    revalidateVendor();

    return done(
        "Premium will stay active until the end of your paid period and will not continue after that."
    );
}
