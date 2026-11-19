import Link from "next/link";
import { ArrowLeft, CreditCard, Info } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function PaymentCancelPage() {
    await requireRole("vendor");

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Payment cancelled"
                description="Stripe Checkout was closed before a payment was completed."
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="size-5 text-amber-600" />
                        No payment was taken
                    </CardTitle>
                    <CardDescription>
                        Your plan has not changed. You can restart the upgrade
                        whenever you are ready.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button asChild className="bg-amber-500 text-white hover:bg-amber-600">
                        <Link href="/dashboard/vendor/subscription">
                            <CreditCard aria-hidden="true" />
                            Return to subscription
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/vendor">
                            <ArrowLeft aria-hidden="true" />
                            Back to dashboard
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
