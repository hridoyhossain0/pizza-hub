import { redirect } from "next/navigation";

import SignUpForm from "@/components/auth/sign-up-form";
import { ROLE_HOME } from "@/lib/roles";
import { getSessionUser } from "@/lib/session";

export const instant = false;

export default async function SignUpPage() {
    const user = await getSessionUser();

    if (user) {
        redirect(user.blocked ? "/blocked" : ROLE_HOME[user.role]);
    }

    return <SignUpForm />;
}
