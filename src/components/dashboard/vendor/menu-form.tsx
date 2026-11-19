"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { ImagePlus, Upload } from "lucide-react";

import { FormMessage } from "@/components/dashboard/form-message";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import {
    createMenuItem,
    updateMenuItem,
} from "@/lib/actions/menu";
import {
    EMPTY_ACTION,
    MENU_CATEGORIES,
    type MenuStatus,
} from "@/lib/types/dashboard";

interface MenuFormValues {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    location: string;
    image: string;
    status: MenuStatus;
}

interface MenuFormProps {
    mode: "create" | "edit";
    item?: MenuFormValues;
}

export function MenuItemForm({ mode, item }: MenuFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [preview, setPreview] = useState(item?.image ?? "");
    const [state, formAction] = useActionState(
        mode === "create" ? createMenuItem : updateMenuItem,
        EMPTY_ACTION
    );

    const categories = item?.category
        ? [...new Set([...MENU_CATEGORIES, item.category])]
        : [...MENU_CATEGORIES];

    return (
        <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-5"
        >
            {mode === "edit" && item ? (
                <input type="hidden" name="itemId" value={item._id} />
            ) : null}

            <FormMessage state={state} />

            {mode === "edit" && item?.status === "rejected" ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    This item was rejected by an administrator. It is hidden
                    from customers. Update the details and ask the admin to
                    review it again.
                </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-bold"
                    >
                        Item name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        defaultValue={item?.name}
                        maxLength={80}
                        placeholder="e.g. Chicken Cheese Pizza"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-bold"
                    >
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        required
                        defaultValue={item?.category ?? "Pizza"}
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="price"
                        className="mb-2 block text-sm font-bold"
                    >
                        Price (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        defaultValue={item?.price}
                        placeholder="450"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-bold"
                    >
                        Location (area / city){" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="location"
                        name="location"
                        required
                        defaultValue={item?.location}
                        maxLength={120}
                        placeholder="e.g. Dhanmondi, Dhaka"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-bold"
                    >
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        defaultValue={item?.description}
                        maxLength={1000}
                        placeholder="Describe the ingredients, taste and portion size."
                        className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="image"
                        className="mb-2 block text-sm font-bold"
                    >
                        Item image{" "}
                        {mode === "create" ? (
                            <span className="text-red-500">*</span>
                        ) : (
                            <span className="text-muted-foreground">
                                (optional replacement)
                            </span>
                        )}
                    </label>

                    <div className="flex flex-col gap-4 rounded-xl border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center">
                        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Menu item preview"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <ImagePlus className="size-7 text-muted-foreground" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                required={mode === "create"}
                                onChange={(event) => {
                                    const file =
                                        event.target.files?.[0];
                                    if (file) {
                                        setPreview(
                                            URL.createObjectURL(file)
                                        );
                                    }
                                }}
                                className="block w-full cursor-pointer rounded-lg border bg-background text-xs file:mr-3 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-orange-500 file:px-3 file:py-2.5 file:text-xs file:font-bold file:text-white"
                            />
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Upload className="size-3.5" />
                                JPG, PNG, WebP or GIF, max 5MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {mode === "edit" && item ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Current approval status:
                    <StatusBadge status={item.status} />
                </div>
            ) : (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    New items are submitted as <strong>Pending</strong> and stay
                    hidden from customers until an administrator approves them.
                </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <SubmitButton
                    pendingText={
                        mode === "create"
                            ? "Uploading & saving..."
                            : "Saving changes..."
                    }
                    className="bg-orange-500 text-white hover:bg-orange-600"
                >
                    {mode === "create" ? "Submit for approval" : "Save changes"}
                </SubmitButton>

                <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard/vendor/menu">
                        Back to my menu
                    </Link>
                </Button>
            </div>
        </form>
    );
}
