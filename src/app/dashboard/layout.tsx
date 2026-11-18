import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireUser } from "@/lib/session";

export const instant = false;

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireUser();

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar role={user.role} />
                <SidebarInset>
                    <DashboardHeader user={user} />
                    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
