import { MongoClient } from "mongodb";

const [email, role] = process.argv.slice(2);
const allowedRoles = ["customer", "vendor", "admin"];

if (!email || !allowedRoles.includes(role)) {
    console.error(
        "Usage: npm run set-role -- user@example.com customer|vendor|admin"
    );
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

    const result = await db.collection("user").updateOne(
        { email },
        {
            $set: {
                role,
                roleConfigured: true,
                isBlocked: false,
                updatedAt: new Date(),
            },
        }
    );

    if (result.matchedCount === 0) {
        console.error(`No user found with email ${email}.`);
        process.exitCode = 1;
    } else {
        console.log(`Updated ${email} to role "${role}".`);
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await client.close();
}
