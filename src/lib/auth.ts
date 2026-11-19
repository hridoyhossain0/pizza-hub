import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { mongoClient } from "@/lib/db";
import { DEFAULT_USER_ROLE } from "@/lib/roles";

// Share the exact same database as the dashboard data layer. The URI has no
// database name, so `db()` resolves to MongoDB's default database ("test").
const db = mongoClient.db();

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
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
            blocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                // Only administrators can block accounts, through the server.
                input: false,
            },
        },
    },
});
