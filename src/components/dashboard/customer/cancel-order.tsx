"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/lib/actions/orders";
import { notifyResult } from "@/lib/toast";
import type { ActionResult } from "@/lib/types/dashboard";

export function CancelOrderButton({ orderId }: { orderId: string }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    return (
        <div className="flex flex-col items-end gap-2">
            <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={() => {
                    if (
                        !window.confirm(
                            "Cancel this order? This cannot be undone."
                        )
                    ) {
                        return;
                    }

                    setResult(null);
                    startTransition(async () => {
                        const response = await cancelOrder(orderId);
                        setResult(response);
                        notifyResult(response, {
                            successTitle: "Order cancelled",
                            errorTitle: "Could not cancel order",
                        });
                        if (response.ok) {
                            router.refresh();
                        }
                    });
                }}
            >
                {pending ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                    <XCircle aria-hidden="true" />
                )}
                {pending ? "Cancelling..." : "Cancel order"}
            </Button>

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
