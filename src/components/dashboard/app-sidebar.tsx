"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { getNavigationForRole } from "@/lib/dashboard-navigation";
import { ROLE_LABELS, type UserRole } from "@/lib/roles";

interface AppSidebarProps {
    role: UserRole;
}

export function AppSidebar({ role }: AppSidebarProps) {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();

    const groups = getNavigationForRole(role);

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const closeMobileNavigation = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                        >
                            <Link
                                href="/"
                                onClick={closeMobileNavigation}
                                aria-label="PizzaHub home"
                            >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
                                    <Pizza className="size-5" />
                                </span>
                                <span className="flex flex-col gap-0.5 leading-none">
                                    <span className="text-base font-extrabold tracking-tight">
                                        Pizza<span className="text-orange-500">Hub</span>
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Dashboard
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {groups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const active = isActive(item.href, item.exact);
                                    const Icon = item.icon;

                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={item.title}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={closeMobileNavigation}
                                                    aria-current={active ? "page" : undefined}
                                                >
                                                    <Icon aria-hidden="true" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-sidebar-border px-3 py-2 group-data-[collapsible=icon]:hidden">
                    <span className="text-xs text-muted-foreground">
                        Signed in as
                    </span>
                    <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
