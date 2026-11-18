import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { MenuItemForm } from "@/components/dashboard/vendor/menu-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getVendorMenuItem } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function EditMenuItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireRole("vendor");
    const { id } = await params;
    const item = await getVendorMenuItem(user.id, id);

    if (!item) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Edit menu item"
                description="Update the details, replace the image, or change its availability."
            />

            <Card>
                <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>
                        Changes keep the current approval status. Administrators
                        can review the item again at any time.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuItemForm
                        mode="edit"
                        item={{
                            _id: item._id,
                            name: item.name,
                            category: item.category,
                            description: item.description,
                            price: item.price,
                            location: item.location,
                            image: item.image,
                            status: item.status,
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
