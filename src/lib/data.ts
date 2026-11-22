import "server-only";

import { connection } from "next/server";
import { ObjectId, type Filter } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    ordersCollection,
    transactionsCollection,
    usersCollection,
    type MenuItemDocument,
    type OrderDocument,
    type TransactionDocument,
    type UserDocument,
} from "@/lib/db";
import {
    expireDueSubscriptions,
    expireVendorSubscription,
    planOf,
    subscriptionStatusOf,
} from "@/lib/payments";
import { normalizeUserRole, type UserRole } from "@/lib/roles";
import {
    MENU_CATEGORIES,
    type AdminStats,
    type CustomerStats,
    type MenuItemView,
    type MenuStatus,
    type OrderView,
    type SubscriptionPlan,
    type TransactionView,
    type UserDetailView,
    type UserView,
    type VendorProfileView,
    type VendorStats,
} from "@/lib/types/dashboard";

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toVendorProfile(user: UserDocument | null): VendorProfileView | null {
    if (!user || !user.businessName) {
        return null;
    }

    return {
        _id: user._id.toString(),
        userId: user._id.toString(),
        restaurantName: user.businessName,
        description: user.businessDescription ?? "",
        image: user.businessImage ?? "",
        area: user.businessArea ?? "",
        city: user.businessCity ?? "",
        subscriptionPlan: planOf(user),
        subscriptionStatus: subscriptionStatusOf(user),
        premiumSince: user.premiumSince ?? null,
        premiumExpiresAt: user.subscriptionExpiresAt ?? null,
        createdAt: user.createdAt ?? new Date(0),
        updatedAt: user.updatedAt ?? new Date(0),
    };
}

function toMenuItem(item: MenuItemDocument): MenuItemView {
    const images = Array.isArray(item.images) ? item.images : [];
    const fallbackImage = "/placeholder-pizza.svg";

    return {
        _id: item._id.toString(),
        vendorId: item.vendorId.toString(),
        vendorName: item.vendorName,
        vendorImage: item.vendorImage,
        vendorLocation: item.vendorLocation,
        name: item.itemName,
        category: item.category,
        description: item.description,
        price: item.price,
        location: item.location,
        image: images[0] || fallbackImage,
        images: images.length > 0 ? images : [fallbackImage],
        status: item.status,
        isActive: item.status !== "inactive",
        premium: item.premium === true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

function toOrder(order: OrderDocument): OrderView {
    const fallbackImage = "/placeholder-pizza.svg";

    return {
        _id: order._id.toString(),
        customerId: order.customerId.toString(),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        vendorId: order.vendorId.toString(),
        vendorName: order.vendorName,
        itemId: order.itemId,
        itemName: order.itemName,
        itemImage: order.itemImage || fallbackImage,
        unitPrice: order.unitPrice,
        quantity: order.quantity,
        deliveryDate: order.deliveryDate,
        deliveryAddress: order.deliveryAddress,
        message: order.message,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
}

function toTransaction(transaction: TransactionDocument): TransactionView {
    return {
        _id: transaction._id.toString(),
        vendorId: transaction.vendorId.toString(),
        vendorName: transaction.vendorName,
        plan: transaction.plan,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentStatus: transaction.status,
        transactionDate: transaction.transactionDate,
        stripeSessionId: transaction.stripeSessionId,
        stripeSubscriptionId: transaction.stripeSubscriptionId,
    };
}

function toUser(user: UserDocument): UserView {
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        role: normalizeUserRole(user.role) as UserRole,
        blocked: user.isBlocked === true,
        businessName: user.businessName,
        subscriptionPlan: planOf(user),
        createdAt: user.createdAt ?? new Date(0),
    };
}

export async function getVendorProfile(
    userId: string
): Promise<VendorProfileView | null> {
    const user = await expireVendorSubscription(userId);
    return toVendorProfile(user);
}

export async function getVendorPlan(
    userId: string
): Promise<SubscriptionPlan> {
    const user = await expireVendorSubscription(userId);
    return planOf(user);
}

export async function getVendorMenuItems(
    vendorId: string
): Promise<MenuItemView[]> {
    const items = await menuItemsCollection
        .find({ vendorId: idFilter(vendorId) })
        .sort({ createdAt: -1 })
        .toArray();

    return items.map(toMenuItem);
}

export async function getVendorMenuItem(
    vendorId: string,
    itemId: string
): Promise<MenuItemView | null> {
    if (!ObjectId.isValid(itemId)) {
        return null;
    }

    const item = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        vendorId: idFilter(vendorId),
    });

    return item ? toMenuItem(item) : null;
}

export async function getVendorOrders(
    vendorId: string
): Promise<OrderView[]> {
    const orders = await ordersCollection
        .find({ vendorId: idFilter(vendorId) })
        .sort({ createdAt: -1 })
        .toArray();

    return orders.map(toOrder);
}

export async function getVendorStats(vendorId: string): Promise<VendorStats> {
    const user = await expireVendorSubscription(vendorId);

    const [totalItems, activeItems, pendingOrders, acceptedOrders] =
        await Promise.all([
            menuItemsCollection.countDocuments({
                vendorId: idFilter(vendorId),
            }),
            menuItemsCollection.countDocuments({
                vendorId: idFilter(vendorId),
                status: "approved",
            }),
            ordersCollection.countDocuments({
                vendorId: idFilter(vendorId),
                status: "pending",
            }),
            ordersCollection.countDocuments({
                vendorId: idFilter(vendorId),
                status: "accepted",
            }),
        ]);

    return {
        totalItems,
        activeItems,
        pendingOrders,
        acceptedOrders,
        plan: planOf(user),
    };
}

export async function getCustomerOrders(
    customerId: string
): Promise<OrderView[]> {
    const orders = await ordersCollection
        .find({ customerId: idFilter(customerId) })
        .sort({ createdAt: -1 })
        .toArray();

    return orders.map(toOrder);
}

export async function getCustomerOrder(
    customerId: string,
    orderId: string
): Promise<OrderView | null> {
    if (!ObjectId.isValid(orderId)) {
        return null;
    }

    const order = await ordersCollection.findOne({
        _id: new ObjectId(orderId),
        customerId: idFilter(customerId),
    });

    return order ? toOrder(order) : null;
}

export async function getCustomerStats(
    customerId: string
): Promise<CustomerStats> {
    const customerFilter = idFilter(customerId);

    const [total, pending, accepted, rejected, cancelled] = await Promise.all([
        ordersCollection.countDocuments({ customerId: customerFilter }),
        ordersCollection.countDocuments({
            customerId: customerFilter,
            status: "pending",
        }),
        ordersCollection.countDocuments({
            customerId: customerFilter,
            status: "accepted",
        }),
        ordersCollection.countDocuments({
            customerId: customerFilter,
            status: "rejected",
        }),
        ordersCollection.countDocuments({
            customerId: customerFilter,
            status: "cancelled",
        }),
    ]);

    return { total, pending, accepted, rejected, cancelled };
}

export async function getAdminStats(): Promise<AdminStats> {
    const [
        totalUsers,
        totalVendors,
        totalCustomers,
        totalMenuItems,
        pendingMenuItems,
        totalTransactions,
    ] = await Promise.all([
        usersCollection.countDocuments({}),
        usersCollection.countDocuments({ role: "vendor" }),
        usersCollection.countDocuments({
            $or: [{ role: "customer" }, { role: { $exists: false } }],
        }),
        menuItemsCollection.countDocuments({}),
        menuItemsCollection.countDocuments({ status: "pending" }),
        transactionsCollection.countDocuments({}),
    ]);

    return {
        totalUsers,
        totalVendors,
        totalCustomers,
        totalMenuItems,
        pendingMenuItems,
        totalTransactions,
    };
}

export async function getAdminUsers(options: {
    q?: string;
    role?: string;
}): Promise<UserView[]> {
    const filter: Filter<UserDocument> = {};
    const query = options.q?.trim();

    if (query) {
        const regex = new RegExp(escapeRegex(query), "i");
        filter.$or = [
            { name: regex },
            { email: regex },
            { businessName: regex },
        ];
    }

    if (options.role === "admin" || options.role === "vendor") {
        filter.role = options.role;
    } else if (options.role === "customer") {
        filter.$and = [
            { $or: [{ role: "customer" }, { role: { $exists: false } }] },
        ];
    }

    const users = await usersCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

    return users.map(toUser);
}

export async function getAdminUser(
    userId: string
): Promise<UserDetailView | null> {
    if (!ObjectId.isValid(userId)) {
        return null;
    }

    const user = await usersCollection.findOne({
        _id: idFilter(userId),
    });

    if (!user) {
        return null;
    }

    const [itemCount, orderCount] = await Promise.all([
        menuItemsCollection.countDocuments({ vendorId: idFilter(userId) }),
        ordersCollection.countDocuments({
            $or: [
                { vendorId: idFilter(userId) },
                { customerId: idFilter(userId) },
            ],
        }),
    ]);

    return {
        ...toUser(user),
        businessDescription: user.businessDescription,
        businessArea: user.businessArea,
        businessCity: user.businessCity,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt ?? null,
        itemCount,
        orderCount,
    };
}

export async function getAdminMenuItems(options: {
    q?: string;
    status?: string;
}): Promise<MenuItemView[]> {
    const filter: Filter<MenuItemDocument> = {};
    const query = options.q?.trim();

    if (query) {
        const regex = new RegExp(escapeRegex(query), "i");
        filter.$or = [
            { itemName: regex },
            { vendorName: regex },
            { category: regex },
        ];
    }

    const status = options.status;
    if (
        status === "pending" ||
        status === "approved" ||
        status === "rejected" ||
        status === "inactive"
    ) {
        filter.status = status satisfies MenuStatus;
    }

    const items = await menuItemsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

    return items.map(toMenuItem);
}

export async function getAdminTransactions(): Promise<TransactionView[]> {
    const transactions = await transactionsCollection
        .find({})
        .sort({ transactionDate: -1 })
        .toArray();

    return transactions.map(toTransaction);
}

export async function getPublicMenuItems(): Promise<MenuItemView[]> {
    // Live data: never prerender this list into the static shell.
    await connection();
    await expireDueSubscriptions();

    const items = await menuItemsCollection
        .find({ status: "approved" })
        .sort({ premium: -1, createdAt: -1 })
        .toArray();

    return items.map(toMenuItem);
}

export interface PublicMenuOptions {
    q?: string;
    category?: string;
    location?: string;
    sort?: string;
}

/**
 * Server-side version of the advanced Browse Menu query. The `/menu` page uses
 * it for the first render, while the Express `GET /api/menu` endpoint exposes
 * the same filtering to API consumers (Challenge 1).
 */
export async function getPublicMenu(
    options: PublicMenuOptions = {}
): Promise<MenuItemView[]> {
    await connection();
    await expireDueSubscriptions();

    const filter: Filter<MenuItemDocument> = { status: "approved" };
    const q = options.q?.trim();
    const category = options.category?.trim();
    const location = options.location?.trim();

    if (q) {
        const regex = new RegExp(escapeRegex(q), "i");
        filter.$or = [
            { itemName: regex },
            { category: regex },
            { description: regex },
            { location: regex },
            { vendorName: regex },
        ];
    }

    if (category && category !== "all") {
        filter.category = category;
    }

    if (location && location !== "all") {
        filter.location = new RegExp(escapeRegex(location), "i");
    }

    const sort: Record<string, 1 | -1> =
        options.sort === "price_asc"
            ? { price: 1, premium: -1 }
            : options.sort === "price_desc"
              ? { price: -1, premium: -1 }
              : { premium: -1, createdAt: -1 };

    const items = await menuItemsCollection.find(filter).sort(sort).toArray();

    return items.map(toMenuItem);
}

export async function getPublicMenuItem(
    itemId: string
): Promise<MenuItemView | null> {
    await connection();
    await expireDueSubscriptions();

    if (!ObjectId.isValid(itemId)) {
        return null;
    }

    const item = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        status: "approved",
    });

    return item ? toMenuItem(item) : null;
}

export async function getFeaturedMenuItems(
    limit = 6
): Promise<MenuItemView[]> {
    await connection();
    await expireDueSubscriptions();

    const items = await menuItemsCollection
        .find({ status: "approved" })
        .sort({ premium: -1, createdAt: -1 })
        .limit(limit)
        .toArray();

    return items.map(toMenuItem);
}

/** Approved item counts per storefront category, used by the home page. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
    await connection();

    const rows = await menuItemsCollection
        .aggregate<{ _id: string; count: number }>([
            { $match: { status: "approved" } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ])
        .toArray();

    const counts: Record<string, number> = {};

    for (const category of MENU_CATEGORIES) {
        counts[category] = 0;
    }

    for (const row of rows) {
        if (typeof row._id === "string") {
            counts[row._id] = row.count;
        }
    }

    return counts;
}
