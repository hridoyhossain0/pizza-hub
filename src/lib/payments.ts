import "server-only";

import { ObjectId } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    vendorProfilesCollection,
    type VendorProfileDocument,
} from "@/lib/db";
import type { SubscriptionStatus } from "@/lib/types/dashboard";

/**
 * Subscription state helpers.
 *
 * Stripe checkout and payment verification live in the Express API server
 * (`pizza-hub-server`). The frontend only needs to read and lazily apply
 * expiry so an overdue Premium vendor is treated as Free everywhere.
 */

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

function isExpired(profile: VendorProfileDocument, now: Date): boolean {
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
            return ObjectId.isValid(value)
                ? [value, new ObjectId(value)]
                : [value];
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
