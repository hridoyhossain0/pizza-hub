"use client";

import { useState, useTransition } from "react";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type { ActionResult } from "@/lib/types/dashboard";

export function UpgradeButton() {
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
                        try {
                            const { response, data } = await apiFetch<{
                                url?: string;
                                message?: string;
                            }>("/api/payments/checkout", {
                                method: "POST",
                                body: JSON.stringify({}),
                            });

                            if (!response.ok || !data?.url) {
                                const message =
                                    data?.message ||
                                    "Unable to start Stripe Checkout. Please try again.";

                                setResult({ ok: false, message });
                                toast.error("Checkout not started", {
                                    description: message,
                                });
                                return;
                            }

                            toast.loading("Redirecting to Stripe...", {
                                id: "stripe-checkout",
                            });
                            window.location.assign(data.url);
                        } catch {
                            const message =
                                "Unable to reach the payment service. Please try again.";

                            setResult({ ok: false, message });
                            toast.error("Payment service unreachable", {
                                description: message,
                            });
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
                {pending ? "Redirecting to Stripe..." : "Upgrade to Premium"}
            </Button>

            {result?.message ? (
                <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {result.message}
                </p>
            ) : null}
        </div>
    );
}
