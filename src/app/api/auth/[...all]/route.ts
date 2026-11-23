import { auth } from "@/lib/auth";
import { ensureMongoConnection } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

/**
 * Connect (or reconnect) before Better Auth touches MongoDB. A cold start
 * during a temporary Atlas/Vercel network failure can close the driver's
 * topology; `ensureMongoConnection` reopens it instead of returning 500s until
 * the next deployment.
 */
export async function GET(request: Request) {
    await ensureMongoConnection();
    return handlers.GET(request);
}

export async function POST(request: Request) {
    await ensureMongoConnection();
    return handlers.POST(request);
}
