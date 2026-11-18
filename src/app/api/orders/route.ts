import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { menuItemsCollection, ordersCollection } from "@/lib/db";
import { normalizeUserRole } from "@/lib/roles";

interface OrderBody {
    itemId?: unknown;
    quantity?: unknown;
    deliveryDate?: unknown;
    deliveryAddress?: unknown;
    message?: unknown;
}

function localToday() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Places a customer order. Customer, vendor and item are resolved on the
 * server; only the delivery details and item id come from the browser.
 */
export async function POST(request: Request) {
    let body: OrderBody;

    try {
        body = (await request.json()) as OrderBody;
    } catch {
        return NextResponse.json(
            { message: "Invalid request body." },
            { status: 400 }
        );
    }

    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        return NextResponse.json(
            { message: "Please sign in to place an order." },
            { status: 401 }
        );
    }

    const user = session.user as typeof session.user & {
        role?: unknown;
        blocked?: unknown;
    };
    const role = normalizeUserRole(user.role);

    if (role !== "customer") {
        return NextResponse.json(
            {
                message:
                    role === "vendor"
                        ? "Vendor accounts cannot place customer orders."
                        : "Admin accounts cannot place customer orders.",
            },
            { status: 403 }
        );
    }

    if (user.blocked === true) {
        return NextResponse.json(
            {
                message:
                    "Your account has been blocked by an administrator. You cannot place orders.",
            },
            { status: 403 }
        );
    }

    const itemId = typeof body.itemId === "string" ? body.itemId : "";

    if (!ObjectId.isValid(itemId)) {
        return NextResponse.json(
            { message: "The selected menu item could not be found." },
            { status: 400 }
        );
    }

    const item = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        status: "approved",
        isActive: true,
    });

    if (!item) {
        return NextResponse.json(
            {
                message:
                    "This menu item is no longer available for ordering.",
            },
            { status: 404 }
        );
    }

    if (item.vendorId === user.id) {
        return NextResponse.json(
            { message: "You cannot order your own menu items." },
            { status: 403 }
        );
    }

    const quantity = Number(body.quantity ?? 1);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return NextResponse.json(
            { message: "Quantity must be a whole number between 1 and 10." },
            { status: 400 }
        );
    }

    const deliveryDate =
        typeof body.deliveryDate === "string"
            ? body.deliveryDate.trim()
            : "";
    const deliveryAddress =
        typeof body.deliveryAddress === "string"
            ? body.deliveryAddress.trim()
            : "";
    const message =
        typeof body.message === "string" ? body.message.trim() : "";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
        return NextResponse.json(
            { message: "Please choose a valid delivery date." },
            { status: 400 }
        );
    }

    if (deliveryDate < localToday()) {
        return NextResponse.json(
            { message: "The delivery date cannot be in the past." },
            { status: 400 }
        );
    }

    if (deliveryAddress.length < 5 || deliveryAddress.length > 500) {
        return NextResponse.json(
            {
                message:
                    "Delivery address is required (5-500 characters).",
            },
            { status: 400 }
        );
    }

    if (message.length > 1000) {
        return NextResponse.json(
            {
                message:
                    "Additional message must be 1000 characters or fewer.",
            },
            { status: 400 }
        );
    }

    const duplicate = await ordersCollection.findOne({
        customerId: user.id,
        itemId,
        deliveryDate,
        status: { $in: ["pending", "accepted"] },
    });

    if (duplicate) {
        return NextResponse.json(
            {
                message:
                    "You already have an active order for this item on the selected delivery date.",
            },
            { status: 409 }
        );
    }

    const now = new Date();

    await ordersCollection.insertOne({
        _id: new ObjectId(),
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        itemId: item._id.toString(),
        itemName: item.name,
        itemImage: item.image,
        unitPrice: item.price,
        quantity,
        deliveryDate,
        deliveryAddress,
        message,
        status: "pending",
        createdAt: now,
        updatedAt: now,
    });

    return NextResponse.json(
        {
            message:
                "Your order has been placed successfully. The restaurant will review it shortly.",
        },
        { status: 201 }
    );
}
