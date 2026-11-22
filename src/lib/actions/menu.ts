"use server";

import { revalidatePath } from "next/cache";
import { ObjectId, type Filter } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    type MenuItemDocument,
} from "@/lib/db";
import { getImageFiles, uploadImages } from "@/lib/upload";
import { expireVendorSubscription } from "@/lib/payments";
import {
    FREE_ACTIVE_ITEM_LIMIT,
    MENU_CATEGORIES,
    MAX_ITEM_IMAGES,
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
              itemName: string;
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

    if (!(MENU_CATEGORIES as readonly string[]).includes(category)) {
        return { ok: false, error: "Please choose one of the six categories." };
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
            itemName: name,
            category,
            description,
            location,
            price: Math.round(price * 100) / 100,
        },
    };
}

async function imageUrlsFrom(formData: FormData): Promise<string[]> {
    const files = getImageFiles(formData, "images", MAX_ITEM_IMAGES);

    if (files.length === 0) {
        return [];
    }

    return uploadImages(files);
}

async function countActiveItems(vendorId: string, excludeId?: ObjectId) {
    // "Active" = published or awaiting review; rejected/inactive items do not
    // consume a Free-plan slot.
    const filter: Filter<MenuItemDocument> = {
        vendorId: idFilter(vendorId),
        status: { $in: ["pending", "approved"] },
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

    if (getImageFiles(formData, "images", MAX_ITEM_IMAGES).length === 0) {
        return fail("Please upload at least one image for this menu item.");
    }

    // Lazy expiry ensures an overdue Premium subscription is treated as Free.
    const vendor = await expireVendorSubscription(user.id);

    if (!vendor?.businessName) {
        return fail(
            "Create your restaurant profile before adding menu items."
        );
    }

    if (vendor.subscriptionPlan !== "premium") {
        const activeItems = await countActiveItems(user.id);

        if (activeItems >= FREE_ACTIVE_ITEM_LIMIT) {
            return fail(
                `Your Free plan allows a maximum of ${FREE_ACTIVE_ITEM_LIMIT} active menu items. Upgrade to Premium for unlimited items.`
            );
        }
    }

    let images: string[];

    try {
        images = await imageUrlsFrom(formData);
    } catch (uploadError) {
        return fail(
            uploadError instanceof Error
                ? uploadError.message
                : "The image could not be uploaded."
        );
    }

    const now = new Date();
    const location = `${vendor.businessArea ?? ""}, ${
        vendor.businessCity ?? ""
    }`.replace(/^, |, $/g, "");

    await menuItemsCollection.insertOne({
        _id: new ObjectId(),
        vendorId: user.id,
        vendorName: vendor.businessName,
        vendorImage: vendor.businessImage || undefined,
        vendorLocation: location || parsed.data.location,
        ...parsed.data,
        images,
        status: "pending",
        premium: vendor.subscriptionPlan === "premium",
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
        vendorId: idFilter(user.id),
    });

    if (!existing) {
        return fail("Menu item not found or you do not have access to it.");
    }

    const parsed = parseMenuFields(formData);

    if (!parsed.ok) {
        return fail(parsed.error);
    }

    let images = existing.images ?? [];

    if (getImageFiles(formData, "images", MAX_ITEM_IMAGES).length > 0) {
        try {
            images = await imageUrlsFrom(formData);
        } catch (uploadError) {
            return fail(
                uploadError instanceof Error
                    ? uploadError.message
                    : "The image could not be uploaded."
            );
        }
    }

    const vendor = await expireVendorSubscription(user.id);

    await menuItemsCollection.updateOne(
        { _id: existing._id, vendorId: idFilter(user.id) },
        {
            $set: {
                ...parsed.data,
                images,
                vendorName: vendor?.businessName ?? existing.vendorName,
                vendorImage:
                    vendor?.businessImage || existing.vendorImage,
                vendorLocation: vendor
                    ? `${vendor.businessArea ?? ""}, ${
                          vendor.businessCity ?? ""
                      }`.replace(/^, |, $/g, "") || existing.vendorLocation
                    : existing.vendorLocation,
                premium: vendor?.subscriptionPlan === "premium",
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
        vendorId: idFilter(user.id),
    });

    if (result.deletedCount === 0) {
        return fail("Menu item not found or you do not have access to it.");
    }

    revalidateMenus();

    return done("Menu item deleted.");
}

/**
 * Toggles availability by moving an approved item between `approved` and
 * `inactive`. Items still awaiting review (or rejected) cannot be published by
 * the vendor — only an admin approval can do that.
 */
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
        vendorId: idFilter(user.id),
    });

    if (!item) {
        return fail("Menu item not found or you do not have access to it.");
    }

    if (item.status === "rejected") {
        return fail("A rejected item cannot be made available.");
    }

    if (isActive && item.status === "pending") {
        return fail(
            "This item is still awaiting admin approval and cannot be published yet."
        );
    }

    if (isActive && item.status !== "approved") {
        const vendor = await expireVendorSubscription(user.id);

        if (vendor?.subscriptionPlan !== "premium") {
            const activeItems = await countActiveItems(user.id, item._id);

            if (activeItems >= FREE_ACTIVE_ITEM_LIMIT) {
                return fail(
                    `Your Free plan allows a maximum of ${FREE_ACTIVE_ITEM_LIMIT} active menu items. Upgrade to Premium to activate more.`
                );
            }
        }
    }

    await menuItemsCollection.updateOne(
        { _id: item._id, vendorId: idFilter(user.id) },
        {
            $set: {
                status: isActive ? "approved" : "inactive",
                updatedAt: new Date(),
            },
        }
    );

    revalidateMenus();

    return done(
        isActive
            ? "Menu item is now available."
            : "Menu item is now unavailable."
    );
}
