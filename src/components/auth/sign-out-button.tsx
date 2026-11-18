"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const handleSignOut = async () => {
        setPending(true);

        try {
            await authClient.signOut();
        } finally {
            router.replace("/sign-in");
            router.refresh();
            setPending(false);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleSignOut}
            disabled={pending}
            size="lg"
            className="bg-orange-500 text-white hover:bg-orange-600"
        >
            {pending ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
                <LogOut aria-hidden="true" />
            )}
            {pending ? "Signing out..." : "Sign out"}
        </Button>
    );
}
