import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
    title: "Help Center",
    description:
        "Step-by-step help for PizzaHub customers, vendors and administrators, including orders, menu approval, accounts and payments.",
};

export default function HelpPage() {
    return (
        <ContentPage
            eyebrow="Help center"
            title="How can we help?"
            description="Quick guides for the most common tasks on PizzaHub. Choose the section that matches your account type."
            cta={{ label: "Contact us", href: "/contact" }}
            sections={[
                {
                    heading: "For customers",
                    body: [
                        "Create a customer account from the sign-up page, then browse the public menu. Any item you open shows the restaurant, price and delivery location.",
                    ],
                    bullets: [
                        "Track every order from Dashboard → My orders.",
                        "Only pending orders can be cancelled; accepted orders are already being prepared.",
                        "Update your name and profile picture from Account settings.",
                    ],
                },
                {
                    heading: "For vendors",
                    body: [
                        "Choose Vendor when you sign up, then complete your restaurant profile. A complete profile is required before you can publish menu items.",
                    ],
                    bullets: [
                        "Add up to three active items on the Free plan; upgrade to Premium for unlimited items.",
                        "Upload up to five images per item. The first image is used as the cover.",
                        "Accept or reject an order once — decisions are permanent.",
                    ],
                },
                {
                    heading: "For administrators",
                    body: [
                        "Administrators get a marketplace overview with live statistics, user management, menu moderation and read-only transaction history.",
                    ],
                    bullets: [
                        "Search and filter users, then block or unblock accounts.",
                        "Approve, reject or delete submitted menu items.",
                        "Blocked users are signed out immediately and cannot place orders.",
                    ],
                },
                {
                    heading: "Payments and subscriptions",
                    body: [
                        "Premium is purchased through Stripe Checkout. Card details are entered on Stripe's secure page and never touch PizzaHub servers.",
                        "A vendor is upgraded only after the signed Stripe webhook confirms payment, so a cancelled or failed checkout never grants Premium.",
                    ],
                },
                {
                    heading: "Account access",
                    body: [
                        "If you can't sign in, check that the email and password match the account you created. Google accounts must use the Continue with Google button.",
                        "Blocked accounts see a dedicated message and must contact support to be restored.",
                    ],
                },
            ]}
        />
    );
}
