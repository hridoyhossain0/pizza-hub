"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * Light/dark switch. Both icons are always rendered and swapped with CSS so
 * the server and client markup match — no "mounted" state or hydration flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className={cn(
                "flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600",
                "dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/15 dark:hover:text-orange-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950",
                className
            )}
        >
            <Sun size={19} aria-hidden="true" className="hidden dark:block" />
            <Moon size={19} aria-hidden="true" className="dark:hidden" />
        </button>
    );
}
