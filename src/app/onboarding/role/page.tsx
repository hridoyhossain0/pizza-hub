import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RolePicker } from "@/components/auth/role-picker";
import { setInitialRole } from "@/lib/actions/auth";
import { ROLE_HOME } from "@/lib/roles";
import { getSessionUser } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = {
    title: "Choose your account type",
    description:
        "Finish setting up your PizzaHub account by choosing whether you want to order food or sell it.",
};

/**
 * One-time onboarding step used by the Google sign-up flow.
 *
 * The account type selected before leaving for Google travels in `?role=`.
 * It is applied server-side through `setInitialRole`, which refuses to change
 * an account that is already configured and never allows the admin role.
 */
export default async function OnboardingRolePage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string }>;
}) {
    const user = await getSessionUser();

    if (!user) {
        const params = await searchParams;
        const callbackUrl = `/onboarding/role${
            params.role ? `?role=${encodeURIComponent(params.role)}` : ""
        }`;

        redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    if (user.blocked) {
        redirect("/blocked");
    }

    // Already onboarded (or an administrator) — no second chance to switch.
    if (user.roleConfigured || user.role === "admin") {
        redirect(ROLE_HOME[user.role]);
    }

    const params = await searchParams;

    if (params.role === "customer" || params.role === "vendor") {
        const result = await setInitialRole(params.role);

        if (result.ok) {
            redirect(ROLE_HOME[params.role]);
        }
    }

    return <RolePicker name={user.name} />;
}
