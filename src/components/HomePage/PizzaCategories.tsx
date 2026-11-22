import Link from "next/link";
import {
    ArrowUpRight,
    Pizza,
    Leaf,
    Beef,
    ChefHat,
    Utensils,
    Coffee,
} from "lucide-react";
import { MotionReveal } from "@/components/HomePage/MotionReveal";
import { MENU_CATEGORIES } from "@/lib/types/dashboard";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    "Classic Pizzas": "Timeless flavors everyone loves.",
    "Vegetarian Pizzas": "Fresh veggies, delicious flavors.",
    "Meat Lovers": "Loaded with delicious meaty toppings.",
    "Specialty / Gourmet Pizzas": "Unique pizzas for special cravings.",
    "Sides & Appetizers": "Perfect bites to complete your meal.",
    "Beverages & Desserts": "Sweet treats and refreshing drinks.",
};

const CATEGORY_IMAGES: Record<string, string> = {
    "Classic Pizzas":
        "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800",
    "Vegetarian Pizzas":
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=800",
    "Meat Lovers":
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800",
    "Specialty / Gourmet Pizzas":
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800",
    "Sides & Appetizers":
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800",
    "Beverages & Desserts":
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800",
};

const CATEGORY_ICONS = [Pizza, Leaf, Beef, ChefHat, Utensils, Coffee];

interface PizzaCategoriesProps {
    /** Approved item count per category, read from the database. */
    counts?: Record<string, number>;
}

const PizzaCategories = ({ counts = {} }: PizzaCategoriesProps) => {
    return (
        <section className="bg-white px-4 py-16 dark:bg-neutral-950 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Section Heading */}
                <div className="mb-10 text-center">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                        Explore Our Menu
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                        Browse By{" "}
                        <span className="text-orange-500">Categories</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                        From classic favorites to gourmet creations, discover
                        the perfect flavor for every craving.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {MENU_CATEGORIES.map((name, index) => {
                        const Icon = CATEGORY_ICONS[index] ?? Pizza;
                        const count = counts[name] ?? 0;

                        return (
                            <MotionReveal key={name} delay={index * 0.05}>
                                <Link
                                    href={`/menu?category=${encodeURIComponent(name)}`}
                                    aria-label={`Browse ${name}`}
                                    className="group relative block h-64 overflow-hidden rounded-2xl bg-gray-900 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:h-72"
                                >
                                    {/* Background Image */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={CATEGORY_IMAGES[name]}
                                        alt={name}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition group-hover:from-black/95" />

                                    {/* Top Icon */}
                                    <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition group-hover:bg-orange-500">
                                        <Icon size={21} />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-6">
                                        <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-orange-400">
                                            {count} {count === 1 ? "Item" : "Items"}
                                        </span>

                                        <h3 className="text-xl font-bold text-white sm:text-2xl">
                                            {name}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm text-gray-300">
                                            {CATEGORY_DESCRIPTIONS[name]}
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white">
                                            Explore Category
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            </MotionReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PizzaCategories;
