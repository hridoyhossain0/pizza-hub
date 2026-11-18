import { PageHeader } from "@/components/dashboard/page-header";
import { VendorProfileForm } from "@/components/dashboard/vendor/profile-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getVendorProfile } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function VendorProfilePage() {
    const user = await requireRole("vendor");
    const profile = await getVendorProfile(user.id);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Restaurant profile"
                description="This information is shown to customers on your menu items and order pages."
            />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {profile ? "Manage your profile" : "Create your profile"}
                    </CardTitle>
                    <CardDescription>
                        {profile
                            ? "Update your public restaurant details or replace the logo."
                            : "Add your restaurant details before publishing menu items."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <VendorProfileForm profile={profile} />
                </CardContent>
            </Card>
        </div>
    );
}
