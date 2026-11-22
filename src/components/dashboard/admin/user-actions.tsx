"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { setUserBlocked } from "@/lib/actions/admin";
import { notifyResult } from "@/lib/toast";
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
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (role === "admin") {
        return (
            <span className="text-xs text-muted-foreground">
                Protected account
            </span>
        );
    }

    const run = () => {
        setResult(null);
        startTransition(async () => {
            const response = await setUserBlocked(userId, !blocked);
            setResult(response);
            notifyResult(response, {
                successTitle: "User updated",
                errorTitle: "Could not update user",
            });
            if (response.ok) {
                setConfirmOpen(false);
                router.refresh();
            }
        });
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <Button
                type="button"
                size="sm"
                variant={blocked ? "outline" : "destructive"}
                disabled={pending}
                onClick={() => setConfirmOpen(true)}
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

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={blocked ? "Unblock this user?" : "Block this user?"}
                description={
                    blocked
                        ? `${userName} will be able to sign in and use protected features again.`
                        : `${userName} will immediately lose access to protected features and all active sessions will be signed out.`
                }
                confirmLabel={blocked ? "Unblock user" : "Block user"}
                destructive={!blocked}
                pending={pending}
                onConfirm={run}
            />
        </div>
    );
}
