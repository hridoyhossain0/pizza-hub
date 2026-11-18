import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ItemDetails from "@/components/Menu/ItemDetails";
import { getPublicMenuItem } from "@/lib/data";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const instant = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const item = await getPublicMenuItem(id);

    if (!item) {
        return { title: "Menu item not found | PizzaHub" };
    }

    return {
        title: `${item.name} | PizzaHub`,
        description: item.description.slice(0, 160),
    };
}

export default async function MenuItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [item, currentUser] = await Promise.all([
        getPublicMenuItem(id),
        getCurrentUser(),
    ]);

    if (!item) {
        notFound();
    }

    return (
        <ItemDetails
            item={{
                _id: item._id,
                name: item.name,
                images: [item.image],
                category: item.category,
                description: item.description,
                price: item.price,
                location: item.location,
                status: item.status,
                isActive: item.isActive,
                vendor: {
                    _id: item.vendorId,
                    name: item.vendorName,
                    image: item.vendorImage,
                    location: item.vendorLocation,
                    premium: item.premium,
                },
            }}
            currentUser={
                currentUser
                    ? {
                          _id: currentUser._id,
                          role: currentUser.role,
                      }
                    : null
            }
        />
    );
}
