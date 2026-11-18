import { MongoClient, ObjectId } from "mongodb";

/**
 * Optional demo data for a fresh database.
 *
 * Creates one vendor profile, five menu items (three approved, one pending,
 * one rejected) and one pending order. Safe to run more than once: it only
 * inserts when the vendor has no menu items yet.
 *
 * Usage: npm run seed-demo
 */
const uri = process.env.MONGODB_URL;

if (!uri) {
    console.error("MONGODB_URL is not set. Run with --env-file=.env.");
    process.exit(1);
}

const VENDOR_EMAIL = "vendor.test@pizzahub.dev";
const CUSTOMER_EMAIL = "customer.test@pizzahub.dev";

const client = new MongoClient(uri);

try {
    await client.connect();
    const db = client.db();
    const now = new Date();

    const vendor = await db.collection("user").findOne({ email: VENDOR_EMAIL });
    const customer = await db.collection("user").findOne({
        email: CUSTOMER_EMAIL,
    });

    if (!vendor) {
        console.error(`Missing vendor account ${VENDOR_EMAIL}.`);
        process.exit(1);
    }

    const existing = await db
        .collection("menuItems")
        .countDocuments({ vendorId: vendor._id });

    if (existing > 0) {
        console.log("Demo menu already exists, nothing to do.");
    } else {
        await db.collection("vendorProfiles").updateOne(
            { userId: vendor._id },
            {
                $set: {
                    restaurantName: "Pizza Palace",
                    description:
                        "Wood-fired pizzas, handmade pasta and fresh sides delivered hot across the city.",
                    image:
                        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
                    area: "Dhanmondi",
                    city: "Dhaka",
                    subscriptionPlan: "free",
                    premiumSince: null,
                    updatedAt: now,
                },
                $setOnInsert: {
                    _id: new ObjectId(),
                    userId: vendor._id,
                    createdAt: now,
                },
            },
            { upsert: true }
        );

        const items = [
            {
                name: "Chicken Cheese Pizza",
                category: "Pizza",
                description:
                    "Loaded with grilled chicken, mozzarella and our signature tomato sauce on a hand-tossed base.",
                price: 650,
                status: "approved",
                image:
                    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
            },
            {
                name: "Beef Pepperoni Pizza",
                category: "Special Pizza",
                description:
                    "Spicy beef pepperoni, extra cheese and oregano baked until the crust is golden.",
                price: 780,
                status: "approved",
                image:
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
            },
            {
                name: "Creamy Alfredo Pasta",
                category: "Pasta",
                description:
                    "Fettuccine tossed in a rich parmesan cream sauce with herbs and grilled chicken.",
                price: 420,
                status: "approved",
                image:
                    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
            },
            {
                name: "Smoky Beef Burger",
                category: "Burger",
                description:
                    "Flame-grilled beef patty, smoked cheese, lettuce and house sauce in a toasted bun.",
                price: 350,
                status: "pending",
                image:
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
            },
            {
                name: "Chocolate Lava Cake",
                category: "Dessert",
                description:
                    "Warm chocolate cake with a molten centre, served with a dusting of cocoa.",
                price: 250,
                status: "rejected",
                image:
                    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
            },
        ];

        const documents = items.map((item) => ({
            _id: new ObjectId(),
            vendorId: vendor._id,
            vendorName: "Pizza Palace",
            vendorImage:
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
            vendorLocation: "Dhanmondi, Dhaka",
            name: item.name,
            category: item.category,
            description: item.description,
            price: item.price,
            location: "Dhanmondi, Dhaka",
            image: item.image,
            status: item.status,
            isActive: true,
            premium: false,
            createdAt: now,
            updatedAt: now,
        }));

        await db.collection("menuItems").insertMany(documents);

        if (customer) {
            const first = documents[0];
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const deliveryDate = `${tomorrow.getFullYear()}-${String(
                tomorrow.getMonth() + 1
            ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

            await db.collection("orders").insertOne({
                _id: new ObjectId(),
                customerId: customer._id,
                customerName: customer.name,
                customerEmail: customer.email,
                vendorId: vendor._id,
                vendorName: "Pizza Palace",
                itemId: first._id.toString(),
                itemName: first.name,
                itemImage: first.image,
                unitPrice: first.price,
                quantity: 2,
                deliveryDate,
                deliveryAddress: "House 12, Road 5, Dhanmondi, Dhaka",
                message: "Extra cheese on one pizza, please.",
                status: "pending",
                createdAt: now,
                updatedAt: now,
            });
        }

        console.log(`Seeded 5 menu items and 1 pending order.`);
    }

    await db.collection("user").updateOne(
        { _id: vendor._id },
        { $set: { role: "vendor", blocked: false, updatedAt: now } }
    );

    if (customer) {
        await db.collection("user").updateOne(
            { _id: customer._id },
            { $set: { role: "customer", blocked: false, updatedAt: now } }
        );
    }

    console.log("Demo data ready.");
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await client.close();
}
