"use client";

import { useState, useTransition } from "react";
import { Crown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/types/dashboard";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7000"
).replace(/\/$/, "");

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
                            const response = await fetch(
                                `${API_URL}/api/payments/checkout`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({}),
                                }
                            );

                            const data = (await response.json().catch(() => ({}))) as {
                                url?: string;
                                message?: string;
                            };

                            if (!response.ok || !data.url) {
                                setResult({
                                    ok: false,
                                    message:
                                        data.message ||
                                        "Unable to start Stripe Checkout. Please try again.",
                                });
                                return;
                            }

                            window.location.assign(data.url);
                        } catch {
                            setResult({
                                ok: false,
                                message:
                                    "Unable to reach the payment service. Please try again.",
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
