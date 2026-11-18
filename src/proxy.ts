import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic authentication check for dashboard routes.
 *
 * This only checks that a session cookie is present so unauthenticated
 * visitors are redirected before rendering starts. The authoritative check
 * still happens on the server in `requireUser`/`requireRole`, which validates
 * the session against the database and enforces role access.
 */
export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set(
            "callbackUrl",
            `${request.nextUrl.pathname}${request.nextUrl.search}`
        );

        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
