import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "How PizzaHub collects, uses and protects customer, vendor and administrator data.",
};

export default function PrivacyPolicyPage() {
    return (
        <ContentPage
            eyebrow="Legal"
            title="Privacy policy"
            description="This policy explains what PizzaHub stores, why we store it and the choices you have. It applies to customers, vendors and administrators."
            sections={[
                {
                    heading: "Information we collect",
                    body: [
                        "Account details you provide when signing up: name, email address, optional profile picture, and the account type you choose. Vendors also provide a restaurant name, description, area, city and logo.",
                    ],
                    bullets: [
                        "Order details: items ordered, quantity, delivery date, delivery address and optional notes.",
                        "Authentication data managed by Better Auth, including session records and, where used, Google account identifiers.",
                        "Payment records: plan, amount, currency and Stripe identifiers. Card numbers are never stored by PizzaHub.",
                    ],
                },
                {
                    heading: "How we use your information",
                    body: [
                        "We use your data to operate the marketplace: to authenticate you, show relevant menu items, route orders to the correct restaurant, moderate submissions and provide account support.",
                        "Aggregated, non-identifying statistics help administrators understand marketplace activity.",
                    ],
                },
                {
                    heading: "Third-party services",
                    body: [
                        "PizzaHub relies on a small number of processors, each of which receives only what it needs to perform its function.",
                    ],
                    bullets: [
                        "MongoDB Atlas — database hosting for accounts, menu items, orders and transactions.",
                        "Stripe — checkout, payment confirmation and webhooks for The Premium subscription.",
                        "ImgBB — image hosting for menu photos and profile pictures.",
                        "Google — optional OAuth sign-in.",
                    ],
                },
                {
                    heading: "Data retention and security",
                    body: [
                        "Passwords are hashed by Better Auth and never stored in plain text. Secrets such as API keys stay on the server and are excluded from version control.",
                        "Order and transaction records are retained for accounting and dispute resolution. Account data is removed or anonymised on request where no legal obligation requires retention.",
                    ],
                },
                {
                    heading: "Your choices",
                    body: [
                        "You can update your name and profile picture at any time, and vendors can edit their restaurant profile. To request deletion of your account, contact support from your registered email address.",
                    ],
                },
                {
                    heading: "Contact",
                    body: [
                        "Questions about this policy can be sent to hello@pizzahub.com. We aim to respond within one business day.",
                    ],
                },
            ]}
        />
    );
}
