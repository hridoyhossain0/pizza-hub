"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/**
 * Keeps the marketing navbar/footer on the storefront while the dashboard
 * renders its own shell (sidebar + dashboard header).
 */
export default function SiteChrome({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard =
        pathname === "/dashboard" || pathname.startsWith("/dashboard/");

    if (isDashboard) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
