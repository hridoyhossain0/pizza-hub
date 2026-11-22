import type { Metadata } from "next";

import BrowseMenu from "@/components/Menu/BrowseMenu";
import { getPublicMenuItems } from "@/lib/data";
import { MENU_CATEGORIES } from "@/lib/types/dashboard";

export const instant = false;

export const metadata: Metadata = {
    title: "Browse Menu",
    description:
        "Explore approved dishes from trusted PizzaHub restaurants. Search by name, category or location and sort by price.",
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

    const locations = Array.from(
        new Set(items.map((item) => item.location).filter(Boolean))
    ).sort();

    return (
        <BrowseMenu
            items={menuItems}
            categories={[...MENU_CATEGORIES]}
            locations={locations}
        />
    );
}
