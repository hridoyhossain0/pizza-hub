import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Plus,
    Send,
} from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Questions about an order, your restaurant profile or a partnership? Reach the PizzaHub team by email, phone or the contact form.",
};

const channels = [
    {
        icon: Mail,
        title: "Email us",
        value: "hello@pizzahub.com",
        href: "mailto:hello@pizzahub.com",
        description: "Best for detailed questions. We reply within one business day.",
    },
    {
        icon: Phone,
        title: "Call support",
        value: "+880 1614-661970",
        href: "tel:+8801614661970",
        description: "Available every day from 10 AM to 11 PM.",
    },
    {
        icon: MapPin,
        title: "Visit us",
        value: "Gulshan 2, Dhaka",
        href: "https://maps.google.com/?q=Gulshan+2+Dhaka",
        description: "PizzaHub HQ, Level 4, Road 11, Dhaka 1212.",
    },
    {
        icon: Clock,
        title: "Support hours",
        value: "10 AM – 11 PM",
        description: "Seven days a week, including public holidays.",
    },
];

const socials = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaXTwitter, href: "https://x.com", label: "X" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

const faqs = [
    {
        question: "How quickly will I hear back?",
        answer: "Emails sent through this form are answered within one business day. For anything urgent about a live order, call the support number above so we can check it immediately.",
    },
    {
        question: "I want to sell my pizzas on PizzaHub. Where do I start?",
        answer: "Create a vendor account, complete your restaurant profile and upload your menu. Our team reviews every application by hand and usually approves new kitchens within 48 hours.",
    },
    {
        question: "Can I change or cancel an order?",
        answer: "Open the order from your dashboard. While the kitchen has not started preparing it, you can cancel and the vendor is notified right away. After that, contact the restaurant directly through your order page.",
    },
    {
        question: "Something was missing or wrong with my order.",
        answer: "Send us the order number, the restaurant name and a short description using the form. Support can issue a resolution with the vendor on your behalf.",
    },
    {
        question: "How do vendor subscriptions work?",
        answer: "Vendor Premium is a one-time payment that covers 30 days. It removes the three-active-item limit on the Free plan and adds featured placement. You can upgrade or renew from the subscription page in your vendor dashboard.",
    },
];

export default function ContactPage() {
    return (
        <div className="bg-white dark:bg-neutral-950">

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-gray-100 bg-[#fffaf5] dark:border-white/10 dark:bg-neutral-900/60">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                            <MessageCircle size={16} aria-hidden="true" />
                            Contact PizzaHub
                        </span>

                        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl dark:text-white">
                            How can we{" "}
                            <span className="text-orange-500">help?</span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-400">
                            Order issues, vendor applications, partnership
                            ideas or feedback — tell us what you need and the
                            right person on our team will pick it up.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
                        {channels.map((channel) => {
                            const Icon = channel.icon;
                            const content = (
                                <>
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition duration-300 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/15 dark:text-orange-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white">
                                        <Icon size={21} aria-hidden="true" />
                                    </div>

                                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                        {channel.title}
                                    </p>
                                    <p className="mt-1 break-words text-sm font-bold text-gray-900 dark:text-white">
                                        {channel.value}
                                    </p>
                                    <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                                        {channel.description}
                                    </p>
                                </>
                            );

                            const className =
                                "group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg dark:border-white/10 dark:bg-neutral-950 dark:hover:border-orange-500/40";

                            return channel.href ? (
                                <a
                                    key={channel.title}
                                    href={channel.href}
                                    target={
                                        channel.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        channel.href.startsWith("http")
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className={className}
                                >
                                    {content}
                                </a>
                            ) : (
                                <div key={channel.title} className={className}>
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FORM + DETAILS */}
            <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-8">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">

                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                            Send us a message
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
                            Fill in the form and we will draft an email for you
                            — no account needed.
                        </p>

                        <div className="mt-6">
                            <ContactForm />
                        </div>
                    </div>

                    <aside className="space-y-6 lg:col-span-2">
                        <div className="rounded-2xl bg-[#171717] p-7 text-white">
                            <h3 className="text-lg font-bold">
                                Talk to a human, faster
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-gray-400">
                                For live orders the phone line is quickest — have
                                your order number ready.
                            </p>

                            <a
                                href="tel:+8801700000000"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                            >
                                <Phone size={17} aria-hidden="true" />
                                +880 1614-661970
                            </a>

                            <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-gray-400">
                                <p className="flex items-start gap-2">
                                    <Clock
                                        size={16}
                                        className="mt-0.5 shrink-0 text-orange-400"
                                        aria-hidden="true"
                                    />
                                    Every day, 10 AM – 11 PM
                                </p>
                                <p className="flex items-start gap-2">
                                    <Mail
                                        size={16}
                                        className="mt-0.5 shrink-0 text-orange-400"
                                        aria-hidden="true"
                                    />
                                    hello@pizzahub.com
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-7 dark:border-white/10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Follow the slice
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                New kitchens, seasonal menus and behind-the-scenes
                                stories from our partners.
                            </p>

                            <div className="mt-5 flex items-center gap-3">
                                {socials.map((social) => {
                                    const Icon = social.icon;

                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:-translate-y-1 hover:bg-orange-500 hover:text-white dark:bg-white/5 dark:text-gray-300"
                                        >
                                            <Icon size={18} aria-hidden="true" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-7 dark:border-orange-500/30 dark:bg-orange-500/10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Own a pizzeria?
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                                Create a vendor account, publish your menu and
                                reach customers across the city.
                            </p>

                            <Link
                                href="/sign-up"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:gap-3 dark:text-orange-400"
                            >
                                Become a partner
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </section>

            {/* FAQ */}
            <section className="border-t border-gray-100 bg-[#fffaf5] px-4 py-16 sm:px-6 md:py-20 lg:px-8 dark:border-white/10 dark:bg-neutral-900/60">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center">
                        <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                            Before you write
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Frequently asked{" "}
                            <span className="text-orange-500">questions</span>
                        </h2>
                    </div>

                    <div className="mt-10 space-y-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.question}
                                className="group rounded-2xl border border-orange-100 bg-white p-5 transition open:border-orange-300 open:shadow-sm dark:border-white/10 dark:bg-neutral-950 dark:open:border-orange-500/40"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-gray-900 sm:text-base dark:text-white [&::-webkit-details-marker]:hidden">
                                    {faq.question}
                                    <Plus
                                        size={18}
                                        aria-hidden="true"
                                        className="shrink-0 text-orange-500 transition-transform duration-300 group-open:rotate-45"
                                    />
                                </summary>
                                <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-[#171717] px-6 py-12 text-center sm:px-10 md:flex-row md:text-left">
                    <div>
                        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                            Still not sure where to start?
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-gray-400">
                            Browse the menu to see what is available near you —
                            every kitchen is reviewed before it goes live.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
                    >
                        <Send size={17} aria-hidden="true" />
                        Browse menu
                    </Link>
                </div>
            </section>

        </div>
    );
}
