"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/types/dashboard";

/**
 * Watches a `useActionState` result and shows a toast once per new result.
 * The inline `FormMessage` stays as a persistent, accessible status.
 */
export function useActionToast(
    state: ActionResult,
    options?: { successTitle?: string; errorTitle?: string }
) {
    const lastState = useRef<ActionResult | null>(null);

    useEffect(() => {
        if (!state.message || lastState.current === state) {
            return;
        }

        lastState.current = state;

        if (state.ok) {
            toast.success(options?.successTitle ?? "Saved", {
                description: state.message,
            });
            return;
        }

        toast.error(options?.errorTitle ?? "Action failed", {
            description: state.message,
        });
    }, [state, options?.successTitle, options?.errorTitle]);
}
