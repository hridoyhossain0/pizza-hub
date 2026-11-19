import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-gray-200 bg-gray-50 text-gray-600 dark:border-white/15 dark:bg-white/5 dark:text-gray-300",
    paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed: "border-red-200 bg-red-50 text-red-700",
    free: "border-gray-200 bg-gray-50 text-gray-700 dark:border-white/15 dark:bg-white/5 dark:text-gray-300",
    premium: "border-orange-200 bg-orange-50 text-orange-700",
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    inactive: "border-gray-200 bg-gray-50 text-gray-600 dark:border-white/15 dark:bg-white/5 dark:text-gray-300",
    blocked: "border-red-200 bg-red-50 text-red-700",
};

const LABELS: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    accepted: "Accepted",
    cancelled: "Cancelled",
    paid: "Paid",
    failed: "Failed",
    free: "Free plan",
    premium: "Premium",
    active: "Active",
    inactive: "Inactive",
    blocked: "Blocked",
};

export function StatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const key = status.toLowerCase();

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold",
                STYLES[key] ?? "border-border bg-muted text-muted-foreground",
                className
            )}
        >
            {LABELS[key] ?? status}
        </Badge>
    );
}
