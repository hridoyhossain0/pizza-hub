"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { decideOrder } from "@/lib/actions/orders";
import { notifyResult } from "@/lib/toast";
import type { ActionResult } from "@/lib/types/dashboard";

export function VendorOrderActions({
    orderId,
    status,
}: {
    orderId: string;
    status: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    if (status !== "pending") {
        return result?.message ? (
            <p
                className={
                    result.ok
                        ? "text-xs font-medium text-emerald-600"
                        : "text-xs font-medium text-red-600"
                }
            >
                {result.message}
            </p>
        ) : (
            <span className="text-xs text-muted-foreground">
                Decision recorded
            </span>
        );
    }

    const run = (decision: "accepted" | "rejected") => {
        setResult(null);
        startTransition(async () => {
            const response = await decideOrder(orderId, decision);
            setResult(response);
            notifyResult(response, {
                successTitle: "Order updated",
                errorTitle: "Could not update order",
            });
            if (response.ok) {
                router.refresh();
            }
        });
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    size="sm"
                    disabled={pending}
                    onClick={() => run("accepted")}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    {pending ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                        <Check aria-hidden="true" />
                    )}
                    Accept
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={pending}
                    onClick={() => run("rejected")}
                >
                    <X aria-hidden="true" />
                    Reject
                </Button>
            </div>

            {result?.message ? (
                <p
                    className={
                        result.ok
                            ? "text-xs font-medium text-emerald-600"
                            : "text-xs font-medium text-red-600"
                    }
                >
                    {result.message}
                </p>
            ) : null}
        </div>
    );
}
