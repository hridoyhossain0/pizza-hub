import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session";
import { ROLE_HOME } from "@/lib/roles";

export const instant = false;

/**
 * Friendly alias used by the footer. Signed-in customers land on their order
 * history; everyone else is sent to sign in and returned here afterwards.
 */
export default async function MyOrdersPage() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/sign-in?callbackUrl=%2Fmy-orders");
    }

    if (user.blocked) {
        redirect("/blocked");
    }

    if (user.role === "customer") {
        redirect("/dashboard/customer/orders");
    }

    redirect(ROLE_HOME[user.role]);
}
