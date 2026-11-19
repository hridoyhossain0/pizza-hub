import { Check, CircleX, Clock3 } from "lucide-react";

import { CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import type { OrderView } from "@/lib/types/dashboard";

type OrderStatusTimelineProps = Pick<
    OrderView,
    "status" | "createdAt" | "updatedAt"
>;

export function OrderStatusTimeline({
    status,
    createdAt,
    updatedAt,
}: OrderStatusTimelineProps) {
    const resultLabel =
        status === "accepted"
            ? "Restaurant accepted"
            : status === "rejected"
              ? "Restaurant declined"
              : "Order cancelled";
    const isPending = status === "pending";
    const isClosed = status === "rejected" || status === "cancelled";

    return (
        <CardContent>
            <ol aria-label="Order status timeline" className="relative">
                <li className="relative flex gap-3 pb-6">
                    <span className="absolute left-[13px] top-7 h-full w-px bg-emerald-500/40" />
                    <span className="z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <Check className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                        <p className="font-semibold">Order placed</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {formatDateTime(createdAt)}
                        </p>
                    </div>
                </li>
                <li className="relative flex gap-3">
                    <span
                        className={
                            isPending
                                ? "z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                : isClosed
                                  ? "z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                  : "z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        }
                    >
                        {isPending ? (
                            <Clock3 className="size-4" aria-hidden="true" />
                        ) : isClosed ? (
                            <CircleX className="size-4" aria-hidden="true" />
                        ) : (
                            <Check className="size-4" aria-hidden="true" />
                        )}
                    </span>
                    <div className="min-w-0 pt-0.5">
                        <p className="font-semibold">
                            {isPending
                                ? "Awaiting restaurant response"
                                : resultLabel}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {isPending
                                ? "The restaurant has not responded yet."
                                : formatDateTime(updatedAt)}
                        </p>
                    </div>
                </li>
            </ol>
        </CardContent>
    );
}
