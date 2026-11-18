
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Pizza,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

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

    // Close menu when route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

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
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">

            {/* MAIN NAVBAR */}
            <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* LOGO */}
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2"
                    onClick={() => setMobileOpen(false)}
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200">
                        <Pizza size={27} strokeWidth={2.2} />
                    </div>

                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                        Pizza<span className="text-orange-500">Hub</span>
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive(link.href)
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* DESKTOP AUTH BUTTONS */}
                <div className="hidden items-center gap-3 lg:flex">

                    <Link
                        href="/sign-in"
                        className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 hover:shadow-lg"
                    >
                        Sign Up
                    </Link>

                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition hover:bg-orange-100 lg:hidden"
                >
                    {mobileOpen ? (
                        <X size={25} />
                    ) : (
                        <Menu size={25} />
                    )}
                </button>

            </nav>

            {/* MOBILE NAVIGATION */}
            {mobileOpen && (
                <div className="absolute left-0 top-full z-50 w-full border-t border-gray-100 bg-white shadow-xl lg:hidden">

                    <div className="mx-auto max-w-7xl space-y-2 px-4 py-5 sm:px-6">

                        {/* MOBILE LINKS */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                                    }`}
                            >
                                {link.name}

                                <ChevronRight
                                    size={18}
                                    className={
                                        isActive(link.href)
                                            ? "text-orange-500"
                                            : "text-gray-400"
                                    }
                                />
                            </Link>
                        ))}

                        {/* MOBILE AUTH BUTTONS */}
                        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                            <Link
                                href="/sign-in"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl border border-orange-500 py-3 text-center text-sm font-bold text-orange-600 transition hover:bg-orange-50"
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

                    </div>

                </div>
            )}

        </header>
    );
};

export default Navbar;
