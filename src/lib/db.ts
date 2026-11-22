import "server-only";

import { MongoClient, ObjectId, type Collection } from "mongodb";

import type {
    MenuStatus,
    OrderStatus,
    PaymentStatus,
    SubscriptionPlan,
    SubscriptionStatus,
} from "@/lib/types/dashboard";

/**
 * Better Auth stores `_id` and session `userId` values as `ObjectId`, while
 * `session.user.id` is always a string. Documents created by this app store
 * foreign keys as strings, so every lookup has to accept both forms.
 */
export type EntityId = string | ObjectId;

/** Matches a document id stored either as a string or as an ObjectId. */
export function idFilter(value: string): { $in: EntityId[] } {
    return {
        $in: ObjectId.isValid(value)
            ? [value, new ObjectId(value)]
            : [value],
    };
}

export function toObjectId(value: string): ObjectId | null {
    return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

/**
 * `users` is the Better Auth collection. Vendor business data and the
 * subscription state live on the same document so the database uses exactly
 * the four business collections required by the brief.
 */
export interface UserDocument {
    _id: EntityId;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    isBlocked?: boolean;
    roleConfigured?: boolean;
    /** Vendor only. */
    businessName?: string;
    businessDescription?: string;
    businessImage?: string;
    businessArea?: string;
    businessCity?: string;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionStatus?: SubscriptionStatus;
    subscriptionExpiresAt?: Date | null;
    premiumSince?: Date | null;
    stripeCustomerId?: string | null;
    lastCheckoutSessionId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MenuItemDocument {
    _id: ObjectId;
    vendorId: EntityId;
    vendorName: string;
    vendorImage?: string;
    vendorLocation?: string;
    itemName: string;
    category: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    status: MenuStatus;
    premium: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderDocument {
    _id: ObjectId;
    customerId: EntityId;
    customerName: string;
    customerEmail: string;
    vendorId: EntityId;
    vendorName: string;
    itemId: string;
    itemName: string;
    itemImage: string;
    unitPrice: number;
    quantity: number;
    deliveryDate: string;
    deliveryAddress: string;
    message: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionDocument {
    _id: ObjectId;
    vendorId: EntityId;
    vendorName: string;
    plan: SubscriptionPlan;
    amount: number;
    currency?: string;
    stripeSessionId?: string | null;
    stripeSubscriptionId?: string | null;
    stripePaymentIntentId?: string | null;
    status: PaymentStatus;
    transactionDate: Date;
    createdAt: Date;
}

const uri = process.env.MONGODB_URL;

if (!uri) {
    throw new Error("MONGODB_URL is not configured.");
}

const globalForMongo = globalThis as unknown as {
    __pizzaHubMongoClient?: MongoClient;
};

export const mongoClient =
    globalForMongo.__pizzaHubMongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
    globalForMongo.__pizzaHubMongoClient = mongoClient;
}

/** Same default database Better Auth's adapter uses (no name in the URI). */
export const db = mongoClient.db();

export const usersCollection: Collection<UserDocument> =
    db.collection("user");
export const sessionsCollection = db.collection("session");
export const menuItemsCollection: Collection<MenuItemDocument> =
    db.collection("menuItems");
export const ordersCollection: Collection<OrderDocument> =
    db.collection("orders");
export const transactionsCollection: Collection<TransactionDocument> =
    db.collection("transactions");
