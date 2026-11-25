"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    ordersCollection,
} from "@/lib/db";
import type { ActionResult } from "@/lib/types/dashboard";
import { guard } from "@/lib/actions/guard";

function fail(message: string): ActionResult {
    return { ok: false, message };
}

function done(message: string): ActionResult {
    return { ok: true, message };
}

function revalidateOrderPaths() {
    revalidatePath("/dashboard/vendor");
    revalidatePath("/dashboard/vendor/orders");
    revalidatePath("/dashboard/customer");
    revalidatePath("/dashboard/customer/orders");
}

function localToday() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

interface PlaceOrderInput {
    itemId: string;
    quantity: number;
    deliveryDate: string;
    deliveryAddress: string;
    message?: string;
}

/**
 * Places a customer order directly in MongoDB for the menu item page.
 *
 * The customer always comes from the server session, and the vendor, price and
 * item name are re-read from the database so the browser cannot tamper with
 * them. This keeps the "Place order" button working through MongoDB even when
 * the separate Express API is unavailable.
 */
export async function placeOrder(
    input: PlaceOrderInput
): Promise<ActionResult> {
    const { user, error } = await guard(["customer"]);

    if (!user) {
        return fail(error);
    }

    const itemId =
        typeof input.itemId === "string" ? input.itemId.trim() : "";

    if (!ObjectId.isValid(itemId)) {
        return fail("The selected menu item could not be found.");
    }

    const item = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        status: "approved",
    });

    if (!item) {
        return fail("This menu item is no longer available for ordering.");
    }

    if (item.vendorId.toString() === user.id) {
        return fail("You cannot order your own menu items.");
    }

    const quantity = Number(input.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return fail("Quantity must be a whole number between 1 and 10.");
    }

    const deliveryDate =
        typeof input.deliveryDate === "string"
            ? input.deliveryDate.trim()
            : "";
    const deliveryAddress =
        typeof input.deliveryAddress === "string"
            ? input.deliveryAddress.trim()
            : "";
    const message =
        typeof input.message === "string" ? input.message.trim() : "";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
        return fail("Please choose a valid delivery date.");
    }

    if (deliveryDate < localToday()) {
        return fail("The delivery date cannot be in the past.");
    }

    if (deliveryAddress.length < 5 || deliveryAddress.length > 500) {
        return fail("Delivery address is required (5-500 characters).");
    }

    if (message.length > 1000) {
        return fail("Additional message must be 1000 characters or fewer.");
    }

    const duplicate = await ordersCollection.findOne({
        customerId: idFilter(user.id),
        itemId,
        deliveryDate,
        status: { $in: ["pending", "accepted"] },
    });

    if (duplicate) {
        return fail(
            "You already have an active order for this item on the selected delivery date."
        );
    }

    const now = new Date();

    await ordersCollection.insertOne({
        _id: new ObjectId(),
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        vendorId: item.vendorId.toString(),
        vendorName: item.vendorName,
        itemId: item._id.toString(),
        itemName: item.itemName,
        itemImage: item.images?.[0] ?? "",
        unitPrice: item.price,
        quantity,
        deliveryDate,
        deliveryAddress,
        message,
        status: "pending",
        createdAt: now,
        updatedAt: now,
    });

    revalidateOrderPaths();

    return done(
        "Your order has been placed successfully. The restaurant will review it shortly."
    );
}

/**
 * Accept or reject a customer order. The filter includes
 * `status: "pending"`, so a decision can only be applied once and only by the
 * vendor who owns the order.
 */
export async function decideOrder(
    orderId: string,
    status: "accepted" | "rejected"
): Promise<ActionResult> {
    const { user, error } = await guard(["vendor"]);

    if (!user) {
        return fail(error);
    }

    if (status !== "accepted" && status !== "rejected") {
        return fail("Invalid order status.");
    }

    if (!ObjectId.isValid(orderId)) {
        return fail("The selected order could not be found.");
    }

    const result = await ordersCollection.updateOne(
        {
            _id: new ObjectId(orderId),
            vendorId: idFilter(user.id),
            status: "pending",
        },
        {
            $set: {
                status,
                updatedAt: new Date(),
            },
        }
    );

    if (result.modifiedCount === 0) {
        return fail(
            "This order is no longer pending, or it does not belong to your restaurant."
        );
    }

    revalidateOrderPaths();

    return done(
        status === "accepted"
            ? "Order accepted successfully."
            : "Order rejected."
    );
}

/**
 * Cancel a pending order. Customers can only cancel their own orders, and
 * only while the order is still pending.
 */
export async function cancelOrder(orderId: string): Promise<ActionResult> {
    const { user, error } = await guard(["customer"]);

    if (!user) {
        return fail(error);
    }

    if (!ObjectId.isValid(orderId)) {
        return fail("The selected order could not be found.");
    }

    const result = await ordersCollection.updateOne(
        {
            _id: new ObjectId(orderId),
            customerId: idFilter(user.id),
            status: "pending",
        },
        {
            $set: {
                status: "cancelled",
                updatedAt: new Date(),
            },
        }
    );

    if (result.modifiedCount === 0) {
        return fail(
            "Only your own pending orders can be cancelled. Accepted, rejected and cancelled orders cannot be changed."
        );
    }

    revalidateOrderPaths();

    return done("Order cancelled.");
}
