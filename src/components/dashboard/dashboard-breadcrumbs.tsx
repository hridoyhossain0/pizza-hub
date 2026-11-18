"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getNavTitleForPath } from "@/lib/dashboard-navigation";

function toLabel(pathname: string, segment: string) {
    const known = getNavTitleForPath(pathname);

    if (known) {
        return known;
    }

    // Dynamic segments (menu item ids) get a readable fallback.
    if (/^[0-9a-f]{24}$/i.test(segment) || /^\d+$/.test(segment)) {
        return "Details";
    }

    return segment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function DashboardBreadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const crumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        return { href, label: toLabel(href, segment) };
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                        <Link href="/" aria-label="Home">
                            <House className="size-4" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />

                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;

                    return (
                        <Fragment key={crumb.href}>
                            <BreadcrumbItem
                                className={isLast ? undefined : "hidden md:block"}
                            >
                                {isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.href}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast && (
                                <BreadcrumbSeparator className="hidden md:block" />
                            )}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
