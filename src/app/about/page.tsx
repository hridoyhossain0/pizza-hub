import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    ChefHat,
    Clock3,
    HeartHandshake,
    Leaf,
    MapPin,
    ShieldCheck,
    Sparkles,
    Star,
    Store,
    Users,
} from "lucide-react";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "PizzaHub connects pizza lovers with trusted local pizzerias — fresh ingredients, transparent menus and reliable delivery.",
};

const stats = [
    { value: "120+", label: "Partner restaurants" },
    { value: "18k+", label: "Happy customers" },
    { value: "45 min", label: "Average delivery" },
    { value: "4.8/5", label: "Average rating" },
];

const values = [
    {
        icon: Leaf,
        title: "Fresh, honest ingredients",
        description:
            "Every partner kitchen is reviewed before it goes live, so what you order is what the restaurant actually cooks with.",
    },
    {
        icon: ShieldCheck,
        title: "Trusted local vendors",
        description:
            "Restaurant profiles, menus and prices are verified by our team. No ghost kitchens, no surprise listings.",
    },
    {
        icon: Clock3,
        title: "Ordering without friction",
        description:
            "Browse, compare and order in a few clicks. Clear prices, live item availability and a simple checkout flow.",
    },
    {
        icon: HeartHandshake,
        title: "Support that answers",
        description:
            "Real humans on chat and email, seven days a week — for customers and vendors alike.",
    },
];

const steps = [
    {
        icon: Store,
        title: "Vendors join",
        description:
            "Local pizzerias create a profile, upload their menu and get approved by our team.",
    },
    {
        icon: Sparkles,
        title: "We verify",
        description:
            "Menus, prices and photos are checked so the storefront always reflects reality.",
    },
    {
        icon: ChefHat,
        title: "You order",
        description:
            "Pick your favourites, place the order and track it until it reaches your door.",
    },
];

const team = [
    {
        name: "Jhankar Mahbub",
        role: "Co-founder & Product",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSahho_s9jqE6gFgUDeSdw30HC3cNrCImgnDd0YLIxsZQ&s=10",
    },
    {
        name: "Md Hridoy Hossain",
        role: "Co-founder & Partnerships",
        image: "/photo.png",
    },
    {
        name: "Ahashan Habib Utsho",
        role: "Head of Customer Experience",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfis-5j3dTXtAlIDADTaW7pn5oovRB4RpVcdI7FuvoEw&s",
    },
];

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-neutral-950">

            {/* HERO */}
            <section className="relative overflow-hidden bg-[#171717]">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&auto=format&fit=crop')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/40" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
                            <PizzaMark />
                            About PizzaHub
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                            Great pizza starts with{" "}
                            <span className="text-orange-500">
                                great relationships
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                            PizzaHub is a marketplace built around one simple
                            idea: local pizzerias deserve a storefront as good
                            as their food, and pizza lovers deserve an honest,
                            effortless way to order it.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link
                                href="/menu"
                                className="group inline-flex items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600"
                            >
                                Explore the menu
                                <ArrowRight
                                    size={20}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 rounded-xl border border-white/20 px-7 py-4 font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
                            >
                                Talk to us
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="relative border-t border-white/10">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-2xl font-extrabold text-white sm:text-3xl">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STORY */}
            <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="relative">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=1400&auto=format&fit=crop"
                                alt="Pizza chef stretching dough in a local kitchen"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-lg sm:left-8 dark:border-white/10 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                                <Star size={20} className="fill-current" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    Built with vendors
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Designed alongside 40+ local kitchens
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                            Our story
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            From one neighbourhood oven to a city-wide
                            marketplace
                        </h2>

                        <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-400">
                            <p>
                                PizzaHub began in 2023 when a handful of family
                                run pizzerias told us the same thing: delivery
                                apps were taking a bigger slice than the pizza.
                                We started with a menu page, a spreadsheet and a
                                promise to keep commissions fair.
                            </p>
                            <p>
                                Today the platform helps independent kitchens
                                publish accurate menus, reach new customers and
                                keep control of their brand — while customers
                                get transparent pricing and support that
                                actually replies.
                            </p>
                            <p>
                                We still review every restaurant by hand. If a
                                kitchen would not serve it to a friend, it does
                                not belong on PizzaHub.
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                                <MapPin
                                    size={20}
                                    className="mt-0.5 shrink-0 text-orange-500"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        Local first
                                    </p>
                                    <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                                        Every partner is a real kitchen in the
                                        city we operate in.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border border-gray-100 p-4 dark:border-white/10">
                                <Users
                                    size={20}
                                    className="mt-0.5 shrink-0 text-orange-500"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        People over algorithms
                                    </p>
                                    <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                                        Menus and vendors are reviewed by our
                                        team, not auto-approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="bg-[#fffaf5] px-4 py-16 sm:px-6 md:py-24 lg:px-8 dark:bg-neutral-900/60">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                            What we stand for
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
                            Values that shape{" "}
                            <span className="text-orange-500">every order</span>
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base dark:text-gray-400">
                            A marketplace is only as good as the trust behind
                            it. These four commitments guide how we build and
                            who we work with.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => {
                            const Icon = value.icon;

                            return (
                                <div
                                    key={value.title}
                                    className="group rounded-2xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl dark:border-white/10 dark:bg-neutral-950 dark:hover:border-orange-500/40"
                                >
                                    <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition duration-300 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/15 dark:text-orange-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white">
                                        <Icon size={27} />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                                        {value.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* HOW WE WORK */}
            <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                            How it works
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
                            A short chain from kitchen to{" "}
                            <span className="text-orange-500">doorstep</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    className="relative rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-neutral-900"
                                >
                                    <span className="absolute right-5 top-5 text-4xl font-extrabold text-orange-100 dark:text-white/5">
                                        0{index + 1}
                                    </span>

                                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                                        <Icon size={28} />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TEAM */}
            <section className="bg-[#fffaf5] px-4 py-16 sm:px-6 md:py-24 lg:px-8 dark:bg-neutral-900/60">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                            The people behind it
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
                            Small team,{" "}
                            <span className="text-orange-500">
                                big appetite
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-neutral-950"
                            >
                                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                                    <Image
                                        src={member.image || "/photo.png"}
                                        alt={member.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {member.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#171717]">
                    <div className="relative px-6 py-14 text-center sm:px-10 md:py-16">
                        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

                        <div className="relative">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                Hungry yet?
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                                Browse verified kitchens near you, or partner
                                with us and put your pizzeria in front of
                                thousands of hungry customers.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/menu"
                                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
                                >
                                    Browse menu
                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
                                >
                                    Become a partner
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

function PizzaMark() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M15 11h.01" />
            <path d="M11 15h.01" />
            <path d="M16 16h.01" />
            <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
            <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
        </svg>
    );
}
