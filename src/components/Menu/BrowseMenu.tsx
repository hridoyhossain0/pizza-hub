
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    MapPin,
    Store,
    ArrowRight,
    SlidersHorizontal,
    X,
    UtensilsCrossed,
} from "lucide-react";

export interface MenuItem {
    _id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    location: string;
    vendor: {
        name: string;
        image?: string;
    };
    status: "pending" | "approved" | "rejected";
    isActive: boolean;
    premium?: boolean;
}

interface BrowseMenuProps {
    items: MenuItem[];
    loading?: boolean;
}

const BrowseMenu = ({
    items,
    loading = false,
}: BrowseMenuProps) => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");

    // Only approved and active menu items
    const availableItems = useMemo(
        () =>
            items.filter(
                (item) =>
                    item.status === "approved" && item.isActive
            ),
        [items]
    );

    // Get unique categories and locations
    const categories = useMemo(
        () => [...new Set(availableItems.map((item) => item.category))],
        [availableItems]
    );

    const locations = useMemo(
        () => [...new Set(availableItems.map((item) => item.location))],
        [availableItems]
    );

    // Search and filter
    const filteredItems = useMemo(() => {
        return availableItems.filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(search.toLowerCase().trim());

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            const matchesLocation =
                selectedLocation === "all" ||
                item.location === selectedLocation;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLocation
            );
        });
    }, [
        availableItems,
        search,
        selectedCategory,
        selectedLocation,
    ]);

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("all");
        setSelectedLocation("all");
    };

    const hasFilters =
        search !== "" ||
        selectedCategory !== "all" ||
        selectedLocation !== "all";

    return (
        <section className="min-h-screen bg-[#fffaf5] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                        <UtensilsCrossed size={16} />
                        Discover Delicious Food
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                        Explore Our{" "}
                        <span className="text-orange-500">Menu</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                        Find your favorite pizzas, explore amazing flavors,
                        and discover delicious meals from trusted restaurants.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-9 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Search */}
                        <div className="relative md:col-span-1">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search pizza by name..."
                                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="all">All Categories</option>

                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* Location Filter */}
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="all">All Locations</option>

                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Summary */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-500">
                            <SlidersHorizontal
                                size={16}
                                className="mr-2 inline text-orange-500"
                            />
                            Showing{" "}
                            <span className="font-bold text-gray-900">
                                {filteredItems.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-gray-900">
                                {availableItems.length}
                            </span>{" "}
                            available items
                        </p>

                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                            >
                                <div className="h-56 animate-pulse bg-gray-200" />
                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                                    <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredItems.length > 0 ? (

                    /* Menu Cards */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map((item) => (
                            <article
                                key={item._id}
                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-orange-600 shadow">
                                        {item.category}
                                    </span>

                                    {item.premium ? (
                                        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow">
                                            Premium
                                        </span>
                                    ) : null}

                                    <div className="absolute bottom-4 right-4 rounded-xl bg-orange-500 px-4 py-2 text-lg font-extrabold text-white shadow-lg">
                                        ৳{item.price.toLocaleString("en-BD")}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h2 className="line-clamp-1 text-xl font-bold text-gray-900 transition group-hover:text-orange-600">
                                        {item.name}
                                    </h2>

                                    {/* Location */}
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin
                                            size={17}
                                            className="shrink-0 text-orange-500"
                                        />
                                        <span className="line-clamp-1">
                                            {item.location}
                                        </span>
                                    </div>

                                    {/* Vendor */}
                                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            {item.vendor.image ? (
                                                <img
                                                    src={item.vendor.image}
                                                    alt={item.vendor.name}
                                                    loading="lazy"
                                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                                    <Store size={19} />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">
                                                    Restaurant
                                                </p>
                                                <p className="truncate text-sm font-bold text-gray-800">
                                                    {item.vendor.name}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/menu/${item._id}`}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                                        >
                                            View Details
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                ) : (

                    /* Empty State */
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                            <Search size={30} />
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-900">
                            No Menu Items Found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            We couldn&apos;t find any items matching your search.
                            Try another name, category, or location.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default BrowseMenu;
