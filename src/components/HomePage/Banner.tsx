
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

const Banner = () => {
    return (
        <section className="relative min-h-[500px] md:min-h-[600px] overflow-hidden bg-[#171717]">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=2000&auto=format&fit=crop')",
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-20 md:min-h-[600px] md:px-10 lg:px-16">
                <div className="max-w-2xl">
                    {/* Small Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
                        <Flame size={17} />
                        <span>Freshly Baked, Always Delicious</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        Hot & Fresh Pizza
                        <span className="mt-2 block text-orange-500">
                            Delivered to Your Door
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
                        Experience the perfect combination of crispy crust, fresh
                        ingredients, and irresistible flavors. Your favorite pizza
                        is just one click away!
                    </p>

                    {/* CTA */}
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Link
                            href="/menu"
                            className="group inline-flex items-center gap-3 rounded-xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600"
                        >
                            Explore Pizza Menu
                            <ArrowRight
                                size={20}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>

                        <span className="text-sm text-gray-300">
                            Made with love ❤️
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-600 via-orange-400 to-transparent" />
        </section>
    );
};

export default Banner;
