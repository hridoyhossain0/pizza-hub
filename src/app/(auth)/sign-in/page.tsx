
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Pizza,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    ShoppingBag,
    Store,
} from "lucide-react";

type UserRole = "customer" | "vendor" | "admin";

interface LoginResult {
    success: boolean;
    message?: string;
    user?: {
        role: UserRole;
    };
}

interface SignInPageProps {
    onLogin?: (
        email: string,
        password: string,
        rememberMe: boolean
    ) => Promise<LoginResult>;

    onGoogleLogin?: () => Promise<void>;
}

export default function SignInPage({
    onLogin,
    onGoogleLogin,
}: SignInPageProps) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Role-based redirect
    const redirectByRole = (role: UserRole) => {
        switch (role) {
            case "admin":
                router.replace("/admin/dashboard");
                break;

            case "vendor":
                router.replace("/vendor/dashboard");
                break;

            case "customer":
                router.replace("/dashboard");
                break;

            default:
                router.replace("/");
        }
    };

    // Email and password login
    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!onLogin) {
            setError("Login service is not configured.");
            return;
        }

        try {
            setLoading(true);

            const result = await onLogin(
                email.trim(),
                password,
                rememberMe
            );

            if (!result.success || !result.user) {
                setError(result.message || "Invalid email or password.");
                return;
            }

            setSuccess("Login successful! Welcome to PizzaHub.");

            redirectByRole(result.user.role);

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Google login
    const handleGoogleLogin = async () => {
        setError("");
        setSuccess("");

        if (!onGoogleLogin) {
            setError("Google authentication is not configured.");
            return;
        }

        try {
            setGoogleLoading(true);

            // OAuth provider should handle the final redirect
            await onGoogleLogin();

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Google login failed. Please try again."
            );

            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9F5] px-4 py-10 sm:px-6 lg:py-14">

            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-orange-100/60 lg:grid-cols-2">

                {/* LEFT BRANDING SECTION */}
                <div className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-[#171717] p-10 text-white lg:flex xl:p-14">

                    {/* Background effects */}
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

                    <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />

                    {/* Logo */}
                    <Link href="/" className="relative z-10 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
                            <Pizza size={30} />
                        </div>

                        <span className="text-3xl font-extrabold">
                            Pizza<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    {/* Main content */}
                    <div className="relative z-10 space-y-6">

                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
                            <ShieldCheck size={16} />
                            Secure Account Access
                        </span>

                        <h1 className="max-w-lg text-5xl font-extrabold leading-tight xl:text-6xl">
                            Welcome
                            <br />
                            <span className="text-orange-500">
                                Back!
                            </span>
                        </h1>

                        <p className="max-w-md text-base leading-8 text-gray-400">
                            Your favorite pizzas are just a few clicks away.
                            Sign in to discover delicious meals, manage your
                            orders, and enjoy the PizzaHub experience.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-5 pt-4">

                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                                    <ShoppingBag size={22} />
                                </div>

                                <div>
                                    <p className="font-semibold">Easy Ordering</p>
                                    <p className="text-sm text-gray-500">
                                        Your favorite meals, always accessible.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                                    <Store size={22} />
                                </div>

                                <div>
                                    <p className="font-semibold">Restaurant Management</p>
                                    <p className="text-sm text-gray-500">
                                        Manage your restaurant with ease.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10 border-t border-white/10 pt-6">
                        <p className="text-sm text-gray-500">
                            Freshly baked. Perfectly delivered.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIGN IN FORM */}
                <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-12 xl:p-14">

                    {/* Mobile logo */}
                    <Link
                        href="/"
                        className="mb-10 flex items-center gap-2 lg:hidden"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <Pizza size={24} />
                        </div>

                        <span className="text-2xl font-extrabold text-gray-900">
                            Pizza<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    {/* Heading */}
                    <div className="mb-8">
                        <span className="text-sm font-bold uppercase tracking-wider text-orange-500">
                            Welcome Back
                        </span>

                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Sign In
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Enter your account details to continue to PizzaHub.
                        </p>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                        >
                            <XCircle size={19} className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}
                    {success && (
                        <div
                            role="status"
                            className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                        >
                            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                            {success}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* EMAIL */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-gray-700"
                            >
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-bold text-gray-700"
                                >
                                    Password
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-orange-500 transition hover:text-orange-600 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="relative">
                                <LockKeyhole
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-orange-500"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* REMEMBER ME */}
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-orange-500"
                            />

                            <span className="text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                    </form>

                    {/* DIVIDER */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200" />

                        <span className="text-xs font-medium text-gray-400">
                            OR CONTINUE WITH
                        </span>

                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* GOOGLE LOGIN */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <Loader2 size={19} className="animate-spin" />
                        ) : (
                            <svg
                                viewBox="0 0 48 48"
                                className="h-5 w-5"
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

                    {/* SIGN UP LINK */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-bold text-orange-500 transition hover:text-orange-600"
                        >
                            Create Account
                        </Link>
                    </p>

                    {/* FOOTER NOTE */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <ShieldCheck size={15} className="text-green-500" />
                        Your account is protected with secure authentication.
                    </div>

                </div>
            </div>
        </div>
    );
}
