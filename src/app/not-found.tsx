import Link from "next/link";
import { ArrowLeft, Home, Pizza, Search } from "lucide-react";

export default function NotFound() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-[#fffaf5] px-4 py-16 dark:bg-neutral-950">
            <div className="w-full max-w-xl rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-12">
                <div className="relative mx-auto flex size-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                    <Pizza className="size-10" aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold text-white">
                        404
                    </span>
                </div>

                <h1 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                    This slice is missing
                </h1>

                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    The page you are looking for was moved, removed, or never
                    existed. Check the address or head back to the menu for
                    something fresh.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/menu"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                        <Search size={18} aria-hidden="true" />
                        Browse the menu
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-white/5"
                    >
                        <Home size={18} aria-hidden="true" />
                        Back to home
                    </Link>
                </div>

                <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-400"
                >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Need help? Contact us
                </Link>
            </div>
        </section>
    );
}
