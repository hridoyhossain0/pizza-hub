import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { mongoClient } from "@/lib/db";
import { DEFAULT_USER_ROLE } from "@/lib/roles";

// Share the exact same database as the dashboard data layer. The URI has no
// database name, so `db()` resolves to MongoDB's default database ("test").
const db = mongoClient.db();

const baseUrl = (
    process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Vercel gives every deployment its own hostname (`pizza-hub-abc123-...`).
 * Better Auth compares the request Origin against `baseURL`, so without these
 * hosts a fresh `vercel --prod` URL gets `403 INVALID_ORIGIN` and no session
 * can be created — which makes the app look like the database is down.
 */
function toHost(value: string | undefined) {
    const trimmed = value?.trim();

    if (!trimmed) {
        return null;
    }

    try {
        return new URL(
            trimmed.includes("://") ? trimmed : `https://${trimmed}`
        ).host;
    } catch {
        return null;
    }
}

const allowedHosts = Array.from(
    new Set(
        [
            toHost(baseUrl),
            "localhost:3000",
            "127.0.0.1:3000",
            toHost(process.env.VERCEL_URL),
            toHost(process.env.VERCEL_BRANCH_URL),
            toHost(process.env.VERCEL_PROJECT_PRODUCTION_URL),
        ].filter((host): host is string => Boolean(host))
    )
);

export const auth = betterAuth({
    // Resolve the base URL from the incoming request so production aliases and
    // deployment-specific URLs both work. `fallback` keeps non-request calls
    // (scripts, server-side helpers without a host header) on the stable URL.
    baseURL: {
        allowedHosts,
        protocol: "auto",
        fallback: baseUrl,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        maxPasswordLength: 128,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client: mongoClient,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: DEFAULT_USER_ROLE,
                // Roles are assigned server-side only; never accepted from
                // a sign-up/sign-in payload.
                input: false,
            },
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                // Only administrators can block accounts, through the server.
                input: false,
            },
            roleConfigured: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
            businessName: {
                type: "string",
                required: false,
                input: false,
            },
            businessDescription: {
                type: "string",
                required: false,
                input: false,
            },
            businessImage: {
                type: "string",
                required: false,
                input: false,
            },
            businessArea: {
                type: "string",
                required: false,
                input: false,
            },
            businessCity: {
                type: "string",
                required: false,
                input: false,
            },
            subscriptionPlan: {
                type: "string",
                required: false,
                defaultValue: "free",
                input: false,
            },
            subscriptionStatus: {
                type: "string",
                required: false,
                input: false,
            },
            subscriptionExpiresAt: {
                type: "date",
                required: false,
                input: false,
            },
            premiumSince: {
                type: "date",
                required: false,
                input: false,
            },
            lastCheckoutSessionId: {
                type: "string",
                required: false,
                input: false,
            },
            stripeCustomerId: {
                type: "string",
                required: false,
                input: false,
            },
        },
    },
    trustedOrigins: [
        baseUrl,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        ...allowedHosts.map((host) => `https://${host}`),
    ],
});
