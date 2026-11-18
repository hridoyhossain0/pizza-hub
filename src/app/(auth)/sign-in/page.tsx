import { redirect } from "next/navigation";

import SignInForm from "@/components/auth/sign-in-form";
import { ROLE_HOME } from "@/lib/roles";
import { getSessionUser } from "@/lib/session";

export const instant = false;

function safeCallback(value: string | undefined) {
    if (!value || !value.startsWith("/") || value.startsWith("//")) {
        return null;
    }

    return value;
}

export default async function SignInPage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl?: string }>;
}) {
    const user = await getSessionUser();

    if (user) {
        redirect(user.blocked ? "/blocked" : ROLE_HOME[user.role]);
    }

    const params = await searchParams;

    return <SignInForm callbackUrl={safeCallback(params.callbackUrl)} />;
}
