import "server-only";

import { headers } from "next/headers";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7000"
).replace(/\/$/, "");

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface UploadResponse {
    url?: string;
    message?: string;
}

/**
 * Uploads an image through the authenticated Express API and returns the
 * public URL. Images are stored in MongoDB by `pizza-hub-server`, so no
 * third-party image host or API key is required.
 */
export async function uploadImage(file: File): Promise<string> {
    if (!file || typeof file === "string" || file.size === 0) {
        throw new Error("Please choose an image file to upload.");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Only image files (JPG, PNG, WebP, GIF) are allowed.");
    }

    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error("Image size must be 5MB or smaller.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Forward the Better Auth cookie so the API can identify the user.
    const cookie = (await headers()).get("cookie") ?? "";

    let response: Response;

    try {
        response = await fetch(`${API_URL}/api/uploads`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookie ? { cookie } : {}),
            },
            body: JSON.stringify({
                filename: file.name,
                contentType: file.type,
                data: buffer.toString("base64"),
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(15000),
        });
    } catch {
        throw new Error(
            "The image service is unreachable. Make sure pizza-hub-server is running and try again."
        );
    }

    const payload = (await response.json().catch(() => null)) as
        | UploadResponse
        | null;

    if (!response.ok || !payload?.url) {
        throw new Error(
            payload?.message ||
                "The image could not be uploaded. Please try again."
        );
    }

    return payload.url;
}

/** Returns the file stored in a FormData entry, or null when none was sent. */
export function getImageFile(formData: FormData, field: string): File | null {
    const value = formData.get(field);

    if (!(value instanceof File) || value.size === 0) {
        return null;
    }

    return value;
}
