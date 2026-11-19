import { PageHeader } from "@/components/dashboard/page-header";
import { AccountProfileForm } from "@/components/dashboard/profile/account-profile-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function CustomerProfilePage() {
    const user = await requireRole("customer");

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="My profile"
                description="Update the name and profile image shown on your PizzaHub account."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Account details</CardTitle>
                    <CardDescription>
                        Your email address is managed by your sign-in account
                        and cannot be edited here. Role and subscription details
                        are read-only.
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
        </div>
    );
}
