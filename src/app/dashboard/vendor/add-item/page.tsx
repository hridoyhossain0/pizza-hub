import Link from "next/link";
import { Crown, Store, UtensilsCrossed } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { MenuItemForm } from "@/components/dashboard/vendor/menu-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    getVendorProfile,
    getVendorStats,
} from "@/lib/data";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function AddMenuItemPage() {
    const user = await requireRole("vendor");
    const [profile, stats] = await Promise.all([
        getVendorProfile(user.id),
        getVendorStats(user.id),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Add menu item"
                description="Create a new dish. It will be submitted for administrator approval before customers can see it."
            />

            {!profile ? (
                <EmptyState
                    icon={Store}
                    title="Restaurant profile required"
                    description="Add your restaurant details first so your menu items show the correct restaurant name and location."
                >
                    <Button asChild className="bg-orange-500 text-white hover:bg-orange-600">
                        <Link href="/dashboard/vendor/profile">
                            Create restaurant profile
                        </Link>
                    </Button>
                </EmptyState>
            ) : stats.plan === "free" && stats.activeItems >= 3 ? (
                <EmptyState
                    icon={Crown}
                    title="Free plan limit reached"
                    description="Your Free plan allows a maximum of 3 active menu items. Upgrade to Premium to publish unlimited items."
                >
                    <Button asChild className="bg-amber-500 text-white hover:bg-amber-600">
                        <Link href="/dashboard/vendor/subscription">
                            Upgrade to Premium
                        </Link>
                    </Button>
                </EmptyState>
            ) : (
                <>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700">
                            <UtensilsCrossed className="size-4" />
                            {profile.restaurantName}
                        </span>
                        <span>
                            {stats.plan === "premium"
                                ? "Premium plan · unlimited items"
                                : `Free plan · ${stats.activeItems} of 3 active items used`}
                        </span>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Item details</CardTitle>
                            <CardDescription>
                                All fields are required. Images are uploaded to
                                ImgBB.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MenuItemForm mode="create" />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
