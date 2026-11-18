import "server-only";

import { MongoClient, type Collection, type ObjectId } from "mongodb";

import type {
    MenuStatus,
    OrderStatus,
    PaymentStatus,
    SubscriptionPlan,
} from "@/lib/types/dashboard";

export interface UserDocument {
    _id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    blocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VendorProfileDocument {
    _id: ObjectId;
    userId: string;
    restaurantName: string;
    description: string;
    image: string;
    area: string;
    city: string;
    subscriptionPlan: SubscriptionPlan;
    premiumSince?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface MenuItemDocument {
    _id: ObjectId;
    vendorId: string;
    vendorName: string;
    vendorImage?: string;
    vendorLocation?: string;
    name: string;
    category: string;
    description: string;
    price: number;
    location: string;
    image: string;
    status: MenuStatus;
    isActive: boolean;
    premium: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderDocument {
    _id: ObjectId;
    customerId: string;
    customerName: string;
    customerEmail: string;
    vendorId: string;
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
    vendorId: string;
    vendorName: string;
    plan: SubscriptionPlan;
    amount: number;
    paymentStatus: PaymentStatus;
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
export const vendorProfilesCollection: Collection<VendorProfileDocument> =
    db.collection("vendorProfiles");
export const menuItemsCollection: Collection<MenuItemDocument> =
    db.collection("menuItems");
export const ordersCollection: Collection<OrderDocument> =
    db.collection("orders");
export const transactionsCollection: Collection<TransactionDocument> =
    db.collection("transactions");
