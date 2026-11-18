
import Link from "next/link";
import {
    ArrowRight,
    MapPin,
    Store,
    Tag,
} from "lucide-react";
import Image from "next/image";

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

interface FeaturedMenuProps {
    items: MenuItem[];
}

const FeaturedMenu = ({ items }: FeaturedMenuProps) => {
    // Only show approved and active menu items
    const featuredItems = items
        .filter(
            (item) => item.status === "approved" && item.isActive
        )
        .slice(0, 6);

    return (
        <section className="bg-[#fffaf5] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                            Our Special Menu
                        </span>

                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Featured{" "}
                            <span className="text-orange-500">Menu Items</span>
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                            Discover delicious pizzas made with fresh ingredients
                            from our trusted restaurant partners.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 font-semibold text-orange-600 transition hover:gap-3"
                    >
                        View All Menu
                        <ArrowRight size={19} />
                    </Link>
                </div>

                {/* Menu Grid */}
                {featuredItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {featuredItems.map((item) => (
                            <div
                                key={item._id}
                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition duration-500 group-hover:scale-110"
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
                                        ৳{item.price}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">

                                    <h3 className="line-clamp-1 text-xl font-bold text-gray-900 transition group-hover:text-orange-600">
                                        {item.name}
                                    </h3>

                                    {/* Location */}
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={16} className="shrink-0 text-orange-500" />
                                        <span className="line-clamp-1">{item.location}</span>
                                    </div>

                                    {/* Vendor Info */}
                                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                                        <div className="flex min-w-0 items-center gap-2">
                                            {item.vendor.image ? (
                                                <Image
                                                    src={item.vendor.image}
                                                    alt={item.vendor.name}
                                                    width={36}
                                                    height={36}
                                                    className="h-9 w-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                                    <Store size={18} />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">
                                                    Prepared by
                                                </p>
                                                <p className="truncate text-sm font-semibold text-gray-800">
                                                    {item.vendor.name}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/menu/${item._id}`}
                                            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                                        >
                                            Details
                                            <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                        <Tag className="mx-auto mb-4 text-orange-400" size={36} />
                        <h3 className="text-lg font-bold text-gray-800">
                            No Featured Items Yet
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Approved menu items will appear here soon.
                        </p>
                    </div>
                )}

                {/* Bottom Button */}
                <div className="mt-10 text-center">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
                    >
                        Explore Full Menu
                        <ArrowRight size={19} />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedMenu;
