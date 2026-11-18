"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setUserBlocked } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/types/dashboard";

export function AdminUserActions({
    userId,
    userName,
    blocked,
    role,
}: {
    userId: string;
    userName: string;
    blocked: boolean;
    role: string;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    if (role === "admin") {
        return (
            <span className="text-xs text-muted-foreground">
                Protected account
            </span>
        );
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <Button
                type="button"
                size="sm"
                variant={blocked ? "outline" : "destructive"}
                disabled={pending}
                onClick={() => {
                    if (
                        !window.confirm(
                            blocked
                                ? `Unblock ${userName}? They will be able to sign in and use protected features again.`
                                : `Block ${userName}? Their active sessions will be signed out immediately.`
                        )
                    ) {
                        return;
                    }

                    setResult(null);
                    startTransition(async () => {
                        const response = await setUserBlocked(
                            userId,
                            !blocked
                        );
                        setResult(response);
                        if (response.ok) {
                            router.refresh();
                        }
                    });
                }}
            >
                {pending ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                ) : blocked ? (
                    <ShieldCheck aria-hidden="true" />
                ) : (
                    <ShieldBan aria-hidden="true" />
                )}
                {pending ? "Saving..." : blocked ? "Unblock" : "Block"}
            </Button>

            {result?.message ? (
                <p
                    className={
                        result.ok
                            ? "max-w-52 text-right text-xs font-medium text-emerald-600"
                            : "max-w-52 text-right text-xs font-medium text-red-600"
                    }
                >
                    {result.message}
                </p>
            ) : null}
        </div>
    );
}
