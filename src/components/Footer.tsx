"use client";

import Link from "next/link";
import {
    Pizza,
    MapPin,
    Phone,
    Mail,
    Clock,
    ArrowRight,
} from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";



const COPYRIGHT_YEAR = new Date().getFullYear();

const Footer =  () => {

     const year = COPYRIGHT_YEAR;

   
    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Browse Menu", href: "/menu" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
    ];

    const supportLinks = [
        { name: "My Orders", href: "/my-orders" },
        { name: "My Account", href: "/dashboard" },
        { name: "FAQs", href: "/faqs" },
        { name: "Help Center", href: "/help" },
    ];

    const socialLinks = [
        {
            icon: FaFacebook,
            href: "https://facebook.com",
            label: "Facebook",
        },
        {
            icon: FaInstagram,
            href: "https://instagram.com",
            label: "Instagram",
        },
        {
            icon: FaTwitter,
            href: "https://twitter.com",
            label: "Twitter",
        },
        {
            icon: FaYoutube,
            href: "https://youtube.com",
            label: "YouTube",
        },
    ];








    return (
        <footer className="bg-[#171717] text-white">

            {/* MAIN FOOTER */}
            <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* BRAND SECTION */}
                    <div className="space-y-5">

                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20">
                                <Pizza size={27} className="text-white" />
                            </div>

                            <span className="text-2xl font-extrabold tracking-tight">
                                Pizza<span className="text-orange-500">Hub</span>
                            </span>
                        </Link>

                        <p className="max-w-xs text-sm leading-7 text-gray-400">
                            Freshly baked, deliciously made. We bring happiness
                            to your table with every slice. Enjoy your favorite
                            pizza, made with love and fresh ingredients.
                        </p>

                        {/* SOCIAL LINKS */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#292929] text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white"
                                    >
                                        <Icon size={19} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold">
                            Quick Links
                            <span className="mt-2 block h-1 w-10 rounded-full bg-orange-500" />
                        </h3>

                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-500"
                                    >
                                        <ArrowRight
                                            size={14}
                                            className="text-orange-500 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                                        />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SUPPORT LINKS */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold">
                            Customer Support
                            <span className="mt-2 block h-1 w-10 rounded-full bg-orange-500" />
                        </h3>

                        <ul className="space-y-4">
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-500"
                                    >
                                        <ArrowRight
                                            size={14}
                                            className="text-orange-500 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                                        />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT INFORMATION */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold">
                            Get In Touch
                            <span className="mt-2 block h-1 w-10 rounded-full bg-orange-500" />
                        </h3>

                        <ul className="space-y-5">

                            <li className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <MapPin size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Our Location</p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Dhaka, Bangladesh
                                    </p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <Phone size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Phone Number</p>
                                    <a
                                        href="tel:+8801700000000"
                                        className="mt-1 block text-sm text-gray-400 transition hover:text-orange-500"
                                    >
                                        +880 1700-000000
                                    </a>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <Mail size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Email Address</p>
                                    <a
                                        href="mailto:hello@pizzahub.com"
                                        className="mt-1 block break-all text-sm text-gray-400 transition hover:text-orange-500"
                                    >
                                        hello@pizzahub.com
                                    </a>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <Clock size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Opening Hours</p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Every day: 10 AM - 11 PM
                                    </p>
                                </div>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>

            {/* COPYRIGHT SECTION */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left lg:px-8">

                    <p className="text-sm text-gray-500">
                        © {year}{" "}
                        <span className="font-semibold text-orange-500">
                            PizzaHub
                        </span>
                        . All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500">
                        <Link
                            href="/privacy-policy"
                            className="transition hover:text-orange-500"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition hover:text-orange-500"
                        >
                            Terms & Conditions
                        </Link>

                        <span>
                            Made with{" "}
                            <span className="text-red-500">♥</span> for pizza lovers
                        </span>
                    </div>

                </div>
            </div>

        </footer>
    );
};

export default Footer;
