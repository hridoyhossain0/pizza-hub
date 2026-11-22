import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Same-origin token exchange.
 *
 * The Better Auth session cookie is `SameSite=Lax`, so the browser cannot send
 * it to a different site (the Express API host). This route runs on the
 * frontend origin, forwards the cookie server-to-server, and returns the
 * short-lived JWT. The browser only ever talks to its own origin.
 */
const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7000"
).replace(/\/$/, "");

export async function POST() {
    const cookie = (await headers()).get("cookie") ?? "";

    try {
        const response = await fetch(`${API_URL}/api/auth/token`, {
            method: "POST",
            headers: cookie ? { cookie } : undefined,
            cache: "no-store",
            signal: AbortSignal.timeout(12000),
        });

        const text = await response.text();

        return new NextResponse(text, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") ?? "application/json",
                "Cache-Control": "no-store",
            },
        });
    } catch {
        return NextResponse.json(
            { message: "The authentication service is unreachable." },
            { status: 502 }
        );
    }
}
