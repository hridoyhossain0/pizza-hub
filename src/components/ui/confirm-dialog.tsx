"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    pending?: boolean;
    onConfirm: () => void;
}

/**
 * Reusable confirmation dialog. Replaces `window.confirm`, which is blocked in
 * some in-app browsers and cannot show a loading state.
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    pending = false,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialogPrimitive.Portal>
                <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
                    <AlertDialogPrimitive.Title className="text-lg font-extrabold text-foreground">
                        {title}
                    </AlertDialogPrimitive.Title>
                    <AlertDialogPrimitive.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                    </AlertDialogPrimitive.Description>

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <AlertDialogPrimitive.Cancel asChild>
                            <Button type="button" variant="outline" disabled={pending}>
                                {cancelLabel}
                            </Button>
                        </AlertDialogPrimitive.Cancel>

                        <Button
                            type="button"
                            variant={destructive ? "destructive" : "default"}
                            disabled={pending}
                            onClick={onConfirm}
                            className={
                                destructive
                                    ? undefined
                                    : "bg-orange-500 text-white hover:bg-orange-600"
                            }
                        >
                            {pending ? (
                                <Loader2 className="animate-spin" aria-hidden="true" />
                            ) : null}
                            {pending ? "Working..." : confirmLabel}
                        </Button>
                    </div>
                </AlertDialogPrimitive.Content>
            </AlertDialogPrimitive.Portal>
        </AlertDialogPrimitive.Root>
    );
}
