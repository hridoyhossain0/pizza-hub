/**
 * Dashboard-specific skeleton. The dashboard layout (sidebar + header) stays
 * mounted, so only the content area shimmers while data loads.
 */
export default function DashboardLoading() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8"
        >
            <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-border bg-card p-5"
                    >
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="mt-4 h-8 w-16 animate-pulse rounded bg-muted" />
                        <div className="mt-3 h-3 w-32 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
                    <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                    <div className="mt-6 h-56 animate-pulse rounded-xl bg-muted" />
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                    <div className="mt-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-10 animate-pulse rounded-lg bg-muted"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <span className="sr-only">Loading dashboard data</span>
        </div>
    );
}
