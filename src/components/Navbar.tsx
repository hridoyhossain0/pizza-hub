"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Pizza,
    Menu,
    X,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    MoonStar,
    UserRound,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");

    return initials || "PH";
}

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const role = user
        ? ((user as { role?: string }).role ?? "customer")
        : "customer";
    const profileHref =
        role === "vendor"
            ? "/dashboard/vendor/profile"
            : role === "admin"
              ? "/dashboard/admin"
              : "/dashboard/customer/profile";

    const handleSignOut = async () => {
        setSigningOut(true);

        try {
            await authClient.signOut();
        } finally {
            setMobileOpen(false);
            router.replace("/");
            router.refresh();
            setSigningOut(false);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Menu", href: "/menu" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    // Close menu with Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/90">

            {/* MAIN NAVBAR */}
            <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* LOGO */}
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-500/20">
                        <Pizza size={27} strokeWidth={2.2} />
                    </div>

                    <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Pizza<span className="text-orange-500">Hub</span>
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                isActive(link.href)
                                    ? "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* DESKTOP AUTH AREA */}
                <div className="hidden items-center gap-3 lg:flex">

                    <ThemeToggle />

                    {isPending ? (
                        <div className="size-11 animate-pulse rounded-full bg-gray-100 dark:bg-white/10" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Open account menu"
                                    className="rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                                >
                                    <Avatar className="size-11 border border-orange-100 shadow-sm dark:border-white/10">
                                        {user.image ? (
                                            <AvatarImage
                                                src={user.image}
                                                alt={user.name}
                                            />
                                        ) : null}
                                        <AvatarFallback className="bg-orange-100 font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-64"
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="truncate text-sm font-semibold">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">
                                        <LayoutDashboard aria-hidden="true" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={profileHref}>
                                        <UserRound aria-hidden="true" />
                                        My profile
                                    </Link>
                                </DropdownMenuItem>

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
                                    {signingOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 hover:shadow-lg dark:shadow-orange-500/20"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                </div>

                {/* MOBILE CONTROLS */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle className="size-10" />

                    <button
                        type="button"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition hover:bg-orange-100 dark:bg-white/10 dark:text-orange-400 dark:hover:bg-white/15"
                    >
                        {mobileOpen ? (
                            <X size={25} />
                        ) : (
                            <Menu size={25} />
                        )}
                    </button>
                </div>

            </nav>

            {/* MOBILE NAVIGATION */}
            {mobileOpen && (
                <div className="absolute left-0 top-full z-50 w-full border-t border-gray-100 bg-white shadow-xl lg:hidden dark:border-white/10 dark:bg-neutral-950">

                    <div className="mx-auto max-w-7xl space-y-2 px-4 py-5 sm:px-6">

                        {/* MOBILE LINKS */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    isActive(link.href)
                                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
                                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                                }`}
                            >
                                {link.name}

                                <ChevronRight
                                    size={18}
                                    className={
                                        isActive(link.href)
                                            ? "text-orange-500"
                                            : "text-gray-400 dark:text-gray-500"
                                    }
                                />
                            </Link>
                        ))}

                        {/* MOBILE AUTH AREA */}
                        <div className="border-t border-gray-100 pt-4 dark:border-white/10">
                            {isPending ? (
                                <div className="h-14 animate-pulse rounded-xl bg-gray-100 dark:bg-white/10" />
                            ) : user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                                        <Avatar className="size-11 border border-orange-100 dark:border-white/10">
                                            {user.image ? (
                                                <AvatarImage
                                                    src={user.image}
                                                    alt={user.name}
                                                />
                                            ) : null}
                                            <AvatarFallback className="bg-orange-100 font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/dashboard"
                                            onClick={() =>
                                                setMobileOpen(false)
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                                        >
                                            <LayoutDashboard
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            Dashboard
                                        </Link>

                                        <button
                                            type="button"
                                            disabled={signingOut}
                                            onClick={() => void handleSignOut()}
                                            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-center text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                                        >
                                            <LogOut
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            {signingOut
                                                ? "Signing out..."
                                                : "Sign out"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/sign-in"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-xl border border-orange-500 py-3 text-center text-sm font-bold text-orange-600 transition hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        href="/sign-up"
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-xl bg-orange-500 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        <p className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-400 dark:text-gray-500">
                            <MoonStar size={14} aria-hidden="true" />
                            Tap the sun or moon icon to switch themes
                        </p>

                    </div>

                </div>
            )}

        </header>
    );
};

export default Navbar;
