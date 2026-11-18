import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

import { DashboardBreadcrumbs } from "@/components/dashboard/dashboard-breadcrumbs";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { SessionUser } from "@/lib/session";

export function DashboardHeader({ user }: { user: SessionUser }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4!" />

            <DashboardBreadcrumbs />

            <div className="ml-auto flex items-center gap-2">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex"
                >
                    <Link href="/menu">
                        <UtensilsCrossed aria-hidden="true" />
                        Browse menu
                    </Link>
                </Button>

                <UserMenu
                    user={{
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                    }}
                />
            </div>
        </header>
    );
}
