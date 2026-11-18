"use server";

import { revalidatePath } from "next/cache";
import { ObjectId, type Filter } from "mongodb";

import {
    menuItemsCollection,
    vendorProfilesCollection,
    type MenuItemDocument,
} from "@/lib/db";
import { getImageFile, uploadImageToImgBb } from "@/lib/imgbb";
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

function revalidateMenus() {
    revalidatePath("/dashboard/vendor");
    revalidatePath("/dashboard/vendor/menu");
    revalidatePath("/dashboard/admin/menu");
    revalidatePath("/dashboard/admin");
    revalidatePath("/menu");
    revalidatePath("/");
}

function parseMenuFields(
    formData: FormData
):
    | { ok: false; error: string }
    | {
          ok: true;
          data: {
              name: string;
              category: string;
              description: string;
              location: string;
              price: number;
          };
      } {
    const name = text(formData, "name");
    const category = text(formData, "category");
    const description = text(formData, "description");
    const location = text(formData, "location");
    const price = Number(text(formData, "price"));

    if (name.length < 3 || name.length > 80) {
        return {
            ok: false,
            error: "Item name must be between 3 and 80 characters.",
        };
    }

    if (!category) {
        return { ok: false, error: "Please choose a category." };
    }

    if (description.length < 10 || description.length > 1000) {
        return {
            ok: false,
            error: "Description must be between 10 and 1000 characters.",
        };
    }

    if (!Number.isFinite(price) || price <= 0 || price > 100000) {
        return {
            ok: false,
            error: "Enter a valid price greater than 0.",
        };
    }

    if (location.length < 2 || location.length > 120) {
        return {
            ok: false,
            error: "Location (area / city) is required.",
        };
    }

    return {
        ok: true,
        data: {
            name,
            category,
            description,
            location,
            price: Math.round(price * 100) / 100,
        },
    };
}

async function countActiveItems(vendorId: string, excludeId?: ObjectId) {
    const filter: Filter<MenuItemDocument> = {
        vendorId,
        isActive: true,
        status: { $ne: "rejected" },
    };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    return menuItemsCollection.countDocuments(filter);
}

export async function createMenuItem(
    _previous: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    const parsed = parseMenuFields(formData);

    if (!parsed.ok) {
        return fail(parsed.error);
    }

    const image = getImageFile(formData, "image");

    if (!image) {
        return fail("Please upload an image for this menu item.");
    }

    const profile = await vendorProfilesCollection.findOne({
        userId: user.id,
    });

    if (!profile) {
        return fail(
            "Create your restaurant profile before adding menu items."
        );
    }

    if (profile.subscriptionPlan !== "premium") {
        const activeItems = await countActiveItems(user.id);

        if (activeItems >= 3) {
            return fail(
                "Your Free plan allows a maximum of 3 active menu items. Upgrade to Premium for unlimited items."
            );
        }
    }

    let imageUrl: string;

    try {
        imageUrl = await uploadImageToImgBb(image);
    } catch (uploadError) {
        return fail(
            uploadError instanceof Error
                ? uploadError.message
                : "The image could not be uploaded."
        );
    }

    const now = new Date();

    await menuItemsCollection.insertOne({
        _id: new ObjectId(),
        vendorId: user.id,
        vendorName: profile.restaurantName,
        vendorImage: profile.image || undefined,
        vendorLocation: `${profile.area}, ${profile.city}`,
        ...parsed.data,
        image: imageUrl,
        status: "pending",
        isActive: true,
        premium: profile.subscriptionPlan === "premium",
        createdAt: now,
        updatedAt: now,
    });

    revalidateMenus();

    return done(
        "Menu item submitted successfully. It is pending admin approval."
    );
}

export async function updateMenuItem(
    _previous: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    const itemId = text(formData, "itemId");

    if (!ObjectId.isValid(itemId)) {
        return fail("The selected menu item could not be found.");
    }

    const existing = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        vendorId: user.id,
    });

    if (!existing) {
        return fail("Menu item not found or you do not have access to it.");
    }

    const parsed = parseMenuFields(formData);

    if (!parsed.ok) {
        return fail(parsed.error);
    }

    let imageUrl = existing.image;
    const image = getImageFile(formData, "image");

    if (image) {
        try {
            imageUrl = await uploadImageToImgBb(image);
        } catch (uploadError) {
            return fail(
                uploadError instanceof Error
                    ? uploadError.message
                    : "The image could not be uploaded."
            );
        }
    }

    const profile = await vendorProfilesCollection.findOne({
        userId: user.id,
    });

    await menuItemsCollection.updateOne(
        { _id: existing._id, vendorId: user.id },
        {
            $set: {
                ...parsed.data,
                image: imageUrl,
                vendorName: profile?.restaurantName ?? existing.vendorName,
                vendorImage: profile?.image || existing.vendorImage,
                vendorLocation: profile
                    ? `${profile.area}, ${profile.city}`
                    : existing.vendorLocation,
                premium: profile?.subscriptionPlan === "premium",
                updatedAt: new Date(),
            },
        }
    );

    revalidateMenus();

    return done("Menu item updated successfully.");
}

export async function deleteMenuItem(
    itemId: string
): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    if (!ObjectId.isValid(itemId)) {
        return fail("The selected menu item could not be found.");
    }

    const result = await menuItemsCollection.deleteOne({
        _id: new ObjectId(itemId),
        vendorId: user.id,
    });

    if (result.deletedCount === 0) {
        return fail("Menu item not found or you do not have access to it.");
    }

    revalidateMenus();

    return done("Menu item deleted.");
}

export async function setMenuItemAvailability(
    itemId: string,
    isActive: boolean
): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    if (!ObjectId.isValid(itemId)) {
        return fail("The selected menu item could not be found.");
    }

    const item = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        vendorId: user.id,
    });

    if (!item) {
        return fail("Menu item not found or you do not have access to it.");
    }

    if (isActive && item.status !== "rejected") {
        const plan = await vendorProfilesCollection.findOne(
            { userId: user.id },
            { projection: { subscriptionPlan: 1 } }
        );

        if (plan?.subscriptionPlan !== "premium") {
            const activeItems = await countActiveItems(user.id, item._id);

            if (activeItems >= 3) {
                return fail(
                    "Your Free plan allows a maximum of 3 active menu items. Upgrade to Premium to activate more."
                );
            }
        }
    }

    await menuItemsCollection.updateOne(
        { _id: item._id, vendorId: user.id },
        { $set: { isActive, updatedAt: new Date() } }
    );

    revalidateMenus();

    return done(
        isActive
            ? "Menu item is now available."
            : "Menu item is now unavailable."
    );
}
