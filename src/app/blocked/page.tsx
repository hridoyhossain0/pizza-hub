import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ROLE_HOME } from "@/lib/roles";
import { getSessionUser } from "@/lib/session";

export const instant = false;

export default async function BlockedPage() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.blocked) {
        redirect(ROLE_HOME[user.role]);
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-4 py-16">
            <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-100/40">
                <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <ShieldAlert className="size-8" />
                </span>

                <h1 className="mt-6 text-2xl font-extrabold">
                    Account blocked
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    Your PizzaHub account has been blocked by an administrator,
                    so protected features such as ordering and dashboard access
                    are unavailable. If you believe this is a mistake, please
                    contact support.
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <SignOutButton />
                    <Link
                        href="/"
                        className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition hover:bg-muted"
                    >
                        Back to store
                    </Link>
                </div>
            </div>
        </main>
    );
}
