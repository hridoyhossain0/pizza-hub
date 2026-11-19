"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

/**
 * App Router error boundary. Shows a friendly message instead of a blank
 * screen and lets the user retry the failed segment without a full reload.
 */
export default function ErrorPage({
    error,
    retry,
}: {
    error: unknown;
    retry: () => void;
}) {
    useEffect(() => {
        console.error("Unhandled application error", error);
    }, [error]);

    const digest =
        error instanceof Error && "digest" in error
            ? String((error as Error & { digest?: string }).digest ?? "")
            : "";

    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-4 py-16 dark:bg-neutral-950">
            <div className="w-full max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-12">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                    <AlertTriangle className="size-8" aria-hidden="true" />
                </div>

                <h1 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    We could not load this page. Your data is safe — please try
                    again. If the problem continues, contact our support team.
                </p>

                {digest ? (
                    <p className="mt-4 rounded-lg bg-gray-100 px-3 py-2 font-mono text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400">
                        Error reference: {digest}
                    </p>
                ) : null}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => retry()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                        <RotateCcw size={18} aria-hidden="true" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-white/5"
                    >
                        <Home size={18} aria-hidden="true" />
                        Back to home
                    </Link>
                </div>
            </div>
        </section>
    );
}
