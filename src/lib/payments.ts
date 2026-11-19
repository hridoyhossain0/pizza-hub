import "server-only";

import { ObjectId } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    transactionsCollection,
    vendorProfilesCollection,
    type VendorProfileDocument,
} from "@/lib/db";
import {
    PREMIUM_PERIOD_DAYS,
    type SubscriptionStatus,
} from "@/lib/types/dashboard";

let indexPromise: Promise<unknown> | null = null;

/**
 * Lazy, idempotent index creation. The unique index on `stripeSessionId` makes
 * webhook processing safe when Stripe retries an event.
 */
export function ensurePaymentIndexes() {
    if (!indexPromise) {
        indexPromise = Promise.all([
            transactionsCollection.createIndex(
                { stripeSessionId: 1 },
                {
                    name: "stripe_session_unique",
                    unique: true,
                    partialFilterExpression: {
                        stripeSessionId: { $type: "string" },
                    },
                }
            ),
            vendorProfilesCollection.createIndex({ premiumExpiresAt: 1 }),
        ]).catch((error) => {
            indexPromise = null;
            throw error;
        });
    }

    return indexPromise;
}

export function addPremiumPeriod(from: Date, days = PREMIUM_PERIOD_DAYS) {
    const end = new Date(from);
    end.setDate(end.getDate() + days);
    return end;
}

export function subscriptionStatusOf(
    profile: VendorProfileDocument | null
): SubscriptionStatus {
    if (!profile || profile.subscriptionPlan !== "premium") {
        return profile?.subscriptionStatus === "cancelled"
            ? "cancelled"
            : "expired";
    }

    if (
        profile.premiumExpiresAt &&
        profile.premiumExpiresAt.getTime() <= Date.now()
    ) {
        return "expired";
    }

    return profile.subscriptionStatus === "cancelled"
        ? "cancelled"
        : "active";
}

function isExpired(
    profile: VendorProfileDocument,
    now: Date
): boolean {
    return Boolean(
        profile.premiumExpiresAt &&
            profile.premiumExpiresAt.getTime() <= now.getTime()
    );
}

/** Downgrades a single vendor when their paid period has ended. */
export async function expireVendorSubscription(
    userId: string,
    now = new Date()
): Promise<VendorProfileDocument | null> {
    const profile = await vendorProfilesCollection.findOne({
        userId: idFilter(userId),
    });

    if (!profile) {
        return null;
    }

    if (profile.subscriptionPlan !== "premium" || !isExpired(profile, now)) {
        return profile;
    }

    await vendorProfilesCollection.updateOne(
        { userId: idFilter(userId), subscriptionPlan: "premium" },
        {
            $set: {
                subscriptionPlan: "free",
                subscriptionStatus: "expired",
                premiumExpiresAt: null,
                updatedAt: now,
            },
        }
    );

    await menuItemsCollection.updateMany(
        { vendorId: idFilter(userId) },
        { $set: { premium: false, updatedAt: now } }
    );

    return {
        ...profile,
        subscriptionPlan: "free",
        subscriptionStatus: "expired",
        premiumExpiresAt: null,
        updatedAt: now,
    };
}

/**
 * Bulk downgrade used by public pages so an expired Premium vendor can never
 * keep the Premium badge or featured placement after their period ends.
 */
export async function expireDueSubscriptions(now = new Date()) {
    const due = await vendorProfilesCollection
        .find(
            {
                subscriptionPlan: "premium",
                premiumExpiresAt: { $lte: now },
            },
            { projection: { userId: 1 } }
        )
        .toArray();

    if (due.length === 0) {
        return;
    }

    // `userId` may be stored as a string (app writes) or an ObjectId (Better
    // Auth writes), so include both forms in the bulk filters.
    const vendorIds = due.flatMap((profile) => {
        const value = profile.userId;

        if (typeof value === "string") {
            return ObjectId.isValid(value) ? [value, new ObjectId(value)] : [value];
        }

        return [value, value.toString()];
    });

    await vendorProfilesCollection.updateMany(
        {
            userId: { $in: vendorIds },
            subscriptionPlan: "premium",
            premiumExpiresAt: { $lte: now },
        },
        {
            $set: {
                subscriptionPlan: "free",
                subscriptionStatus: "expired",
                premiumExpiresAt: null,
                updatedAt: now,
            },
        }
    );

    await menuItemsCollection.updateMany(
        { vendorId: { $in: vendorIds } },
        { $set: { premium: false, updatedAt: now } }
    );
}

interface ActivatePremiumInput {
    vendorId: string;
    checkoutSessionId: string;
    stripeCustomerId?: string | null;
    now?: Date;
}

/**
 * Activates (or extends) Premium for a vendor. Only the verified webhook may
 * call this function.
 */
export async function activateVendorPremium({
    vendorId,
    checkoutSessionId,
    stripeCustomerId,
    now = new Date(),
}: ActivatePremiumInput): Promise<VendorProfileDocument | null> {
    const profile = await vendorProfilesCollection.findOne({
        userId: idFilter(vendorId),
    });

    if (!profile) {
        return null;
    }

    const base =
        profile.subscriptionPlan === "premium" &&
        profile.premiumExpiresAt &&
        profile.premiumExpiresAt.getTime() > now.getTime()
            ? profile.premiumExpiresAt
            : now;

    const premiumExpiresAt = addPremiumPeriod(base);

    await vendorProfilesCollection.updateOne(
        { userId: idFilter(vendorId) },
        {
            $set: {
                subscriptionPlan: "premium",
                subscriptionStatus: "active",
                premiumSince: profile.premiumSince ?? now,
                premiumExpiresAt,
                stripeCustomerId: stripeCustomerId ?? profile.stripeCustomerId ?? null,
                lastCheckoutSessionId: checkoutSessionId,
                updatedAt: now,
            },
        }
    );

    await menuItemsCollection.updateMany(
        { vendorId: idFilter(vendorId) },
        { $set: { premium: true, updatedAt: now } }
    );

    return {
        ...profile,
        subscriptionPlan: "premium",
        subscriptionStatus: "active",
        premiumSince: profile.premiumSince ?? now,
        premiumExpiresAt,
        stripeCustomerId: stripeCustomerId ?? profile.stripeCustomerId ?? null,
        lastCheckoutSessionId: checkoutSessionId,
        updatedAt: now,
    };
}
