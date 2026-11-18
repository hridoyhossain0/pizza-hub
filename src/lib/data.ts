import "server-only";

import { connection } from "next/server";
import { ObjectId, type Filter } from "mongodb";

import {
    menuItemsCollection,
    ordersCollection,
    transactionsCollection,
    usersCollection,
    vendorProfilesCollection,
    type MenuItemDocument,
    type OrderDocument,
    type TransactionDocument,
    type UserDocument,
    type VendorProfileDocument,
} from "@/lib/db";
import { normalizeUserRole, type UserRole } from "@/lib/roles";
import type {
    AdminStats,
    CustomerStats,
    MenuItemView,
    MenuStatus,
    OrderView,
    SubscriptionPlan,
    TransactionView,
    UserView,
    VendorProfileView,
    VendorStats,
} from "@/lib/types/dashboard";

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toVendorProfile(
    profile: VendorProfileDocument | null
): VendorProfileView | null {
    if (!profile) {
        return null;
    }

    return {
        _id: profile._id.toString(),
        userId: profile.userId,
        restaurantName: profile.restaurantName,
        description: profile.description,
        image: profile.image,
        area: profile.area,
        city: profile.city,
        subscriptionPlan: profile.subscriptionPlan,
        premiumSince: profile.premiumSince ?? null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}

function toMenuItem(item: MenuItemDocument): MenuItemView {
    return {
        _id: item._id.toString(),
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        vendorImage: item.vendorImage,
        vendorLocation: item.vendorLocation,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        location: item.location,
        image: item.image,
        status: item.status,
        isActive: item.isActive,
        premium: item.premium === true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

function toOrder(order: OrderDocument): OrderView {
    return {
        _id: order._id.toString(),
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        vendorId: order.vendorId,
        vendorName: order.vendorName,
        itemId: order.itemId,
        itemName: order.itemName,
        itemImage: order.itemImage,
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
        vendorId: transaction.vendorId,
        vendorName: transaction.vendorName,
        plan: transaction.plan,
        amount: transaction.amount,
        paymentStatus: transaction.paymentStatus,
        transactionDate: transaction.transactionDate,
    };
}

export async function getVendorProfile(
    userId: string
): Promise<VendorProfileView | null> {
    const profile = await vendorProfilesCollection.findOne({ userId });
    return toVendorProfile(profile);
}

export async function getVendorPlan(
    userId: string
): Promise<SubscriptionPlan> {
    const profile = await vendorProfilesCollection.findOne(
        { userId },
        { projection: { subscriptionPlan: 1 } }
    );

    return profile?.subscriptionPlan === "premium" ? "premium" : "free";
}

export async function getVendorMenuItems(
    vendorId: string
): Promise<MenuItemView[]> {
    const items = await menuItemsCollection
        .find({ vendorId })
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
        vendorId,
    });

    return item ? toMenuItem(item) : null;
}

export async function getVendorOrders(
    vendorId: string
): Promise<OrderView[]> {
    const orders = await ordersCollection
        .find({ vendorId })
        .sort({ createdAt: -1 })
        .toArray();

    return orders.map(toOrder);
}

export async function getVendorStats(vendorId: string): Promise<VendorStats> {
    const [
        totalItems,
        activeItems,
        pendingOrders,
        acceptedOrders,
        profile,
    ] = await Promise.all([
        menuItemsCollection.countDocuments({ vendorId }),
        menuItemsCollection.countDocuments({
            vendorId,
            isActive: true,
            status: { $ne: "rejected" },
        }),
        ordersCollection.countDocuments({ vendorId, status: "pending" }),
        ordersCollection.countDocuments({ vendorId, status: "accepted" }),
        vendorProfilesCollection.findOne(
            { userId: vendorId },
            { projection: { subscriptionPlan: 1 } }
        ),
    ]);

    return {
        totalItems,
        activeItems,
        pendingOrders,
        acceptedOrders,
        plan: profile?.subscriptionPlan === "premium" ? "premium" : "free",
    };
}

export async function getCustomerOrders(
    customerId: string
): Promise<OrderView[]> {
    const orders = await ordersCollection
        .find({ customerId })
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
        customerId,
    });

    return order ? toOrder(order) : null;
}

export async function getCustomerStats(
    customerId: string
): Promise<CustomerStats> {
    const [total, pending, accepted, rejected, cancelled] = await Promise.all([
        ordersCollection.countDocuments({ customerId }),
        ordersCollection.countDocuments({ customerId, status: "pending" }),
        ordersCollection.countDocuments({ customerId, status: "accepted" }),
        ordersCollection.countDocuments({ customerId, status: "rejected" }),
        ordersCollection.countDocuments({ customerId, status: "cancelled" }),
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
        filter.$or = [{ name: regex }, { email: regex }];
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

    return users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        role: normalizeUserRole(user.role) as UserRole,
        blocked: user.blocked === true,
        createdAt: user.createdAt ?? new Date(0),
    }));
}

export async function getAdminMenuItems(options: {
    q?: string;
    status?: string;
}): Promise<MenuItemView[]> {
    const filter: Filter<MenuItemDocument> = {};
    const query = options.q?.trim();

    if (query) {
        const regex = new RegExp(escapeRegex(query), "i");
        filter.$or = [{ name: regex }, { vendorName: regex }];
    }

    const status = options.status;
    if (
        status === "pending" ||
        status === "approved" ||
        status === "rejected"
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

    const items = await menuItemsCollection
        .find({ status: "approved", isActive: true })
        .sort({ premium: -1, createdAt: -1 })
        .toArray();

    return items.map(toMenuItem);
}

export async function getPublicMenuItem(
    itemId: string
): Promise<MenuItemView | null> {
    await connection();

    if (!ObjectId.isValid(itemId)) {
        return null;
    }

    const item = await menuItemsCollection.findOne({
        _id: new ObjectId(itemId),
        status: "approved",
        isActive: true,
    });

    return item ? toMenuItem(item) : null;
}

export async function getFeaturedMenuItems(
    limit = 6
): Promise<MenuItemView[]> {
    await connection();

    const items = await menuItemsCollection
        .find({ status: "approved", isActive: true })
        .sort({ premium: -1, createdAt: -1 })
        .limit(limit)
        .toArray();

    return items.map(toMenuItem);
}
