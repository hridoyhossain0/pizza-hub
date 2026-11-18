import type { UserRole } from "@/lib/roles";

export type SubscriptionPlan = "free" | "premium";
export type MenuStatus = "pending" | "approved" | "rejected";
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface ActionResult {
    ok: boolean;
    message: string;
}

export const EMPTY_ACTION: ActionResult = { ok: false, message: "" };

export interface VendorProfileView {
    _id: string;
    userId: string;
    restaurantName: string;
    description: string;
    image: string;
    area: string;
    city: string;
    subscriptionPlan: SubscriptionPlan;
    premiumSince: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface MenuItemView {
    _id: string;
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

export interface OrderView {
    _id: string;
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

export interface TransactionView {
    _id: string;
    vendorId: string;
    vendorName: string;
    plan: SubscriptionPlan;
    amount: number;
    paymentStatus: PaymentStatus;
    transactionDate: Date;
}

export interface UserView {
    _id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
    blocked: boolean;
    createdAt: Date;
}

export interface VendorStats {
    totalItems: number;
    activeItems: number;
    pendingOrders: number;
    acceptedOrders: number;
    plan: SubscriptionPlan;
}

export interface CustomerStats {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
}

export interface AdminStats {
    totalUsers: number;
    totalVendors: number;
    totalCustomers: number;
    totalMenuItems: number;
    pendingMenuItems: number;
    totalTransactions: number;
}

export const MENU_CATEGORIES = [
    "Pizza",
    "Special Pizza",
    "Burger",
    "Pasta",
    "Sandwich",
    "Rice & Curry",
    "Sides",
    "Dessert",
    "Drinks",
    "Other",
] as const;

export const PREMIUM_PRICE = 499;
