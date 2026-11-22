import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { MotionReveal } from "@/components/HomePage/MotionReveal";

export interface ContentSection {
    heading: string;
    body: string[];
    bullets?: string[];
}

interface ContentPageProps {
    eyebrow: string;
    title: string;
    description: string;
    sections: ContentSection[];
    cta?: { label: string; href: string };
}

/**
 * Shared shell for the static informational pages (FAQs, help, legal). Keeps
 * typography and spacing consistent across every policy page.
 */
export function ContentPage({
    eyebrow,
    title,
    description,
    sections,
    cta,
}: ContentPageProps) {
    return (
        <main className="bg-[#fffaf5] dark:bg-neutral-950">
            <section className="relative overflow-hidden border-b border-orange-100 bg-white px-4 py-16 dark:border-white/10 dark:bg-neutral-900 sm:px-6 lg:px-8">
                <div className="absolute -right-32 -top-32 size-80 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="relative mx-auto max-w-4xl text-center">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                        {eyebrow}
                    </span>
                    <h1 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                        {title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                        {description}
                    </p>
                    <nav
                        aria-label="Breadcrumb"
                        className="mt-6 flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500"
                    >
                        <Link href="/" className="hover:text-orange-500">
                            Home
                        </Link>
                        <ChevronRight className="size-3" aria-hidden="true" />
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                            {title}
                        </span>
                    </nav>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="space-y-5">
                    {sections.map((section, index) => (
                        <MotionReveal key={section.heading} delay={index * 0.03}>
                            <article className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-8">
                                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl">
                                    {section.heading}
                                </h2>
                                <div className="mt-3 space-y-3">
                                    {section.body.map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="text-sm leading-7 text-gray-600 dark:text-gray-400"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                                {section.bullets?.length ? (
                                    <ul className="mt-4 space-y-2">
                                        {section.bullets.map((bullet) => (
                                            <li
                                                key={bullet}
                                                className="flex items-start gap-2 text-sm leading-6 text-gray-600 dark:text-gray-400"
                                            >
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </article>
                        </MotionReveal>
                    ))}
                </div>

                {cta ? (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-lg shadow-orange-200 dark:shadow-black/40 sm:flex-row sm:p-8">
                        <div>
                            <p className="text-lg font-extrabold">
                                Still need a hand?
                            </p>
                            <p className="mt-1 text-sm text-orange-50">
                                Our team is happy to help with orders, accounts
                                and restaurant onboarding.
                            </p>
                        </div>
                        <Link
                            href={cta.href}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
                        >
                            {cta.label}
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                ) : null}
            </section>
        </main>
    );
}
