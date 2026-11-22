import "server-only";

import { ObjectId } from "mongodb";

import {
    idFilter,
    menuItemsCollection,
    usersCollection,
    type UserDocument,
} from "@/lib/db";
import type {
    SubscriptionPlan,
    SubscriptionStatus,
} from "@/lib/types/dashboard";

/**
 * Subscription state helpers.
 *
 * Stripe checkout and payment verification live in the Express API server
 * (`pizza-hub-server`). The frontend only reads the subscription fields on the
 * vendor's user document and lazily applies expiry so an overdue Premium
 * vendor is treated as Free everywhere.
 */

export function subscriptionStatusOf(
    user: UserDocument | null
): SubscriptionStatus {
    if (!user || user.subscriptionPlan !== "premium") {
        return user?.subscriptionStatus === "cancelled"
            ? "cancelled"
            : "expired";
    }

    if (
        user.subscriptionExpiresAt &&
        user.subscriptionExpiresAt.getTime() <= Date.now()
    ) {
        return "expired";
    }

    return user.subscriptionStatus === "cancelled"
        ? "cancelled"
        : "active";
}

export function planOf(user: UserDocument | null): SubscriptionPlan {
    return user?.subscriptionPlan === "premium" ? "premium" : "free";
}

function isExpired(user: UserDocument, now: Date): boolean {
    return Boolean(
        user.subscriptionExpiresAt &&
            user.subscriptionExpiresAt.getTime() <= now.getTime()
    );
}

/** Downgrades a single vendor when their paid period has ended. */
export async function expireVendorSubscription(
    userId: string,
    now = new Date()
): Promise<UserDocument | null> {
    const user = await usersCollection.findOne({
        _id: idFilter(userId),
    });

    if (!user) {
        return null;
    }

    if (user.subscriptionPlan !== "premium" || !isExpired(user, now)) {
        return user;
    }

    await usersCollection.updateOne(
        { _id: idFilter(userId), subscriptionPlan: "premium" },
        {
            $set: {
                subscriptionPlan: "free",
                subscriptionStatus: "expired",
                subscriptionExpiresAt: null,
                updatedAt: now,
            },
        }
    );

    await menuItemsCollection.updateMany(
        { vendorId: idFilter(userId) },
        { $set: { premium: false, updatedAt: now } }
    );

    return {
        ...user,
        subscriptionPlan: "free",
        subscriptionStatus: "expired",
        subscriptionExpiresAt: null,
        updatedAt: now,
    };
}

/**
 * Bulk downgrade used by public pages so an expired Premium vendor can never
 * keep the Premium badge or featured placement after their period ends.
 */
export async function expireDueSubscriptions(now = new Date()) {
    const due = await usersCollection
        .find(
            {
                subscriptionPlan: "premium",
                subscriptionExpiresAt: { $lte: now },
            },
            { projection: { _id: 1 } }
        )
        .toArray();

    if (due.length === 0) {
        return;
    }

    // `_id` may be stored as a string (app writes) or an ObjectId (Better
    // Auth writes), so include both forms in the bulk filters.
    const vendorIds = due.flatMap((user) => {
        const value = user._id;

        if (typeof value === "string") {
            return ObjectId.isValid(value)
                ? [value, new ObjectId(value)]
                : [value];
        }

        return [value, value.toString()];
    });

    await usersCollection.updateMany(
        {
            _id: { $in: vendorIds },
            subscriptionPlan: "premium",
            subscriptionExpiresAt: { $lte: now },
        },
        {
            $set: {
                subscriptionPlan: "free",
                subscriptionStatus: "expired",
                subscriptionExpiresAt: null,
                updatedAt: now,
            },
        }
    );

    await menuItemsCollection.updateMany(
        { vendorId: { $in: vendorIds } },
        { $set: { premium: false, updatedAt: now } }
    );
}
