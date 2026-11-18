import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/types/dashboard";

export function FormMessage({
    state,
    className,
}: {
    state?: ActionResult | null;
    className?: string;
}) {
    if (!state?.message) {
        return null;
    }

    const Icon = state.ok ? CheckCircle2 : AlertCircle;

    return (
        <div
            role={state.ok ? "status" : "alert"}
            className={cn(
                "flex items-start gap-2 rounded-lg border p-3 text-sm",
                state.ok
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700",
                className
            )}
        >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{state.message}</span>
        </div>
    );
}
