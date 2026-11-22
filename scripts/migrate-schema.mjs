import { MongoClient, ObjectId } from "mongodb";

/**
 * One-off schema migration to the field names required by the PizzaHub brief.
 *
 * users        blocked -> isBlocked; vendorProfiles merged into business* fields
 * menuItems    name -> itemName, image -> images[], isActive folded into status
 * transactions paymentStatus -> status, stripeSubscriptionId added
 *
 * It is safe to run more than once: every step only writes when the legacy
 * field is present.
 *
 * Usage: npm run migrate-schema
 */
const uri = process.env.MONGODB_URL;

if (!uri) {
  console.error("MONGODB_URL is not set. Run with --env-file=.env.");
  process.exit(1);
}

const CATEGORY_MAP = {
  Pizza: "Classic Pizzas",
  "Special Pizza": "Specialty / Gourmet Pizzas",
  Burger: "Sides & Appetizers",
  Pasta: "Sides & Appetizers",
  Sandwich: "Sides & Appetizers",
  "Rice & Curry": "Sides & Appetizers",
  Sides: "Sides & Appetizers",
  Dessert: "Beverages & Desserts",
  Drinks: "Beverages & Desserts",
};

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db();
  const now = new Date();
  const summary = { users: 0, profiles: 0, items: 0, transactions: 0 };

  const profiles = await db.collection("vendorProfiles").find({}).toArray();
  const profilesByUser = new Map(
    profiles.map((profile) => [profile.userId.toString(), profile])
  );

  for (const user of await db.collection("user").find({}).toArray()) {
    const set = {};
    const unset = {};

    if (Object.prototype.hasOwnProperty.call(user, "blocked")) {
      set.isBlocked = user.blocked === true;
      unset.blocked = "";
    } else {
      set.isBlocked = user.isBlocked === true;
    }

    if (!Object.prototype.hasOwnProperty.call(user, "roleConfigured")) {
      set.roleConfigured =
        user.role === "vendor" || user.role === "admin" ? true : false;
    }

    if (!user.subscriptionPlan) {
      set.subscriptionPlan = "free";
    }

    const profile = profilesByUser.get(user._id.toString());

    if (profile) {
      set.businessName = profile.restaurantName;
      set.businessDescription = profile.description ?? "";
      set.businessImage = profile.image ?? "";
      set.businessArea = profile.area ?? "";
      set.businessCity = profile.city ?? "";
      set.subscriptionPlan = profile.subscriptionPlan ?? "free";
      set.subscriptionStatus =
        profile.subscriptionStatus ??
        (profile.subscriptionPlan === "premium" ? "active" : "expired");
      set.subscriptionExpiresAt = profile.premiumExpiresAt ?? null;
      set.premiumSince = profile.premiumSince ?? null;
      set.stripeCustomerId = profile.stripeCustomerId ?? null;
      set.lastCheckoutSessionId = profile.lastCheckoutSessionId ?? null;
      set.updatedAt = now;
      summary.profiles += 1;
    }

    await db.collection("user").updateOne(
      { _id: user._id },
      {
        $set: set,
        ...(Object.keys(unset).length ? { $unset: unset } : {}),
      }
    );
    summary.users += 1;
  }

  for (const item of await db.collection("menuItems").find({}).toArray()) {
    const set = {};
    const unset = {};

    if (!Array.isArray(item.images)) {
      set.images = item.image ? [item.image] : [];
      unset.image = "";
    }

    if (typeof item.itemName !== "string") {
      set.itemName = item.name ?? "Menu item";
      unset.name = "";
    }

    if (!item.status) {
      set.status = "pending";
    } else if (Object.prototype.hasOwnProperty.call(item, "isActive")) {
      if (item.status !== "rejected" && item.isActive === false) {
        set.status = "inactive";
      }
      unset.isActive = "";
    }

    if (CATEGORY_MAP[item.category]) {
      set.category = CATEGORY_MAP[item.category];
    }

    if (typeof item.premium !== "boolean") {
      set.premium = false;
    }

    await db
      .collection("menuItems")
      .updateOne(
        { _id: item._id },
        { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) }
      );
    summary.items += 1;
  }

  for (const tx of await db.collection("transactions").find({}).toArray()) {
    const set = {};
    const unset = {};

    if (!tx.status) {
      set.status = tx.paymentStatus ?? "paid";
      unset.paymentStatus = "";
    }

    if (!Object.prototype.hasOwnProperty.call(tx, "stripeSubscriptionId")) {
      set.stripeSubscriptionId = null;
    }

    await db
      .collection("transactions")
      .updateOne(
        { _id: tx._id },
        { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) }
      );
    summary.transactions += 1;
  }

  // The brief requires exactly four business collections; both legacy
  // collections are fully merged into `user` / `menuItems` above.
  const existing = new Set(
    (await db.listCollections().toArray()).map((collection) => collection.name)
  );

  for (const legacy of ["vendorProfiles", "images"]) {
    if (existing.has(legacy)) {
      await db.collection(legacy).drop();
      console.log(`Dropped legacy collection: ${legacy}`);
    }
  }

  // Helpful indexes for the advanced search endpoint.
  await db.collection("menuItems").createIndex({
    status: 1,
    category: 1,
    price: 1,
  });
  await db.collection("menuItems").createIndex({ itemName: "text" });
  await db.collection("orders").createIndex({ vendorId: 1, status: 1 });
  await db.collection("orders").createIndex({ customerId: 1, status: 1 });

  console.log("Migration complete:", summary);
} finally {
  await client.close();
}
