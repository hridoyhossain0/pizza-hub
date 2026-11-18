import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
    icon: Icon,
    title,
    description,
    className,
    children,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-14 text-center",
                className
            )}
        >
            <span className="flex size-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Icon className="size-7" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {description}
            </p>
            {children ? <div className="mt-5">{children}</div> : null}
        </div>
    );
}
