"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Power, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    deleteMenuItem,
    setMenuItemAvailability,
} from "@/lib/actions/menu";
import { notifyResult } from "@/lib/toast";
import type { ActionResult } from "@/lib/types/dashboard";

export function MenuRowActions({
    itemId,
    isActive,
}: {
    itemId: string;
    isActive: boolean;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ActionResult | null>(null);

    const run = (action: () => Promise<ActionResult>) => {
        setResult(null);
        startTransition(async () => {
            const response = await action();
            setResult(response);
            notifyResult(response, {
                successTitle: "Menu item updated",
                errorTitle: "Could not update menu item",
            });
            if (response.ok) {
                router.refresh();
            }
        });
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                        run(() => setMenuItemAvailability(itemId, !isActive))
                    }
                >
                    {pending ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                        <Power aria-hidden="true" />
                    )}
                    {isActive ? "Set unavailable" : "Set available"}
                </Button>

                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={pending}
                    onClick={() => {
                        if (
                            !window.confirm(
                                "Delete this menu item? This cannot be undone."
                            )
                        ) {
                            return;
                        }

                        run(() => deleteMenuItem(itemId));
                    }}
                >
                    <Trash2 aria-hidden="true" />
                    Delete
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
