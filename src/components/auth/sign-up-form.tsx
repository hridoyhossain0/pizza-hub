"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    Pizza,
    ShieldCheck,
    ShoppingBag,
    Store,
    UserRound,
    X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { setInitialRole } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type AccountRole = "customer" | "vendor";

export default function SignUpForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<AccountRole>("customer");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const rules = [
        { label: "At least 6 characters", valid: password.length >= 6 },
        { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    ];
    const passwordValid = rules.every((rule) => rule.valid);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!passwordValid) {
            setError("Please meet all password requirements.");
            return;
        }

        if (password !== confirmPassword) {
            setError("The passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const { error: authError } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (authError) {
                setError(
                    authError.message || "Registration failed. Please try again."
                );
                return;
            }

            const roleResult = await setInitialRole(role);

            if (!roleResult.ok) {
                setError(roleResult.message);
                return;
            }

            router.replace("/dashboard");
            router.refresh();
        } catch (signUpError) {
            setError(
                signUpError instanceof Error
                    ? signUpError.message
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
                callbackURL: "/dashboard",
            });

            if (authError) {
                setError(
                    authError.message || "Google sign-up is not available."
                );
                setGoogleLoading(false);
            }
        } catch {
            setError("Google sign-up failed. Please try again.");
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
                            Join PizzaHub
                        </span>
                        <h1 className="text-4xl font-extrabold leading-tight">
                            Good food.
                            <br />
                            <span className="text-orange-500">
                                Great moments.
                            </span>
                        </h1>
                        <p className="max-w-sm text-sm leading-7 text-gray-400">
                            Order from trusted restaurants or start selling
                            your own dishes to hungry customers.
                        </p>

                        <div className="space-y-3 pt-2">
                            {[
                                "Browse approved menu items",
                                "Place and track orders",
                                "Grow your restaurant with Premium",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-gray-300"
                                >
                                    <span className="flex size-6 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                                        <Check className="size-3.5" />
                                    </span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 border-t border-white/10 pt-5 text-xs text-gray-500">
                        © 2026 PizzaHub. Made for pizza lovers.
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
                        Get started
                    </span>
                    <h2 className="mt-2 text-3xl font-extrabold">
                        Create account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Choose how you want to use PizzaHub.
                    </p>

                    {error ? (
                        <div
                            role="alert"
                            className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            <X className="mt-0.5 size-4 shrink-0" />
                            {error}
                        </div>
                    ) : null}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-bold">
                                Account type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {(
                                    [
                                        {
                                            value: "customer",
                                            label: "Customer",
                                            description: "Order food",
                                            icon: ShoppingBag,
                                        },
                                        {
                                            value: "vendor",
                                            label: "Vendor",
                                            description: "Sell food",
                                            icon: Store,
                                        },
                                    ] as const
                                ).map((option) => {
                                    const Icon = option.icon;
                                    const selected = role === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setRole(option.value)
                                            }
                                            aria-pressed={selected}
                                            className={cn(
                                                "rounded-xl border-2 p-3 text-left transition",
                                                selected
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-orange-200 dark:border-white/15 dark:hover:border-orange-500/40"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={cn(
                                                        "flex size-8 items-center justify-center rounded-lg",
                                                        selected
                                                            ? "bg-orange-500 text-white"
                                                            : "bg-gray-100 text-gray-500"
                                                    )}
                                                >
                                                    <Icon className="size-4" />
                                                </span>
                                                {selected ? (
                                                    <Check className="size-4 text-orange-500" />
                                                ) : null}
                                            </div>
                                            <p className="mt-2 text-sm font-bold">
                                                {option.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {option.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-bold"
                            >
                                Full name
                            </label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    className="h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-neutral-950 dark:focus:ring-orange-500/20"
                                />
                            </div>
                        </div>

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

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-bold"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Create password"
                                        className="h-11 w-full rounded-xl border bg-gray-50 pl-10 pr-9 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-neutral-950 dark:focus:ring-orange-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (value) => !value
                                            )
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

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-bold"
                                >
                                    Confirm password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Repeat password"
                                    className="h-11 w-full rounded-xl border bg-gray-50 px-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-neutral-950 dark:focus:ring-orange-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            {rules.map((rule) => (
                                <div
                                    key={rule.label}
                                    className={cn(
                                        "flex items-center gap-2 text-xs",
                                        rule.valid && password
                                            ? "font-semibold text-emerald-600"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "size-3.5",
                                            rule.valid && password
                                                ? "text-emerald-600"
                                                : "text-gray-300"
                                        )}
                                    />
                                    {rule.label}
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={busy || !passwordValid}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={busy}
                        className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-bold transition hover:border-orange-300 hover:bg-orange-50 disabled:opacity-60"
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

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-bold text-orange-500 hover:text-orange-600"
                        >
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-5 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                        Administrator accounts are assigned separately by an
                        existing administrator.
                    </div>
                </div>
            </div>
        </div>
    );
}
