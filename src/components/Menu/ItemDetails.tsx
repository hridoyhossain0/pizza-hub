
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    MapPin,
    Store,
    ShoppingBag,
    ShieldCheck,
    Clock,
    Minus,
    Plus,
    UtensilsCrossed,
    LogIn,
    AlertCircle,
    MessageSquare,
    Send,
} from "lucide-react";

export interface MenuDetails {
    _id: string;
    name: string;
    images: string[];
    category: string;
    description: string;
    price: number;
    location: string;
    status: "pending" | "approved" | "rejected";
    isActive: boolean;
    vendor: {
        _id: string;
        name: string;
        image?: string;
        location?: string;
        premium?: boolean;
    };
}

type UserRole = "customer" | "vendor" | "admin";

interface CurrentUser {
    _id: string;
    role: UserRole;
}

interface ItemDetailsProps {
    item: MenuDetails;
    currentUser: CurrentUser | null;
}

export default function ItemDetails({
    item,
    currentUser,
}: ItemDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [ordering, setOrdering] = useState(false);
    const [message, setMessage] = useState("");
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);

    const todayDate = new Date();
    const today = `${todayDate.getFullYear()}-${String(
        todayDate.getMonth() + 1
    ).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

    const isAvailable =
        item.status === "approved" && item.isActive;

    const isOwnItem =
        currentUser?.role === "vendor" &&
        currentUser._id === item.vendor._id;

    const isCustomer = currentUser?.role === "customer";

    const canOrder =
        isAvailable && isCustomer && !isOwnItem;

    const totalPrice = item.price * quantity;

    const handleOrder = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!currentUser) {
            window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(
                `/menu/${item._id}`
            )}`;
            return;
        }

        if (currentUser.role !== "customer") {
            setMessage(
                currentUser.role === "vendor"
                    ? isOwnItem
                        ? "You cannot order your own menu items."
                        : "Vendor accounts cannot place customer orders."
                    : "Admin accounts cannot place customer orders."
            );
            return;
        }

        if (!isAvailable) {
            setMessage("This item is currently unavailable.");
            return;
        }

        if (!deliveryDate) {
            setMessage("Please choose a delivery date.");
            return;
        }

        if (deliveryDate < today) {
            setMessage("The delivery date cannot be in the past.");
            return;
        }

        if (deliveryAddress.trim().length < 5) {
            setMessage("Please enter a complete delivery address.");
            return;
        }

        try {
            setOrdering(true);

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    itemId: item._id,
                    quantity,
                    deliveryDate,
                    deliveryAddress: deliveryAddress.trim(),
                    message: specialInstructions.trim(),
                }),
            });

            const data = (await response.json()) as { message?: string };

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to place your order."
                );
            }

            setMessage(
                data.message || "Your order has been placed successfully!"
            );
            setOrderPlaced(true);
            setShowOrderForm(false);
            setDeliveryDate("");
            setDeliveryAddress("");
            setSpecialInstructions("");
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setOrdering(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Back Navigation */}
                <Link
                    href="/menu"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-600"
                >
                    <ArrowLeft size={18} />
                    Back to Menu
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">

                    {/* Image Gallery */}
                    <div className="lg:col-span-7">
                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-sm">

                            <div className="relative h-[280px] overflow-hidden rounded-2xl bg-gray-100 sm:h-[420px] lg:h-[490px]">
                                <img
                                    src={item.images[selectedImage] || "/placeholder-pizza.jpg"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />

                                <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow">
                                    {item.category}
                                </span>

                                {isAvailable ? (
                                    <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-2 text-xs font-bold text-white shadow">
                                        <CheckCircle2 size={15} />
                                        Available
                                    </span>
                                ) : (
                                    <span className="absolute right-5 top-5 rounded-full bg-gray-800 px-3 py-2 text-xs font-bold text-white shadow">
                                        Unavailable
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {item.images.length > 1 && (
                                <div className="mt-3 flex gap-3 overflow-x-auto p-1">
                                    {item.images.map((image, index) => (
                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            onClick={() => setSelectedImage(index)}
                                            className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-28 ${selectedImage === index
                                                    ? "border-orange-500"
                                                    : "border-transparent opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${item.name} image ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-xl font-extrabold text-gray-900">
                                About This Item
                            </h2>

                            <p className="mt-4 text-sm leading-8 text-gray-500 sm:text-base">
                                {item.description}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                                    <UtensilsCrossed size={16} />
                                    {item.category}
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                                    <MapPin size={16} />
                                    {item.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product Information and Order */}
                    <div className="lg:col-span-5">

                        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

                            <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
                                PizzaHub Menu
                            </p>

                            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                                {item.name}
                            </h1>

                            <div className="mt-5 flex items-center gap-3">
                                <span className="text-3xl font-extrabold text-orange-500">
                                    ৳{item.price.toLocaleString("en-BD")}
                                </span>
                                <span className="text-sm text-gray-400">
                                    / item
                                </span>
                            </div>

                            <div className="my-7 border-t border-gray-100" />

                            {/* Restaurant Information */}
                            <div>
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400">
                                    Restaurant Information
                                </h3>

                                <div className="flex items-center gap-4">
                                    {item.vendor.image ? (
                                        <img
                                            src={item.vendor.image}
                                            alt={item.vendor.name}
                                            className="h-14 w-14 rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                            <Store size={25} />
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate font-bold text-gray-900">
                                                {item.vendor.name}
                                            </p>
                                            {item.vendor.premium ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                                                    Premium
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                                            <MapPin size={14} />
                                            {item.vendor.location || item.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="my-7 border-t border-gray-100" />

                            {/* Quantity */}
                            {isAvailable && (
                                <div className="mb-6">
                                    <p className="mb-3 text-sm font-bold text-gray-800">
                                        Select Quantity
                                    </p>

                                    <div className="flex w-fit items-center gap-5 rounded-xl border border-gray-200 p-2">
                                        <button
                                            type="button"
                                            disabled={quantity <= 1 || ordering}
                                            onClick={() =>
                                                setQuantity((previous) => Math.max(1, previous - 1))
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40"
                                        >
                                            <Minus size={17} />
                                        </button>

                                        <span className="min-w-6 text-center font-bold text-gray-900">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={quantity >= 10 || ordering}
                                            onClick={() =>
                                                setQuantity((previous) => Math.min(10, previous + 1))
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40"
                                        >
                                            <Plus size={17} />
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Maximum 10 items per order
                                    </p>
                                </div>
                            )}

                            {/* Total */}
                            {isAvailable && (
                                <div className="mb-6 flex items-center justify-between rounded-xl bg-orange-50 p-4">
                                    <span className="text-sm font-semibold text-gray-600">
                                        Total Price
                                    </span>
                                    <span className="text-xl font-extrabold text-orange-600">
                                        ৳{totalPrice.toLocaleString("en-BD")}
                                    </span>
                                </div>
                            )}

                            {/* Order Messages */}
                            {message && (
                                <div
                                    role="status"
                                    className="mb-5 flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700"
                                >
                                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                    {message}
                                </div>
                            )}

                            {/* Order Button */}
                            {!isAvailable ? (
                                <div className="rounded-xl bg-gray-100 p-4 text-center text-sm font-semibold text-gray-500">
                                    This menu item is currently unavailable.
                                </div>
                            ) : !currentUser ? (
                                <Link
                                    href={`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${item._id}`)}`}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                                >
                                    <LogIn size={20} />
                                    Sign In to Order
                                    <ArrowRight size={19} />
                                </Link>
                            ) : currentUser.role === "admin" ? (
                                <div className="rounded-xl bg-gray-100 p-4 text-center text-sm font-semibold text-gray-500">
                                    Admin accounts cannot place customer orders.
                                </div>
                            ) : currentUser.role === "vendor" ? (
                                <div className="rounded-xl bg-gray-100 p-4 text-center text-sm font-semibold text-gray-500">
                                    {isOwnItem
                                        ? "You cannot order your own menu items."
                                        : "Vendor accounts cannot place customer orders."}
                                </div>
                            ) : (
                                orderPlaced ? (
                                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
                                        <CheckCircle2 className="mx-auto size-9 text-green-600" />
                                        <p className="mt-2 font-bold text-green-800">
                                            Order placed
                                        </p>
                                        <p className="mt-1 text-sm text-green-700">
                                            The restaurant will review your
                                            request shortly.
                                        </p>
                                        <Link
                                            href="/dashboard/customer/orders"
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                                        >
                                            Track my orders
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                ) : !showOrderForm ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMessage("");
                                            setShowOrderForm(true);
                                        }}
                                        disabled={!canOrder || ordering}
                                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <ShoppingBag size={20} />
                                        Order Now
                                        <ArrowRight size={19} />
                                    </button>
                                ) : (
                                    <form
                                        onSubmit={handleOrder}
                                        className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-gray-800">
                                                Delivery details
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowOrderForm(false)
                                                }
                                                className="text-xs font-semibold text-gray-500 hover:text-orange-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="deliveryDate"
                                                className="mb-1.5 block text-xs font-bold text-gray-700"
                                            >
                                                Delivery date{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <CalendarDays
                                                    size={17}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                />
                                                <input
                                                    id="deliveryDate"
                                                    type="date"
                                                    min={today}
                                                    required
                                                    value={deliveryDate}
                                                    onChange={(event) =>
                                                        setDeliveryDate(
                                                            event.target.value
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="deliveryAddress"
                                                className="mb-1.5 block text-xs font-bold text-gray-700"
                                            >
                                                Delivery address{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                id="deliveryAddress"
                                                required
                                                rows={3}
                                                maxLength={500}
                                                value={deliveryAddress}
                                                onChange={(event) =>
                                                    setDeliveryAddress(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="House, road, area, city"
                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="orderMessage"
                                                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-gray-700"
                                            >
                                                <MessageSquare size={14} />
                                                Additional message / special
                                                instructions
                                            </label>
                                            <textarea
                                                id="orderMessage"
                                                rows={2}
                                                maxLength={1000}
                                                value={specialInstructions}
                                                onChange={(event) =>
                                                    setSpecialInstructions(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Optional: extra cheese, no onions, call on arrival..."
                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between rounded-xl bg-white p-3 text-sm">
                                            <span className="font-semibold text-gray-600">
                                                Total ({quantity} item
                                                {quantity > 1 ? "s" : ""})
                                            </span>
                                            <span className="text-lg font-extrabold text-orange-600">
                                                ৳
                                                {totalPrice.toLocaleString(
                                                    "en-BD"
                                                )}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={ordering}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Send size={18} />
                                            {ordering
                                                ? "Placing order..."
                                                : "Place order"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={ordering}
                                            onClick={() =>
                                                setMessage(
                                                    "Online card payment is not enabled yet. Your order will be paid directly to the restaurant on delivery."
                                                )
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <CreditCard size={18} />
                                            Pay with card
                                        </button>

                                        <p className="text-center text-[11px] text-gray-400">
                                            The restaurant reviews every order.
                                            Pending orders can be cancelled from
                                            your dashboard.
                                        </p>
                                    </form>
                                )
                            )}

                            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <ShieldCheck size={16} className="text-green-500" />
                                Secure ordering through PizzaHub
                            </div>
                        </div>

                        {/* Extra Information */}
                        <div className="mt-5 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-gray-100 bg-white p-4">
                                <Clock className="mb-3 text-orange-500" size={23} />
                                <p className="text-sm font-bold text-gray-800">
                                    Freshly Prepared
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Prepared by the restaurant
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-white p-4">
                                <ShieldCheck className="mb-3 text-orange-500" size={23} />
                                <p className="text-sm font-bold text-gray-800">
                                    Verified Vendor
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Approved PizzaHub partner
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
