import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    hint?: string;
    accent?: "orange" | "green" | "amber" | "red" | "blue" | "violet";
}

const ACCENTS: Record<NonNullable<StatCardProps["accent"]>, string> = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-sky-100 text-sky-600",
    violet: "bg-violet-100 text-violet-600",
};

export function StatCard({
    label,
    value,
    icon: Icon,
    hint,
    accent = "orange",
}: StatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-start gap-4 py-1">
                <span
                    className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-xl",
                        ACCENTS[accent]
                    )}
                >
                    <Icon className="size-5" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight">
                        {value}
                    </p>
                    {hint ? (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {hint}
                        </p>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
