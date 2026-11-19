"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cancelPremium } from "@/lib/actions/vendor";
import type { ActionResult } from "@/lib/types/dashboard";

export function CancelPremiumButton() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    return (
        <div className="flex flex-col gap-3">
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => {
                    if (
                        !window.confirm(
                            "Cancel Premium? You keep access until the end of the paid period."
                        )
                    ) {
                        return;
                    }

                    setResult(null);
                    startTransition(async () => {
                        const response = await cancelPremium();
                        setResult(response);

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
                {pending ? "Cancelling..." : "Cancel Premium"}
            </Button>

            {result?.message ? (
                <p
                    role={result.ok ? "status" : "alert"}
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
