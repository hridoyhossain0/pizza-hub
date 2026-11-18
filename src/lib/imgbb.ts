import "server-only";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface ImgBbResponse {
    success?: boolean;
    data?: {
        url?: string;
        display_url?: string;
    };
    error?: {
        message?: string;
    };
}

/**
 * Uploads an image to ImgBB and returns the public URL.
 *
 * The API key is only ever read on the server. If it is missing the caller
 * gets a clear, user-facing message instead of a silent failure.
 */
export async function uploadImageToImgBb(file: File): Promise<string> {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Image uploads are not configured yet. Add IMGBB_API_KEY to the .env file and restart the server."
        );
    }

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

    const body = new FormData();
    body.set("image", buffer.toString("base64"));
    body.set("name", file.name.replace(/\.[^.]+$/, "") || "pizzahub-image");

    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
        { method: "POST", body }
    );

    const payload = (await response.json().catch(() => null)) as
        | ImgBbResponse
        | null;

    if (!response.ok || !payload?.success || !payload.data?.url) {
        throw new Error(
            payload?.error?.message ||
                "The image could not be uploaded. Please try again."
        );
    }

    return payload.data.url;
}

/** Returns the file stored in a FormData entry, or null when none was sent. */
export function getImageFile(formData: FormData, field: string): File | null {
    const value = formData.get(field);

    if (!(value instanceof File) || value.size === 0) {
        return null;
    }

    return value;
}
