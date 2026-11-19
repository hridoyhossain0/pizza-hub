
import Link from "next/link";
import {
    Search,
    ShoppingCart,
    Bike,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { MotionReveal } from "@/components/HomePage/MotionReveal";

const steps = [
    {
        id: "01",
        icon: Search,
        title: "Explore Your Favorites",
        description:
            "Browse delicious pizzas, explore different categories, and discover your favorite restaurant.",
    },
    {
        id: "02",
        icon: ShoppingCart,
        title: "Place Your Order",
        description:
            "Choose your favorite items, add them to your cart, and complete your order with ease.",
    },
    {
        id: "03",
        icon: Bike,
        title: "Enjoy Your Pizza",
        description:
            "Sit back and relax while your order is prepared and delivered to your doorstep.",
    },
];

const HowItWorks = () => {
    return (
        <section className="relative overflow-hidden bg-[#171717] px-4 py-16 sm:px-6 md:py-20 lg:px-8">

            {/* Background Decoration */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
                        Simple & Convenient
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                        How{" "}
                        <span className="text-orange-500">PizzaHub</span>{" "}
                        Works
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
                        Getting your favorite pizza has never been easier.
                        Follow three simple steps and enjoy delicious food.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <MotionReveal
                                key={step.id}
                                className="relative text-center"
                                delay={index * 0.08}
                            >

                                {/* Connector */}
                                {index !== steps.length - 1 && (
                                    <div className="absolute left-[65%] top-12 hidden h-px w-[70%] border-t-2 border-dashed border-orange-500/40 md:block" />
                                )}

                                {/* Icon */}
                                <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl border border-orange-500/30 bg-orange-500/10 text-orange-400 transition duration-300 hover:rotate-6 hover:bg-orange-500 hover:text-white">
                                    <Icon size={39} />

                                    <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold text-white shadow-lg">
                                        {step.id}
                                    </span>
                                </div>

                                {/* Text */}
                                <h3 className="text-xl font-bold text-white sm:text-2xl">
                                    {step.title}
                                </h3>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-gray-400">
                                    {step.description}
                                </p>

                            </MotionReveal>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-3 rounded-xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600"
                    >
                        Start Your Order
                        <ArrowRight size={20} />
                    </Link>

                    <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 size={16} className="text-orange-400" />
                        Easy ordering, delicious moments.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;
