import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ROLE_HOME } from "@/lib/roles";
import { requireUser } from "@/lib/session";
import { idFilter, usersCollection } from "@/lib/db";

export const instant = false;

export default async function DashboardPage() {
    const user = await requireUser();
    const cookieStore = await cookies();
    const pendingRole = cookieStore.get("pizza_pending_role")?.value;

    if (
        !user.roleConfigured &&
        user.role !== "admin" &&
        (pendingRole === "customer" || pendingRole === "vendor")
    ) {
        await usersCollection.updateOne(
            { _id: idFilter(user.id) },
            {
                $set: {
                    role: pendingRole,
                    roleConfigured: true,
                    isBlocked: false,
                    updatedAt: new Date(),
                },
            }
        );

        redirect(ROLE_HOME[pendingRole]);
    }

    redirect(ROLE_HOME[user.role]);
}
