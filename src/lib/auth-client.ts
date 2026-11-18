import { createAuthClient } from "better-auth/react";

/**
 * Same-origin client: the auth API is served by this Next.js app, so no
 * explicit base URL is needed (and an undefined server-only env var would
 * otherwise be baked into the browser bundle).
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
