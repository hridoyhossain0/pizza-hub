"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ChevronsUpDown,
    LayoutDashboard,
    LogOut,
    Store,
    UtensilsCrossed,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        image: string | null;
        role: UserRole;
    };
}

function getInitials(name: string) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");

    return initials || "PH";
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);

        try {
            await authClient.signOut();
        } finally {
            router.replace("/sign-in");
            router.refresh();
            setSigningOut(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-full p-1 pr-2 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Avatar size="sm">
                        {user.image ? (
                            <AvatarImage
                                src={user.image}
                                alt={user.name}
                            />
                        ) : null}
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                        <span className="truncate text-sm font-medium">
                            {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </span>
                    </span>
                    <ChevronsUpDown
                        className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                        aria-hidden="true"
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-64"
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                        <span className="truncate text-sm font-medium">
                            {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </span>
                        <Badge
                            variant="secondary"
                            className="mt-1 w-fit"
                        >
                            {ROLE_LABELS[user.role]}
                        </Badge>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard aria-hidden="true" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/menu">
                            <UtensilsCrossed aria-hidden="true" />
                            Browse menu
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <Store aria-hidden="true" />
                            Storefront
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    disabled={signingOut}
                    onSelect={(event) => {
                        event.preventDefault();
                        void handleSignOut();
                    }}
                >
                    <LogOut aria-hidden="true" />
                    {signingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
