import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import ItemDetails from "@/components/Menu/ItemDetails";
import { getPublicMenuItem } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

export const instant = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const item = await getPublicMenuItem(id);

    if (!item) {
        return { title: "Menu item not found" };
    }

    return {
        title: item.name,
        description: item.description.slice(0, 160),
    };
}

export default async function MenuItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Item details are a private route: guests are sent to sign in first and
    // returned to this item afterwards. Blocked accounts cannot continue.
    const user = await getSessionUser();

    if (!user) {
        redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${id}`)}`);
    }

    if (user.blocked) {
        redirect("/blocked");
    }

    const item = await getPublicMenuItem(id);

    if (!item) {
        notFound();
    }

    const images =
        item.images.length > 0
            ? item.images
            : item.image
              ? [item.image]
              : [];

    return (
        <ItemDetails
            item={{
                _id: item._id,
                name: item.name,
                images,
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
            currentUser={{
                _id: user.id,
                role: user.role,
            }}
        />
    );
}
