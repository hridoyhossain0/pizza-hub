"use client";

import { useActionState, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

import { FormMessage } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { saveVendorProfile } from "@/lib/actions/vendor";
import {
    EMPTY_ACTION,
    type VendorProfileView,
} from "@/lib/types/dashboard";

export function VendorProfileForm({
    profile,
}: {
    profile: VendorProfileView | null;
}) {
    const [state, formAction] = useActionState(
        saveVendorProfile,
        EMPTY_ACTION
    );
    const [preview, setPreview] = useState(profile?.image ?? "");

    return (
        <form
            action={formAction}
            encType="multipart/form-data"
            className="flex flex-col gap-5"
        >
            <FormMessage state={state} />

            <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label
                        htmlFor="restaurantName"
                        className="mb-2 block text-sm font-bold"
                    >
                        Restaurant name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="restaurantName"
                        name="restaurantName"
                        required
                        maxLength={80}
                        defaultValue={profile?.restaurantName}
                        placeholder="e.g. Pizza House"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="area"
                        className="mb-2 block text-sm font-bold"
                    >
                        Area <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="area"
                        name="area"
                        required
                        maxLength={60}
                        defaultValue={profile?.area}
                        placeholder="e.g. Dhanmondi"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-bold"
                    >
                        City <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="city"
                        name="city"
                        required
                        maxLength={60}
                        defaultValue={profile?.city}
                        placeholder="e.g. Dhaka"
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
                        maxLength={1000}
                        defaultValue={profile?.description}
                        placeholder="Tell customers what makes your restaurant special."
                        className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="image"
                        className="mb-2 block text-sm font-bold"
                    >
                        Restaurant logo{" "}
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    </label>

                    <div className="flex flex-col gap-4 rounded-xl border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center">
                        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Restaurant logo preview"
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
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="block w-full cursor-pointer rounded-lg border bg-background text-xs file:mr-3 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-orange-500 file:px-3 file:py-2.5 file:text-xs file:font-bold file:text-white"
                            />
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Upload className="size-3.5" />
                                Uploaded to ImgBB. JPG, PNG, WebP or GIF, max
                                5MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <SubmitButton
                    pendingText="Saving profile..."
                    className="bg-orange-500 text-white hover:bg-orange-600"
                >
                    {profile ? "Save profile" : "Create profile"}
                </SubmitButton>
            </div>
        </form>
    );
}
