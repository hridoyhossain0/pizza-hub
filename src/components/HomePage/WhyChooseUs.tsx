
import {
    Clock,
    ShieldCheck,
    Truck,
    Heart,
    ChefHat,
    Headset,
} from "lucide-react";

const benefits = [
    {
        id: 1,
        icon: ChefHat,
        title: "Fresh & Quality Ingredients",
        description:
            "We partner with trusted restaurants that prepare delicious pizzas using fresh, quality ingredients.",
    },
    {
        id: 2,
        icon: Truck,
        title: "Fast & Reliable Delivery",
        description:
            "Get your favorite pizza delivered to your doorstep with a smooth and convenient ordering experience.",
    },
    {
        id: 3,
        icon: ShieldCheck,
        title: "Trusted Restaurants",
        description:
            "Explore approved restaurant partners and discover quality food from trusted local vendors.",
    },
    {
        id: 4,
        icon: Clock,
        title: "Easy Online Ordering",
        description:
            "Browse menus, compare prices, and place your order in just a few simple clicks.",
    },
    {
        id: 5,
        icon: Heart,
        title: "Made for Pizza Lovers",
        description:
            "From classic favorites to gourmet creations, find something delicious for every craving.",
    },
    {
        id: 6,
        icon: Headset,
        title: "Customer Support",
        description:
            "We're here to help make your ordering experience simple, convenient, and enjoyable.",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="bg-[#fffaf5] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                        The PizzaHub Difference
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                        Why Choose{" "}
                        <span className="text-orange-500">PizzaHub?</span>
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
                        Great pizza, trusted restaurants, and a convenient
                        ordering experience. Everything you need to satisfy
                        your pizza cravings.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <div
                                key={benefit.id}
                                className="group rounded-2xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
                            >
                                {/* Icon */}
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                                    <Icon size={27} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 transition group-hover:text-orange-600">
                                    {benefit.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-gray-500">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
