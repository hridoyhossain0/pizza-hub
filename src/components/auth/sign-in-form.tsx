"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    Pizza,
    ShieldCheck,
    ShoppingBag,
    Store,
    XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/api-client";
import { toast } from "sonner";

export default function SignInForm({
    callbackUrl,
}: {
    callbackUrl: string | null;
}) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const fail = (message: string) => {
        setError(message);
        toast.error("Sign in failed", { description: message });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            fail("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const { error: authError } = await authClient.signIn.email({
                email: email.trim(),
                password,
                rememberMe,
            });

            if (authError) {
                fail(authError.message || "Invalid email or password.");
                return;
            }

            toast.success("Welcome back", {
                description: "You are signed in.",
            });
            clearAccessToken();
            router.replace(callbackUrl || "/dashboard");
            router.refresh();
        } catch (signInError) {
            fail(
                signInError instanceof Error
                    ? signInError.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setGoogleLoading(true);

        try {
            const { error: authError } = await authClient.signIn.social({
                provider: "google",
                callbackURL: callbackUrl || "/dashboard",
            });

            if (authError) {
                fail(authError.message || "Google sign-in is not available.");
                setGoogleLoading(false);
            }
        } catch {
            fail("Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    };

    const busy = loading || googleLoading;

    return (
        <div className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 lg:py-14">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-100/50 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40 lg:grid-cols-2">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[#171717] p-10 text-white lg:flex">
                    <div className="absolute -right-24 -top-24 size-80 rounded-full bg-orange-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-orange-600/20 blur-3xl" />

                    <Link
                        href="/"
                        className="relative z-10 flex items-center gap-3"
                    >
                        <span className="flex size-11 items-center justify-center rounded-xl bg-orange-500">
                            <Pizza className="size-6" />
                        </span>
                        <span className="text-2xl font-extrabold">
                            Pizza<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    <div className="relative z-10 space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
                            <ShieldCheck className="size-4" />
                            Secure account access
                        </span>
                        <h1 className="text-4xl font-extrabold leading-tight">
                            Welcome
                            <br />
                            <span className="text-orange-500">back!</span>
                        </h1>
                        <p className="max-w-sm text-sm leading-7 text-gray-400">
                            Sign in to place orders, manage your restaurant, or
                            oversee the PizzaHub marketplace.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                                    <ShoppingBag className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Order in seconds
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Browse the menu and track every order.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                                    <Store className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Grow your restaurant
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Manage menus, orders and subscriptions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 border-t border-white/10 pt-5 text-xs text-gray-500">
                        Freshly baked. Perfectly delivered.
                    </p>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-2 lg:hidden"
                    >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <Pizza className="size-5" />
                        </span>
                        <span className="text-2xl font-extrabold">
                            Pizza<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                        Welcome back
                    </span>
                    <h2 className="mt-2 text-3xl font-extrabold">Sign in</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your account details to continue.
                    </p>

                    {error ? (
                        <div
                            role="alert"
                            className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            <XCircle className="mt-0.5 size-4 shrink-0" />
                            {error}
                        </div>
                    ) : null}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-neutral-950 dark:focus:ring-orange-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-bold"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-orange-500 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-10 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-neutral-950 dark:focus:ring-orange-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-orange-500"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(event.target.checked)
                                }
                                className="size-4 accent-orange-500"
                            />
                            Remember me
                        </label>

                        <button
                            type="submit"
                            disabled={busy}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[11px] font-semibold text-gray-400">
                            OR CONTINUE WITH
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={busy}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-bold transition hover:border-orange-300 hover:bg-orange-200 hover:text-black disabled:opacity-60"
                    >
                        {googleLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <svg
                                viewBox="0 0 48 48"
                                className="size-5"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.7 6.1-14.7Z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 1.9-7 1.9-5.4 0-10-3.6-11.6-8.4H5.7v5.2A20 20 0 0 0 24 44Z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M12.4 27.7a12 12 0 0 1 0-7.5V15H5.7a20 20 0 0 0 0 17.9l6.7-5.2Z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.7 15l6.7 5.2C14 15.6 18.6 12 24 12Z"
                                />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <p className="mt-7 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={
                                callbackUrl
                                    ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
                                    : "/sign-up"
                            }
                            className="font-bold text-orange-500 hover:text-orange-600"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
