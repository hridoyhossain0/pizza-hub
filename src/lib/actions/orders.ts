"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

import { idFilter, ordersCollection } from "@/lib/db";
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
