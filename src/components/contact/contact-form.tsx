"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";

const TOPICS = [
    "General question",
    "Order support",
    "Partner with PizzaHub",
    "Report a problem",
    "Press & media",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form.
 *
 * There is no message inbox in this project, so the form composes a
 * pre-filled email in the visitor's own mail client. That keeps the page
 * genuinely functional without pretending a message was stored server-side.
 */
export function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const topic = String(data.get("topic") ?? TOPICS[0]);
        const message = String(data.get("message") ?? "").trim();

        if (name.length < 2) {
            setError("Please enter your name (at least 2 characters).");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (message.length < 10) {
            setError("Please add a few more details (at least 10 characters).");
            return;
        }

        setError("");

        const subject = encodeURIComponent(`[PizzaHub] ${topic} — ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
        );

        window.location.href = `mailto:hello@pizzahub.com?subject=${subject}&body=${body}`;
        setSent(true);
    };

    if (sent) {
        return (
            <div
                role="status"
                className="flex h-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-14 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"
            >
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <CheckCircle2 size={28} aria-hidden="true" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                    Your email draft is ready
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-7 text-gray-600 dark:text-gray-400">
                    We opened your mail app with the message pre-filled. Send it
                    and our team will reply within one business day. If nothing
                    opened, write to{" "}
                    <a
                        href="mailto:hello@pizzahub.com"
                        className="font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
                    >
                        hello@pizzahub.com
                    </a>
                    .
                </p>

                <button
                    type="button"
                    onClick={() => {
                        setSent(false);
                        formRef.current?.reset();
                    }}
                    className="mt-6 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-400 hover:text-orange-600 dark:border-white/15 dark:text-gray-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
                >
                    Write another message
                </button>
            </div>
        );
    }

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-neutral-900"
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="contact-name"
                        className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                        Your name
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Jamie Doe"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-orange-500/60"
                    />
                </div>

                <div>
                    <label
                        htmlFor="contact-email"
                        className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                    >
                        Email address
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-orange-500/60"
                    />
                </div>
            </div>

            <div className="mt-5">
                <label
                    htmlFor="contact-topic"
                    className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                    What is this about?
                </label>
                <select
                    id="contact-topic"
                    name="topic"
                    defaultValue={TOPICS[0]}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-orange-500/60"
                >
                    {TOPICS.map((topic) => (
                        <option key={topic} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-5">
                <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                    Message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder="Tell us what you need — order number, restaurant name, or anything else that helps."
                    className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-orange-500/60"
                />
            </div>

            {error ? (
                <p
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                >
                    {error}
                </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-gray-500 dark:text-gray-400">
                    This opens your email app with the message pre-filled. We
                    never share your details.
                </p>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
                >
                    <Send size={17} aria-hidden="true" />
                    Send message
                </button>
            </div>
        </form>
    );
}
