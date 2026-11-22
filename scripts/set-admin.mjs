import { MongoClient, ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";

/**
 * Promotes an existing account to administrator and resets its password.
 *
 * Usage:
 *   npm run set-admin -- user@example.com NewPassword123
 *
 * The account must already exist (sign up normally first). Administrator
 * accounts cannot be created from the public sign-up form by design.
 */
const [email, password] = process.argv.slice(2);

if (!email || !password) {
    console.error(
        "Usage: npm run set-admin -- user@example.com NewPassword123"
    );
    process.exit(1);
}

if (password.length < 6) {
    console.error("Password must be at least 6 characters long.");
    process.exit(1);
}

const uri = process.env.MONGODB_URL;

if (!uri) {
    console.error("MONGODB_URL is not set. Run with --env-file=.env.");
    process.exit(1);
}

const client = new MongoClient(uri);

try {
    await client.connect();
    const db = client.db();
    const now = new Date();

    const user = await db.collection("user").findOne({ email });

    if (!user) {
        console.error(
            `No user found with email ${email}. Sign up first, then run this script.`
        );
        process.exitCode = 1;
    } else {
        await db.collection("user").updateOne(
            { _id: user._id },
            {
                $set: {
                    role: "admin",
                    roleConfigured: true,
                    isBlocked: false,
                    updatedAt: now,
                },
            }
        );

        const passwordHash = await hashPassword(password);

        const result = await db.collection("account").updateOne(
            { userId: user._id, providerId: "credential" },
            {
                $set: {
                    password: passwordHash,
                    updatedAt: now,
                },
                $setOnInsert: {
                    _id: new ObjectId(),
                    accountId: String(user._id),
                    providerId: "credential",
                    userId: user._id,
                    createdAt: now,
                },
            },
            { upsert: true }
        );

        console.log(
            `${email} is now an administrator with the new password.`
        );
        console.log(
            result.upsertedCount > 0
                ? "Created a new credential account for it."
                : "Updated the existing credential password."
        );
        console.log("Existing sessions for this user were kept.");
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await client.close();
}
