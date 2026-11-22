import type { UserRole } from "@/lib/roles";

export type SubscriptionPlan = "free" | "premium";
export type SubscriptionStatus = "active" | "cancelled" | "expired";
export type MenuStatus = "pending" | "approved" | "rejected" | "inactive";
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface ActionResult {
    ok: boolean;
    message: string;
}

export const EMPTY_ACTION: ActionResult = { ok: false, message: "" };

/** Vendor profile sourced from the Better Auth `user` document. */
export interface VendorProfileView {
    _id: string;
    userId: string;
    restaurantName: string;
    description: string;
    image: string;
    area: string;
    city: string;
    subscriptionPlan: SubscriptionPlan;
    subscriptionStatus: SubscriptionStatus;
    premiumSince: Date | null;
    premiumExpiresAt: Date | null;
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
    /** Cover image (first entry of `images`). */
    image: string;
    images: string[];
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
    currency?: string;
    paymentStatus: PaymentStatus;
    transactionDate: Date;
    stripeSessionId?: string | null;
    stripeSubscriptionId?: string | null;
}

export interface SubscriptionView {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    premiumSince: Date | null;
    premiumExpiresAt: Date | null;
}

export interface UserView {
    _id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
    blocked: boolean;
    businessName?: string;
    subscriptionPlan: SubscriptionPlan;
    createdAt: Date;
}

export interface UserDetailView extends UserView {
    businessDescription?: string;
    businessArea?: string;
    businessCity?: string;
    subscriptionStatus?: SubscriptionStatus;
    subscriptionExpiresAt?: Date | null;
    itemCount: number;
    orderCount: number;
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

/**
 * The six categories required by the storefront. They are stored verbatim on
 * `menuItems.category`, so a category card can deep-link with `?category=`.
 */
export const MENU_CATEGORIES = [
    "Classic Pizzas",
    "Vegetarian Pizzas",
    "Meat Lovers",
    "Specialty / Gourmet Pizzas",
    "Sides & Appetizers",
    "Beverages & Desserts",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const PREMIUM_PRICE = 499;
export const PREMIUM_PERIOD_DAYS = 30;
export const FREE_ACTIVE_ITEM_LIMIT = 3;
export const MAX_ITEM_IMAGES = 5;
