"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Applies the `dark` class on <html> so every Tailwind `dark:` variant and the
 * shadcn theme tokens switch together. The choice is stored in localStorage and
 * falls back to the operating system preference.
 */
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
