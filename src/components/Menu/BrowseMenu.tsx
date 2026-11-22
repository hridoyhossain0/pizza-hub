"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    MapPin,
    Store,
    ArrowRight,
    SlidersHorizontal,
    ArrowUpDown,
    X,
    UtensilsCrossed,
} from "lucide-react";

import type { MenuStatus } from "@/lib/types/dashboard";

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
    status: MenuStatus;
    isActive: boolean;
    premium?: boolean;
}

interface BrowseMenuProps {
    items: MenuItem[];
    /** All six storefront categories, even ones with no items yet. */
    categories: string[];
    locations: string[];
    loading?: boolean;
}

type SortValue = "newest" | "price_asc" | "price_desc" | "name_asc";

const SORT_LABELS: Record<SortValue, string> = {
    newest: "Sort: Newest",
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    name_asc: "Name: A to Z",
};

function isSortValue(value: string | null): value is SortValue {
    return (
        value === "newest" ||
        value === "price_asc" ||
        value === "price_desc" ||
        value === "name_asc"
    );
}

const BrowseMenu = ({
    items,
    categories,
    locations,
    loading = false,
}: BrowseMenuProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get("q") ?? "";
    const initialCategory = searchParams.get("category") ?? "all";
    const initialLocation = searchParams.get("location") ?? "all";
    const initialSortParam = searchParams.get("sort");
    const initialSort: SortValue = isSortValue(initialSortParam)
        ? initialSortParam
        : "newest";

    const [search, setSearch] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [sortBy, setSortBy] = useState<SortValue>(initialSort);

    // Keep the UI in sync when a category card (or a back/forward navigation)
    // changes the query string.
    const lastUrl = useRef(searchParams.toString());

    useEffect(() => {
        const current = searchParams.toString();

        if (current === lastUrl.current) {
            return;
        }

        lastUrl.current = current;
        setSearch(searchParams.get("q") ?? "");
        setSelectedCategory(searchParams.get("category") ?? "all");
        setSelectedLocation(searchParams.get("location") ?? "all");
        const sort = searchParams.get("sort");
        setSortBy(isSortValue(sort) ? sort : "newest");
    }, [searchParams]);

    // Reflect filters in the URL so the view is shareable and survives reload.
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            const params = new URLSearchParams();

            if (search.trim()) params.set("q", search.trim());
            if (selectedCategory !== "all")
                params.set("category", selectedCategory);
            if (selectedLocation !== "all")
                params.set("location", selectedLocation);
            if (sortBy !== "newest") params.set("sort", sortBy);

            const query = params.toString();
            const next = query ? `${pathname}?${query}` : pathname;
            const current = searchParams.toString();
            const currentUrl = current ? `${pathname}?${current}` : pathname;

            if (next !== currentUrl) {
                lastUrl.current = query;
                router.replace(next, { scroll: false });
            }
        }, 250);

        return () => window.clearTimeout(timeout);
    }, [
        search,
        selectedCategory,
        selectedLocation,
        sortBy,
        pathname,
        router,
        searchParams,
    ]);

    // Only approved + active items are ever shown to the public.
    const availableItems = useMemo(
        () =>
            items.filter(
                (item) => item.status === "approved" && item.isActive
            ),
        [items]
    );

    // Search covers the item name, category, location and restaurant so
    // "pizza", "dhaka" or a vendor name all work.
    const filteredItems = useMemo(() => {
        const query = search.toLowerCase().trim();

        return availableItems.filter((item) => {
            const searchable = [
                item.name,
                item.category,
                item.location,
                item.vendor.name,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = !query || searchable.includes(query);

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            const matchesLocation =
                selectedLocation === "all" ||
                item.location === selectedLocation;

            return matchesSearch && matchesCategory && matchesLocation;
        });
    }, [availableItems, search, selectedCategory, selectedLocation]);

    const visibleItems = useMemo(() => {
        const sorted = [...filteredItems];

        if (sortBy === "price_asc") {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name_asc") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        return sorted;
    }, [filteredItems, sortBy]);

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("all");
        setSelectedLocation("all");
        setSortBy("newest");
        router.replace(pathname, { scroll: false });
    };

    const hasFilters =
        search !== "" ||
        selectedCategory !== "all" ||
        selectedLocation !== "all";

    return (
        <section className="min-h-screen bg-[#fffaf5] px-4 py-12 dark:bg-neutral-950 sm:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                        <UtensilsCrossed size={16} />
                        Discover Delicious Food
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                        Explore Our{" "}
                        <span className="text-orange-500">Menu</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
                        Find your favorite pizzas, explore amazing flavors, and
                        discover delicious meals from trusted restaurants.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-9 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {/* Search */}
                        <div className="relative md:col-span-2 xl:col-span-1">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, vendor, category..."
                                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-orange-500/60 dark:focus:bg-neutral-950 dark:focus:ring-orange-500/20"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            aria-label="Filter by category"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-200 dark:focus:border-orange-500/60 dark:focus:ring-orange-500/20"
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
                            aria-label="Filter by location"
                            value={selectedLocation}
                            onChange={(e) =>
                                setSelectedLocation(e.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-200 dark:focus:border-orange-500/60 dark:focus:ring-orange-500/20"
                        >
                            <option value="all">All Locations</option>

                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>

                        {/* Price / name sorting */}
                        <div className="relative">
                            <ArrowUpDown
                                size={17}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                            />
                            <select
                                aria-label="Sort menu items"
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as SortValue)
                                }
                                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-200 dark:focus:border-orange-500/60 dark:focus:ring-orange-500/20"
                            >
                                {(
                                    Object.keys(SORT_LABELS) as SortValue[]
                                ).map((value) => (
                                    <option key={value} value={value}>
                                        {SORT_LABELS[value]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter Summary */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <SlidersHorizontal
                                size={16}
                                className="mr-2 inline text-orange-500"
                            />
                            Showing{" "}
                            <span className="font-bold text-gray-900 dark:text-white">
                                {visibleItems.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-gray-900 dark:text-white">
                                {availableItems.length}
                            </span>{" "}
                            available items
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
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
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-neutral-900"
                            >
                                <div className="h-56 animate-pulse bg-gray-200 dark:bg-white/10" />
                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
                                    <div className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : visibleItems.length > 0 ? (
                    /* Menu Cards */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleItems.map((item) => (
                            <article
                                key={item._id}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900"
                            >
                                {/* Image */}
                                <div className="relative h-56 shrink-0 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />

                                    <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full bg-white px-3 py-1.5 text-xs font-bold text-orange-600 shadow dark:bg-neutral-950 dark:text-orange-400">
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
                                <div className="flex flex-1 flex-col p-5">
                                    <h2 className="line-clamp-1 text-xl font-bold text-gray-900 transition group-hover:text-orange-600 dark:text-white">
                                        {item.name}
                                    </h2>

                                    {/* Location */}
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin
                                            size={17}
                                            className="shrink-0 text-orange-500"
                                        />
                                        <span className="line-clamp-1">
                                            {item.location}
                                        </span>
                                    </div>

                                    {/* Vendor */}
                                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
                                        <div className="flex min-w-0 items-center gap-3">
                                            {item.vendor.image ? (
                                                <img
                                                    src={item.vendor.image}
                                                    alt={item.vendor.name}
                                                    loading="lazy"
                                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                                                    <Store size={19} />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Restaurant
                                                </p>
                                                <p className="truncate text-sm font-bold text-gray-800 dark:text-gray-200">
                                                    {item.vendor.name}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/menu/${item._id}`}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white"
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
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-white/15 dark:bg-neutral-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400">
                            <Search size={30} />
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                            No Menu Items Found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                            We couldn&apos;t find any items matching your
                            search. Try another name, category, or location.
                        </p>

                        <button
                            type="button"
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
