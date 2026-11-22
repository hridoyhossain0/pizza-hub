"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Check,
    Loader2,
    Pizza,
    ShoppingBag,
    Store,
} from "lucide-react";

import { setInitialRole } from "@/lib/actions/auth";
import { ROLE_HOME } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AccountRole = "customer" | "vendor";

const OPTIONS: Array<{
    value: AccountRole;
    label: string;
    description: string;
    icon: typeof ShoppingBag;
}> = [
    {
        value: "customer",
        label: "Customer",
        description: "Browse restaurants, order food and track deliveries.",
        icon: ShoppingBag,
    },
    {
        value: "vendor",
        label: "Vendor",
        description: "List your restaurant, publish a menu and handle orders.",
        icon: Store,
    },
];

/** Fallback chooser shown when the account type was not carried over. */
export function RolePicker({ name }: { name: string }) {
    const router = useRouter();
    const [role, setRole] = useState<AccountRole>("customer");
    const [saving, setSaving] = useState(false);

    const save = async () => {
        setSaving(true);

        const result = await setInitialRole(role);

        if (!result.ok) {
            toast.error("Could not save your account type", {
                description: result.message,
            });
            setSaving(false);
            return;
        }

        toast.success("Account ready", {
            description:
                role === "vendor"
                    ? "Set up your restaurant profile to start selling."
                    : "Start exploring the menu and place your first order.",
        });
        router.replace(ROLE_HOME[role]);
        router.refresh();
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4 py-14 dark:bg-neutral-950">
            <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-100/50 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40">
                <div className="flex items-center gap-2 text-orange-500">
                    <Pizza className="size-6" />
                    <span className="text-lg font-extrabold">
                        Pizza<span className="text-gray-900 dark:text-white">Hub</span>
                    </span>
                </div>

                <h1 className="mt-6 text-2xl font-extrabold">
                    Welcome, {name.split(" ")[0]}!
                </h1>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    One last step — how do you want to use PizzaHub? This choice
                    is permanent and can only be changed by an administrator.
                </p>

                <div className="mt-6 grid gap-3">
                    {OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const selected = role === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setRole(option.value)}
                                aria-pressed={selected}
                                className={cn(
                                    "flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition",
                                    selected
                                        ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                        : "border-gray-200 hover:border-orange-200 dark:border-white/15 dark:hover:border-orange-500/40"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                        selected
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"
                                    )}
                                >
                                    <Icon className="size-5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-bold">
                                            {option.label}
                                        </span>
                                        {selected ? (
                                            <Check className="size-4 text-orange-500" />
                                        ) : null}
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                        {option.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight className="size-4" />
                        </>
                    )}
                </button>
            </div>
        </main>
    );
}
