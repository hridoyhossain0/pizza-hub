"use client";

import { useActionState, useState } from "react";
import { ImagePlus, Upload, UserRound } from "lucide-react";

import { FormMessage } from "@/components/dashboard/form-message";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { saveAccountProfile } from "@/lib/actions/profile";
import { useActionToast } from "@/hooks/use-action-toast";
import { EMPTY_ACTION } from "@/lib/types/dashboard";

interface AccountProfileFormProps {
    user: {
        name: string;
        email: string;
        image: string | null;
    };
}

export function AccountProfileForm({ user }: AccountProfileFormProps) {
    const [state, formAction] = useActionState(
        saveAccountProfile,
        EMPTY_ACTION
    );
    useActionToast(state, {
        successTitle: "Profile saved",
        errorTitle: "Could not save profile",
    });
    const [preview, setPreview] = useState(user.image ?? "");
    const [removeImage, setRemoveImage] = useState(false);

    return (
        <form
            action={formAction}
            className="flex flex-col gap-5"
        >
            <FormMessage state={state} />

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-bold"
                    >
                        Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        minLength={2}
                        maxLength={80}
                        defaultValue={user.name}
                        placeholder="Your name"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        readOnly
                        disabled
                        className="h-11 w-full cursor-not-allowed rounded-xl border bg-muted px-3 text-sm text-muted-foreground outline-none"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                        Email addresses cannot be changed from your profile.
                    </p>
                </div>

                <div className="md:col-span-2">
                    <p className="mb-2 block text-sm font-bold">
                        Profile image{" "}
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    </p>

                    <div className="flex flex-col gap-4 rounded-xl border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center">
                        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <UserRound className="size-7 text-muted-foreground" />
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
                                        setRemoveImage(false);
                                    }
                                }}
                                className="block w-full cursor-pointer rounded-lg border bg-background text-xs file:mr-3 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-orange-500 file:px-3 file:py-2.5 file:text-xs file:font-bold file:text-white"
                            />
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Upload className="size-3.5" />
                                JPG, PNG, WebP or GIF, max 5MB.
                            </p>

                            {user.image ? (
                                <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        name="removeImage"
                                        checked={removeImage}
                                        onChange={(event) => {
                                            setRemoveImage(
                                                event.target.checked
                                            );

                                            if (event.target.checked) {
                                                setPreview("");
                                            } else {
                                                setPreview(user.image ?? "");
                                            }
                                        }}
                                        className="size-4 rounded border"
                                    />
                                    Remove my current profile image
                                </label>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <SubmitButton pendingText="Saving profile...">
                    Save profile
                </SubmitButton>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ImagePlus className="size-3.5" />
                    Your role and subscription cannot be changed here.
                </span>
            </div>
        </form>
    );
}
