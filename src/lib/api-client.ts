"use client";

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7000"
).replace(/\/$/, "");

interface CachedToken {
    token: string;
    expiresAt: number;
}

let cached: CachedToken | null = null;
let inFlight: Promise<string | null> | null = null;

async function requestToken(force = false): Promise<string | null> {
    if (!force && cached && cached.expiresAt > Date.now()) {
        return cached.token;
    }

    if (!force && inFlight) {
        return inFlight;
    }

    const load = (async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/token`, {
                method: "POST",
                credentials: "include",
                cache: "no-store",
            });

            if (!response.ok) {
                cached = null;
                return null;
            }

            const data = (await response.json()) as {
                token?: string;
                expiresIn?: number;
            };

            if (!data.token) {
                cached = null;
                return null;
            }

            const lifetime = Number(data.expiresIn ?? 3600);

            cached = {
                token: data.token,
                // Refresh a minute early so a request never carries a token
                // that expires between the client and the API.
                expiresAt: Date.now() + Math.max(lifetime - 60, 30) * 1000,
            };

            return data.token;
        } catch {
            cached = null;
            return null;
        } finally {
            inFlight = null;
        }
    })();

    inFlight = load;

    return load;
}

/** Returns a short-lived JWT for the current Better Auth session. */
export async function getAccessToken(force = false): Promise<string | null> {
    return requestToken(force);
}

/** Clears the in-memory token cache (call after sign-in/sign-out). */
export function clearAccessToken() {
    cached = null;
    inFlight = null;
}

/**
 * Calls a JWT-protected Express endpoint.
 *
 * The browser never sends a user id or role; the API derives both from the
 * verified token. A 401 triggers one forced token refresh before failing.
 */
export async function apiFetch<T = unknown>(
    path: string,
    init: RequestInit = {}
): Promise<{ response: Response; data: T | null }> {
    const url = path.startsWith("http")
        ? path
        : `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

    const send = async (token: string | null) => {
        const headers = new Headers(init.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        if (init.body && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        return fetch(url, {
            ...init,
            headers,
            credentials: "include",
            cache: "no-store",
        });
    };

    let response = await send(await getAccessToken());

    if (response.status === 401) {
        response = await send(await getAccessToken(true));
    }

    let data: T | null = null;

    try {
        data = (await response.json()) as T;
    } catch {
        data = null;
    }

    return { response, data };
}
