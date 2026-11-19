"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

/** Sonner toaster that follows the active light/dark theme. */
export function Toaster() {
    const { resolvedTheme } = useTheme();

    return (
        <SonnerToaster
            position="top-right"
            richColors
            closeButton
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            toastOptions={{ duration: 5000 }}
        />
    );
}
