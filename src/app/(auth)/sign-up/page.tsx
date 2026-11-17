
"use client";

import {
    useState,
    useRef,
    useEffect,
    ChangeEvent,
    FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Pizza,
    UserRound,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    Camera,
    Store,
    ShoppingBag,
    Check,
    X,
    ArrowRight,
    Loader2,
    ImagePlus,
    ShieldCheck,
    Sparkles,
    Utensils,
} from "lucide-react";

type AccountRole = "customer" | "vendor";

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: AccountRole;
    image?: File;
}

interface RegisterResult {
    success: boolean;
    message?: string;
}

interface SignUpPageProps {
    onRegister?: (data: RegisterData) => Promise<RegisterResult>;
    onGoogleSignUp?: (role: AccountRole) => Promise<void>;
}

export default function SignUpPage({
    onRegister,
    onGoogleSignUp,
}: SignUpPageProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<AccountRole>("customer");

    const [image, setImage] = useState<File | undefined>();
    const [preview, setPreview] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const passwordRules = [
        {
            label: "At least 6 characters",
            valid: password.length >= 6,
        },
        {
            label: "One uppercase letter",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "One lowercase letter",
            valid: /[a-z]/.test(password),
        },
    ];

    const isPasswordValid = passwordRules.every(
        (rule) => rule.valid
    );

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Image size must be less than 2MB.");
            event.target.value = "";
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(undefined);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!isPasswordValid) {
            setError("Please meet all password requirements.");
            return;
        }

        if (!onRegister) {
            setError("Registration service is not configured.");
            return;
        }

        try {
            setLoading(true);

            const result = await onRegister({
                name: name.trim(),
                email: email.trim(),
                password,
                role,
                image,
            });

            if (!result.success) {
                setError(result.message || "Registration failed.");
                return;
            }

            setSuccess("Account created successfully! Redirecting...");

            router.replace(
                role === "vendor"
                    ? "/vendor/dashboard"
                    : "/dashboard"
            );
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

    const handleGoogleSignUp = async () => {
        setError("");
        setSuccess("");

        if (!onGoogleSignUp) {
            setError("Google authentication is not configured.");
            return;
        }

        try {
            setGoogleLoading(true);
            await onGoogleSignUp(role);
        } catch {
            setError("Google sign-up failed. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-gray-50/80 py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10";

    return (
        <main className="min-h-screen bg-[#FFF8F3] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">

            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-orange-100/70 bg-white shadow-[0_25px_80px_-25px_rgba(234,88,12,0.18)] lg:grid-cols-[0.9fr_1.1fr]">

                {/* BRAND PANEL */}
                <section className="relative hidden min-h-[850px] flex-col justify-between overflow-hidden bg-[#171717] p-10 text-white lg:flex xl:p-14">

                    <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-[100px]" />
                    <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-600/20 blur-[100px]" />

                    <Link href="/" className="relative z-10 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30">
                            <Pizza size={29} />
                        </div>

                        <span className="text-3xl font-black tracking-tight">
                            Pizza<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    <div className="relative z-10 space-y-8">

                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
                            <Sparkles size={16} />
                            Your delicious journey begins
                        </div>

                        <div className="space-y-5">
                            <h1 className="max-w-lg text-5xl font-black leading-[1.15] tracking-tight xl:text-6xl">
                                Good food.
                                <br />
                                Great moments.
                                <br />
                                <span className="text-orange-500">
                                    Made for you.
                                </span>
                            </h1>

                            <p className="max-w-md text-base leading-8 text-gray-400">
                                Discover delicious pizzas, explore amazing
                                flavors, and enjoy a better food ordering
                                experience with PizzaHub.
                            </p>
                        </div>

                        <div className="space-y-5 pt-3">
                            {[
                                "Explore delicious pizzas and exclusive deals",
                                "Order your favorite meals with ease",
                                "Grow your restaurant business with us",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                                        <Check size={16} />
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                                <Utensils size={23} />
                            </div>
                            <div>
                                <p className="font-bold text-white">
                                    Freshly baked, always delicious.
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Your next favorite pizza awaits.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 border-t border-white/10 pt-6">
                        <p className="text-xs text-gray-500">
                            © 2026 PizzaHub. Made for pizza lovers.
                        </p>
                    </div>
                </section>

                {/* FORM PANEL */}
                <section className="flex flex-col justify-center p-5 sm:p-9 lg:p-10 xl:p-14">

                    {/* MOBILE BRAND */}
                    <div className="mb-8 flex items-center justify-between lg:hidden">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                                <Pizza size={24} />
                            </div>

                            <span className="text-2xl font-black text-gray-900">
                                Pizza<span className="text-orange-500">Hub</span>
                            </span>
                        </Link>

                        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                            Join Us
                        </span>
                    </div>

                    {/* HEADING */}
                    <div className="mb-7">
                        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-500">
                            Get Started
                        </span>

                        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            Create Account
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Join PizzaHub and enjoy something delicious.
                        </p>
                    </div>

                    {/* ALERTS */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                        >
                            <X size={18} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                        >
                            <Check size={18} className="mt-0.5 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* PROFILE IMAGE */}
                        <div>
                            <label className="mb-3 block text-sm font-bold text-gray-700">
                                Profile Photo
                                <span className="ml-2 font-normal text-gray-400">
                                    (Optional)
                                </span>
                            </label>

                            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-4">

                                <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-white">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Profile preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <ImagePlus
                                            size={28}
                                            className="text-orange-400"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:border-orange-300 hover:text-orange-600"
                                    >
                                        <Camera size={15} />
                                        Upload Photo
                                    </button>

                                    <p className="text-xs text-gray-400">
                                        JPG, PNG or WebP · Maximum 2MB
                                    </p>

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="block text-xs font-bold text-red-500 hover:underline"
                                        >
                                            Remove photo
                                        </button>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* NAME */}
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-bold text-gray-700">
                                Full Name
                            </label>

                            <div className="relative">
                                <UserRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-700">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`${inputClass} pr-12`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-orange-500"
                                >
                                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {passwordRules.map((rule) => (
                                    <div
                                        key={rule.label}
                                        className={`flex items-center gap-2 text-xs ${rule.valid && password
                                                ? "font-semibold text-green-600"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        <Check size={14} className={rule.valid && password ? "text-green-600" : "text-gray-300"} />
                                        {rule.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ROLE */}
                        <div>
                            <label className="mb-3 block text-sm font-bold text-gray-700">
                                Choose Account Type
                            </label>

                            <div className="grid grid-cols-2 gap-3">

                                <button
                                    type="button"
                                    onClick={() => setRole("customer")}
                                    aria-pressed={role === "customer"}
                                    className={`group rounded-2xl border-2 p-4 text-left transition-all duration-200 ${role === "customer"
                                            ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                                            : "border-gray-200 bg-white hover:border-orange-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${role === "customer"
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <ShoppingBag size={21} />
                                        </div>

                                        {role === "customer" && (
                                            <Check size={18} className="text-orange-500" />
                                        )}
                                    </div>

                                    <p className="mt-3 text-sm font-extrabold text-gray-800">
                                        Customer
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Order delicious pizzas.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole("vendor")}
                                    aria-pressed={role === "vendor"}
                                    className={`group rounded-2xl border-2 p-4 text-left transition-all duration-200 ${role === "vendor"
                                            ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                                            : "border-gray-200 bg-white hover:border-orange-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${role === "vendor"
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Store size={21} />
                                        </div>

                                        {role === "vendor" && (
                                            <Check size={18} className="text-orange-500" />
                                        )}
                                    </div>

                                    <p className="mt-3 text-sm font-extrabold text-gray-800">
                                        Vendor
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Restaurant owner.
                                    </p>
                                </button>

                            </div>
                        </div>

                        {/* SECURITY */}
                        <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50/70 p-3.5">
                            <ShieldCheck size={19} className="mt-0.5 shrink-0 text-green-600" />

                            <p className="text-xs leading-5 text-gray-600">
                                Your account information is protected.
                                Administrator access is assigned separately
                                by authorized administrators.
                            </p>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading || googleLoading || !isPasswordValid}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-[11px] font-bold tracking-wider text-gray-400">
                            OR CONTINUE WITH
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* GOOGLE */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading || googleLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <Loader2 size={19} className="animate-spin" />
                        ) : (
                            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.7 6.1-14.7Z" />
                                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 1.9-7 1.9-5.4 0-10-3.6-11.6-8.4H5.7v5.2A20 20 0 0 0 24 44Z" />
                                <path fill="#FBBC05" d="M12.4 27.7a12 12 0 0 1 0-7.5V15H5.7a20 20 0 0 0 0 17.9l6.7-5.2Z" />
                                <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.7 15l6.7 5.2C14 15.6 18.6 12 24 12Z" />
                            </svg>
                        )}

                        Continue with Google
                    </button>

                    {/* SIGN IN */}
                    <p className="mt-7 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-extrabold text-orange-500 transition hover:text-orange-600"
                        >
                            Sign In
                        </Link>
                    </p>

                    {/* TERMS */}
                    <p className="mt-5 text-center text-xs leading-6 text-gray-400">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="font-bold text-orange-500 hover:underline">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" className="font-bold text-orange-500 hover:underline">
                            Privacy Policy
                        </Link>.
                    </p>

                </section>
            </div>
        </main>
    );
}
