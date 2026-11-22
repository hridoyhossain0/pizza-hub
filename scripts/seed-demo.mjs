import { MongoClient, ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";

/**
 * Idempotent demo seed for PizzaHub.
 *
 * Creates (or repairs) four accounts, two vendor restaurants, approved menu
 * items covering all six storefront categories, a couple of past orders and a
 * paid subscription transaction. Safe to re-run: accounts and items are
 * upserted by their natural keys.
 *
 * Usage: npm run seed-demo
 */
const uri = process.env.MONGODB_URL;

if (!uri) {
    console.error("MONGODB_URL is not set. Run with --env-file=.env.");
    process.exit(1);
}

const DEMO_PASSWORD = "Demo@PizzaHub2026";

const ACCOUNTS = [
    {
        name: "PizzaHub Admin",
        email: "admin@pizzahub.dev",
        password: "Admin@PizzaHub2026",
        role: "admin",
    },
    {
        name: "Pizza Palace",
        email: "vendor@pizzahub.dev",
        password: DEMO_PASSWORD,
        role: "vendor",
        business: {
            name: "Pizza Palace",
            description:
                "Wood-fired pizzas, handmade sides and fresh desserts delivered hot across Dhaka.",
            area: "Dhanmondi",
            city: "Dhaka",
            image: "https://i.ibb.co/TMc3x2tN/pizzahub-test.jpg",
        },
        plan: "free",
    },
    {
        name: "Gourmet Slice Co.",
        email: "premium@pizzahub.dev",
        password: DEMO_PASSWORD,
        role: "vendor",
        business: {
            name: "Gourmet Slice Co.",
            description:
                "Small-batch gourmet pizzas with premium toppings, truffle oil and slow-proofed dough.",
            area: "Gulshan",
            city: "Dhaka",
            image: "https://i.ibb.co/tTS0XBnN/pizzahub-gourmet-truffle.jpg",
        },
        plan: "premium",
    },
    {
        name: "Demo Customer",
        email: "customer@pizzahub.dev",
        password: DEMO_PASSWORD,
        role: "customer",
    },
];

const IMG = {
    margherita: "https://i.ibb.co/TMc3x2tN/pizzahub-test.jpg",
    veggieSupreme: "https://i.ibb.co/m5nChkZY/pizzahub-veggie-supreme.jpg",
    meatLovers: "https://i.ibb.co/3m8QMRWk/pizzahub-meat-lovers.jpg",
    truffle: "https://i.ibb.co/tTS0XBnN/pizzahub-gourmet-truffle.jpg",
    garlicBread: "https://i.ibb.co/MDf3GxLs/pizzahub-garlic-bread.jpg",
    lavaCake: "https://i.ibb.co/HLPjSVLS/pizzahub-lava-cake.jpg",
    pepperoni: "https://i.ibb.co/JWsxJNcF/pizzahub-pepperoni-feast.jpg",
    veggieDeluxe: "https://i.ibb.co/rfx1RPjC/pizzahub-veggie-deluxe.jpg",
    icedDrink: "https://i.ibb.co/vvc4nfrF/pizzahub-iced-drink.jpg",
    fries: "https://i.ibb.co/273pmGgZ/pizzahub-fries-basket.jpg",
};

const MENU = [
    {
        vendor: "vendor@pizzahub.dev",
        itemName: "Margherita Classic",
        category: "Classic Pizzas",
        description:
            "San Marzano tomato sauce, fresh mozzarella and basil on a hand-tossed, slow-proofed base.",
        price: 550,
        status: "approved",
        images: [IMG.margherita],
    },
    {
        vendor: "vendor@pizzahub.dev",
        itemName: "Veggie Supreme",
        category: "Vegetarian Pizzas",
        description:
            "Bell peppers, red onion, olives, mushrooms and sweetcorn over a rich tomato base.",
        price: 720,
        status: "approved",
        images: [IMG.veggieSupreme],
    },
    {
        vendor: "vendor@pizzahub.dev",
        itemName: "Meat Lovers Feast",
        category: "Meat Lovers",
        description:
            "Chicken, beef pepperoni and smoked sausage piled high with a double layer of mozzarella.",
        price: 980,
        status: "approved",
        images: [IMG.meatLovers],
    },
    {
        vendor: "vendor@pizzahub.dev",
        itemName: "Crispy Seasoned Fries",
        category: "Sides & Appetizers",
        description:
            "Golden fries tossed in our house spice blend, served with a smoky garlic dip.",
        price: 240,
        status: "approved",
        images: [IMG.fries],
    },
    {
        vendor: "vendor@pizzahub.dev",
        itemName: "Spicy Chicken Wings",
        category: "Sides & Appetizers",
        description:
            "Oven-baked wings glazed in a chilli-honey sauce with a cooling ranch dip.",
        price: 390,
        status: "pending",
        images: [IMG.pepperoni],
    },
    {
        vendor: "vendor@pizzahub.dev",
        itemName: "Midnight Cocoa Pizza",
        category: "Beverages & Desserts",
        description:
            "A dessert pizza with dark cocoa, mascarpone and toasted hazelnuts.",
        price: 460,
        status: "rejected",
        images: [IMG.lavaCake],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Truffle Gourmet Pizza",
        category: "Specialty / Gourmet Pizzas",
        description:
            "Wild mushrooms, black truffle oil, fontina and thyme on a thin artisan crust.",
        price: 1250,
        status: "approved",
        premium: true,
        images: [IMG.truffle],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Pepperoni Feast",
        category: "Meat Lovers",
        description:
            "Cup-and-char pepperoni, aged mozzarella and hot honey on a blistered crust.",
        price: 1050,
        status: "approved",
        premium: true,
        images: [IMG.pepperoni],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Garden Deluxe",
        category: "Vegetarian Pizzas",
        description:
            "Roasted courgette, cherry tomatoes, rocket and shaved parmesan with basil oil.",
        price: 850,
        status: "approved",
        premium: true,
        images: [IMG.veggieDeluxe],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Garlic Breadsticks",
        category: "Sides & Appetizers",
        description:
            "Freshly baked breadsticks brushed with garlic butter and herbs, with marinara.",
        price: 280,
        status: "approved",
        premium: true,
        images: [IMG.garlicBread],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Chocolate Lava Cake",
        category: "Beverages & Desserts",
        description:
            "Warm chocolate cake with a molten centre, served with vanilla cream.",
        price: 350,
        status: "approved",
        premium: true,
        images: [IMG.lavaCake],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Iced Lemon Tea",
        category: "Beverages & Desserts",
        description:
            "Freshly brewed black tea shaken with lemon and ice for a crisp finish.",
        price: 180,
        status: "approved",
        premium: true,
        images: [IMG.icedDrink],
    },
    {
        vendor: "premium@pizzahub.dev",
        itemName: "Classic Pepperoni",
        category: "Classic Pizzas",
        description:
            "A timeless pepperoni pizza with mozzarella, oregano and our signature tomato sauce.",
        price: 950,
        status: "approved",
        premium: true,
        images: [IMG.pepperoni],
    },
];

function localDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

const client = new MongoClient(uri);

try {
    await client.connect();
    const db = client.db();
    const now = new Date();
    const users = new Map();

    for (const account of ACCOUNTS) {
        let user = await db.collection("user").findOne({
            email: account.email,
        });

        if (!user) {
            const _id = new ObjectId();
            const passwordHash = await hashPassword(account.password);

            await db.collection("user").insertOne({
                _id,
                name: account.name,
                email: account.email,
                emailVerified: true,
                image: null,
                role: account.role,
                roleConfigured: true,
                isBlocked: false,
                subscriptionPlan: account.plan ?? "free",
                subscriptionStatus:
                    account.plan === "premium" ? "active" : "expired",
                subscriptionExpiresAt:
                    account.plan === "premium"
                        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                        : null,
                premiumSince: account.plan === "premium" ? now : null,
                stripeCustomerId: null,
                lastCheckoutSessionId: null,
                createdAt: now,
                updatedAt: now,
            });

            await db.collection("account").insertOne({
                _id: new ObjectId(),
                accountId: _id.toString(),
                providerId: "credential",
                userId: _id,
                password: passwordHash,
                createdAt: now,
                updatedAt: now,
            });

            user = { _id, name: account.name, email: account.email };
            console.log(`Created account ${account.email} (${account.role}).`);
        } else {
            const update = {
                role: account.role,
                roleConfigured: true,
                isBlocked: false,
                emailVerified: true,
                updatedAt: now,
            };

            if (account.password) {
                const passwordHash = await hashPassword(account.password);
                const existingAccount = await db
                    .collection("account")
                    .findOne({ userId: user._id, providerId: "credential" });

                if (existingAccount) {
                    await db
                        .collection("account")
                        .updateOne(
                            { _id: existingAccount._id },
                            { $set: { password: passwordHash, updatedAt: now } }
                        );
                } else {
                    await db.collection("account").insertOne({
                        _id: new ObjectId(),
                        accountId: user._id.toString(),
                        providerId: "credential",
                        userId: user._id,
                        password: passwordHash,
                        createdAt: now,
                        updatedAt: now,
                    });
                }
            }

            await db.collection("user").updateOne(
                { _id: user._id },
                { $set: update }
            );
            console.log(`Updated account ${account.email} (${account.role}).`);
        }

        if (account.business) {
            await db.collection("user").updateOne(
                { _id: user._id },
                {
                    $set: {
                        businessName: account.business.name,
                        businessDescription: account.business.description,
                        businessArea: account.business.area,
                        businessCity: account.business.city,
                        businessImage: account.business.image,
                        subscriptionPlan: account.plan ?? "free",
                        subscriptionStatus:
                            account.plan === "premium" ? "active" : "expired",
                        subscriptionExpiresAt:
                            account.plan === "premium"
                                ? new Date(
                                      now.getTime() + 30 * 24 * 60 * 60 * 1000
                                  )
                                : null,
                        premiumSince:
                            account.plan === "premium" ? now : null,
                        updatedAt: now,
                    },
                }
            );
        }

        users.set(account.email, user);
    }

    let inserted = 0;

    for (const item of MENU) {
        const vendor = users.get(item.vendor);
        const business = ACCOUNTS.find(
            (entry) => entry.email === item.vendor
        ).business;

        if (!vendor) {
            continue;
        }

        const location = `${business.area}, ${business.city}`;

        await db.collection("menuItems").updateOne(
            { vendorId: vendor._id, itemName: item.itemName },
            {
                $set: {
                    vendorId: vendor._id,
                    vendorName: business.name,
                    vendorImage: business.image,
                    vendorLocation: location,
                    itemName: item.itemName,
                    category: item.category,
                    description: item.description,
                    price: item.price,
                    location,
                    images: item.images,
                    status: item.status,
                    premium: item.premium === true,
                    updatedAt: now,
                },
                $setOnInsert: {
                    _id: new ObjectId(),
                    createdAt: now,
                },
            },
            { upsert: true }
        );
        inserted += 1;
    }

    const customer = users.get("customer@pizzahub.dev");
    const palace = users.get("vendor@pizzahub.dev");
    const approved = await db
        .collection("menuItems")
        .find({ vendorId: palace._id, status: "approved" })
        .sort({ price: 1 })
        .toArray();

    if (customer && approved.length >= 2) {
        const orderCount = await db
            .collection("orders")
            .countDocuments({ customerId: customer._id });

        if (orderCount === 0) {
            const [first, second] = approved;

            await db.collection("orders").insertMany([
                {
                    _id: new ObjectId(),
                    customerId: customer._id,
                    customerName: customer.name,
                    customerEmail: customer.email,
                    vendorId: palace._id,
                    vendorName: "Pizza Palace",
                    itemId: first._id.toString(),
                    itemName: first.itemName,
                    itemImage: first.images?.[0] ?? "",
                    unitPrice: first.price,
                    quantity: 2,
                    deliveryDate: localDate(-6),
                    deliveryAddress: "House 12, Road 5, Dhanmondi, Dhaka",
                    message: "Please cut into eight slices.",
                    status: "accepted",
                    createdAt: new Date(now.getTime() - 7 * 86400000),
                    updatedAt: new Date(now.getTime() - 6 * 86400000),
                },
                {
                    _id: new ObjectId(),
                    customerId: customer._id,
                    customerName: customer.name,
                    customerEmail: customer.email,
                    vendorId: palace._id,
                    vendorName: "Pizza Palace",
                    itemId: second._id.toString(),
                    itemName: second.itemName,
                    itemImage: second.images?.[0] ?? "",
                    unitPrice: second.price,
                    quantity: 1,
                    deliveryDate: localDate(-9),
                    deliveryAddress: "House 12, Road 5, Dhanmondi, Dhaka",
                    message: "",
                    status: "cancelled",
                    createdAt: new Date(now.getTime() - 10 * 86400000),
                    updatedAt: new Date(now.getTime() - 9 * 86400000),
                },
            ]);
        }
    }

    const premiumVendor = users.get("premium@pizzahub.dev");

    if (premiumVendor) {
        const sessionId = "cs_test_demo_premium_seed";
        await db.collection("transactions").updateOne(
            { stripeSessionId: sessionId },
            {
                $set: {
                    vendorId: premiumVendor._id,
                    vendorName: "Gourmet Slice Co.",
                    plan: "premium",
                    amount: 499,
                    currency: "bdt",
                    stripeSubscriptionId: null,
                    stripePaymentIntentId: "pi_demo_premium_seed",
                    status: "paid",
                    transactionDate: now,
                },
                $setOnInsert: { _id: new ObjectId(), createdAt: now },
            },
            { upsert: true }
        );
    }

    console.log(`Demo data ready: ${inserted} menu items upserted.`);
    console.log("Accounts:");
    for (const account of ACCOUNTS) {
        console.log(
            `  ${account.email} / ${account.password} (${account.role})`
        );
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await client.close();
}
