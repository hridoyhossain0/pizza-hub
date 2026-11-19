import { PageHeader } from "@/components/dashboard/page-header";
import { AccountProfileForm } from "@/components/dashboard/profile/account-profile-form";
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
                description="Manage your account details and the public information customers see on your menu items."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Account details</CardTitle>
                    <CardDescription>
                        Your personal name and profile image. Your role and
                        subscription can only be changed by the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AccountProfileForm
                        user={{
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        }}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {profile ? "Restaurant details" : "Create your restaurant profile"}
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
