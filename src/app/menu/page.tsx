import type { Metadata } from "next";

import BrowseMenu from "@/components/Menu/BrowseMenu";
import { getPublicMenuItems } from "@/lib/data";

export const instant = false;

export const metadata: Metadata = {
    title: "Browse Menu",
    description:
        "Explore approved dishes from trusted PizzaHub restaurants. Search by name, category or location.",
};

export default async function MenuPage() {
    const items = await getPublicMenuItems();

    const menuItems = items.map((item) => ({
        _id: item._id,
        name: item.name,
        image: item.image,
        category: item.category,
        price: item.price,
        location: item.location,
        status: item.status,
        isActive: item.isActive,
        premium: item.premium,
        vendor: {
            name: item.vendorName,
            image: item.vendorImage,
        },
    }));

    return <BrowseMenu items={menuItems} />;
}
