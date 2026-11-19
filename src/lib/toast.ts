"use client";

import { toast } from "sonner";

import type { ActionResult } from "@/lib/types/dashboard";

/**
 * Shows a toast for a server action result.
 *
 * Used by components that run actions inside `useTransition`; forms driven by
 * `useActionState` can use `useActionToast` instead.
 */
export function notifyResult(
    result: ActionResult,
    options?: { successTitle?: string; errorTitle?: string }
) {
    if (!result.message) {
        return;
    }

    if (result.ok) {
        toast.success(options?.successTitle ?? "Done", {
            description: result.message,
        });
        return;
    }

    toast.error(options?.errorTitle ?? "Something went wrong", {
        description: result.message,
    });
}
