
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

const categories = [
    {
        id: 1,
        name: "Classic Pizzas",
        slug: "classic-pizzas",
        description: "Timeless flavors everyone loves.",
        image:
            "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800",
        icon: Pizza,
        count: "12+ Items",
    },
    {
        id: 2,
        name: "Vegetarian Pizzas",
        slug: "vegetarian-pizzas",
        description: "Fresh veggies, delicious flavors.",
        image:
            "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=800",
        icon: Leaf,
        count: "10+ Items",
    },
    {
        id: 3,
        name: "Meat Lovers",
        slug: "meat-lovers",
        description: "Loaded with delicious meaty toppings.",
        image:
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800",
        icon: Beef,
        count: "8+ Items",
    },
    {
        id: 4,
        name: "Specialty / Gourmet",
        slug: "specialty-gourmet",
        description: "Unique pizzas for special cravings.",
        image:
            "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800",
        icon: ChefHat,
        count: "9+ Items",
    },
    {
        id: 5,
        name: "Sides & Appetizers",
        slug: "sides-appetizers",
        description: "Perfect bites to complete your meal.",
        image:
            "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800",
        icon: Utensils,
        count: "15+ Items",
    },
    {
        id: 6,
        name: "Beverages & Desserts",
        slug: "beverages-desserts",
        description: "Sweet treats and refreshing drinks.",
        image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800",
        icon: Coffee,
        count: "11+ Items",
    },
];

const PizzaCategories = () => {
    return (
        <section className="bg-white px-4 py-16 sm:px-6 md:py-20 lg:px-8 dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-10 text-center">
                    <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                        Explore Our Menu
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
                        Browse By{" "}
                        <span className="text-orange-500">Categories</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base dark:text-gray-400">
                        From classic favorites to gourmet creations, discover
                        the perfect flavor for every craving.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.id}
                                href={`/menu?category=${category.slug}`}
                                className="group relative h-64 overflow-hidden rounded-2xl bg-gray-900 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:h-72"
                            >
                                {/* Background Image */}
                                <img
                                    src={category.image}
                                    alt={category.name}
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
                                        {category.count}
                                    </span>

                                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                                        {category.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-300">
                                        {category.description}
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white">
                                        Explore Category
                                        <ArrowUpRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};

export default PizzaCategories;
