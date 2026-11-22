"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Loader2, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    adminDeleteMenuItem,
    setMenuItemStatus,
} from "@/lib/actions/admin";
import { notifyResult } from "@/lib/toast";
import type {
    ActionResult,
    MenuStatus,
} from "@/lib/types/dashboard";

export function AdminMenuActions({
    itemId,
    itemName,
    status,
}: {
    itemId: string;
    itemName: string;
    status: MenuStatus;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const run = (
        action: () => Promise<ActionResult>,
        onSuccess?: () => void
    ) => {
        setResult(null);
        startTransition(async () => {
            const response = await action();
            setResult(response);
            notifyResult(response, {
                successTitle: "Menu item updated",
                errorTitle: "Could not update menu item",
            });
            if (response.ok) {
                onSuccess?.();
                router.refresh();
            }
        });
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap items-center justify-end gap-2">
                {status !== "approved" ? (
                    <Button
                        type="button"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                            run(() => setMenuItemStatus(itemId, "approved"))
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Check aria-hidden="true" />
                        Approve
                    </Button>
                ) : null}

                {status !== "rejected" ? (
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={pending}
                        onClick={() =>
                            run(() => setMenuItemStatus(itemId, "rejected"))
                        }
                    >
                        <X aria-hidden="true" />
                        Reject
                    </Button>
                ) : null}

                {status !== "pending" ? (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                            run(() => setMenuItemStatus(itemId, "pending"))
                        }
                    >
                        <Eye aria-hidden="true" />
                        Set pending
                    </Button>
                ) : null}

                {status !== "inactive" ? (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                            run(() => setMenuItemStatus(itemId, "inactive"))
                        }
                    >
                        <Eye aria-hidden="true" />
                        Set inactive
                    </Button>
                ) : null}

                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={pending}
                    onClick={() => setConfirmOpen(true)}
                >
                    {pending ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                        <Trash2 aria-hidden="true" />
                    )}
                    Delete
                </Button>
            </div>

            {result?.message ? (
                <p
                    className={
                        result.ok
                            ? "max-w-64 text-right text-xs font-medium text-emerald-600"
                            : "max-w-64 text-right text-xs font-medium text-red-600"
                    }
                >
                    {result.message}
                </p>
            ) : null}

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete this menu item?"
                description={`"${itemName}" will be removed permanently. This cannot be undone.`}
                confirmLabel="Delete item"
                destructive
                pending={pending}
                onConfirm={() =>
                    run(() => adminDeleteMenuItem(itemId), () =>
                        setConfirmOpen(false)
                    )
                }
            />
        </div>
    );
}
