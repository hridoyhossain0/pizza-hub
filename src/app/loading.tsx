import { Loader2 } from "lucide-react";

/**
 * Route-level loading state shown while a server page streams in.
 * Menu and dashboard pages add their own skeletons on top of this.
 */
export default function Loading() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fffaf5] px-4 py-20 dark:bg-neutral-950"
        >
            <span className="flex size-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                <Loader2
                    className="size-8 animate-spin"
                    aria-hidden="true"
                />
            </span>
            <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Loading PizzaHub...
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Fetching fresh menu items and dashboard data.
                </p>
            </div>
            <span className="sr-only">Loading</span>
        </div>
    );
}
