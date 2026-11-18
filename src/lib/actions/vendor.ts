"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

import {
    menuItemsCollection,
    transactionsCollection,
    vendorProfilesCollection,
} from "@/lib/db";
import { getImageFile, uploadImageToImgBb } from "@/lib/imgbb";
import {
    PREMIUM_PRICE,
    type ActionResult,
} from "@/lib/types/dashboard";
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
        userId: user.id,
    });

    let image = existing?.image ?? "";
    const imageFile = getImageFile(formData, "image");

    if (imageFile) {
        try {
            image = await uploadImageToImgBb(imageFile);
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
        { userId: user.id },
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
        { vendorId: user.id },
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

export async function upgradeToPremium(): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    const profile = await vendorProfilesCollection.findOne({
        userId: user.id,
    });

    if (!profile) {
        return fail(
            "Create your restaurant profile before upgrading your subscription."
        );
    }

    if (profile.subscriptionPlan === "premium") {
        return done("Your subscription is already Premium.");
    }

    const now = new Date();

    await transactionsCollection.insertOne({
        _id: new ObjectId(),
        vendorId: user.id,
        vendorName: profile.restaurantName,
        plan: "premium",
        amount: PREMIUM_PRICE,
        paymentStatus: "paid",
        transactionDate: now,
        createdAt: now,
    });

    await vendorProfilesCollection.updateOne(
        { userId: user.id },
        {
            $set: {
                subscriptionPlan: "premium",
                premiumSince: now,
                updatedAt: now,
            },
        }
    );

    await menuItemsCollection.updateMany(
        { vendorId: user.id },
        { $set: { premium: true, updatedAt: now } }
    );

    revalidateVendor();

    return done(
        "Welcome to Premium! You can now publish unlimited menu items with a Premium badge and featured placement."
    );
}
