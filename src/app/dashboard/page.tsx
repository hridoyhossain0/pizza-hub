import { redirect } from "next/navigation";

import { ROLE_HOME } from "@/lib/roles";
import { requireUser } from "@/lib/session";

export const instant = false;

export default async function DashboardPage() {
    const user = await requireUser();

    redirect(ROLE_HOME[user.role]);
}
