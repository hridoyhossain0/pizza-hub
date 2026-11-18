import Link from "next/link";
import {
    ArrowLeft,
    ShieldCheck,
    Store,
    UserRound,
    type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ROLE_LABELS, type UserRole } from "@/lib/roles";
import type { SessionUser } from "@/lib/session";

interface RoleWorkspaceProps {
    user: SessionUser;
}

const WORKSPACE: Record<
    UserRole,
    { title: string; description: string; icon: LucideIcon }
> = {
    customer: {
        title: "Customer account",
        description:
            "Manage your PizzaHub profile and keep track of the meals you order.",
        icon: UserRound,
    },
    vendor: {
        title: "Vendor dashboard",
        description:
            "Manage your store, its menu and the orders customers place with you.",
        icon: Store,
    },
    admin: {
        title: "Admin console",
        description:
            "Oversee the PizzaHub marketplace, its vendors, customers and menu catalogue.",
        icon: ShieldCheck,
    },
};

export function RoleWorkspace({ user }: RoleWorkspaceProps) {
    const { title, description, icon: Icon } = WORKSPACE[user.role];

    return (
        <div className="flex flex-1 flex-col gap-6">
            <section>
                <Badge
                    variant="outline"
                    className="mb-4"
                >
                    <Icon aria-hidden="true" />
                    {ROLE_LABELS[user.role]}
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                    {description}
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Verified workspace</CardTitle>
                    <CardDescription>
                        This area is restricted to{" "}
                        {ROLE_LABELS[user.role].toLowerCase()} accounts. Your
                        role was verified on the server from the current
                        session.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Signed in as{" "}
                        <span className="font-medium text-foreground">
                            {user.name}
                        </span>{" "}
                        ({user.email}).
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <ArrowLeft
                            className="size-4"
                            aria-hidden="true"
                        />
                        Back to overview
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
