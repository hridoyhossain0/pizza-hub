"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { upgradeToPremium } from "@/lib/actions/vendor";
import type { ActionResult } from "@/lib/types/dashboard";

export function UpgradeButton() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    return (
        <div className="flex flex-col gap-3">
            <Button
                type="button"
                size="lg"
                disabled={pending}
                onClick={() => {
                    setResult(null);
                    startTransition(async () => {
                        const response = await upgradeToPremium();
                        setResult(response);
                        if (response.ok) {
                            router.refresh();
                        }
                    });
                }}
                className="bg-amber-500 text-white hover:bg-amber-600"
            >
                {pending ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                    <Crown aria-hidden="true" />
                )}
                {pending ? "Processing upgrade..." : "Upgrade to Premium"}
            </Button>

            {result?.message ? (
                <p
                    role={result.ok ? "status" : "alert"}
                    className={
                        result.ok
                            ? "rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
                            : "rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    }
                >
                    {result.message}
                </p>
            ) : null}
        </div>
    );
}
