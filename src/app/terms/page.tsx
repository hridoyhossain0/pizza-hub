import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "The rules for using PizzaHub as a customer, vendor or administrator.",
};

export default function TermsPage() {
    return (
        <ContentPage
            eyebrow="Legal"
            title="Terms & conditions"
            description="By creating an account or using PizzaHub you agree to these terms. Please read them carefully."
            sections={[
                {
                    heading: "Accounts",
                    body: [
                        "You must provide accurate information and keep your credentials secure. You are responsible for activity performed with your account.",
                    ],
                    bullets: [
                        "One account per person. Accounts may not be sold or shared.",
                        "You must be old enough to form a binding contract in your jurisdiction.",
                        "Administrator accounts are assigned by PizzaHub and never through public sign-up.",
                    ],
                },
                {
                    heading: "Orders and fulfilment",
                    body: [
                        "PizzaHub connects customers with independent restaurants. Each restaurant is responsible for the food it prepares, its pricing, its availability and delivering accepted orders.",
                        "A customer may hold one active order at a time. Pending orders may be cancelled; once a restaurant accepts an order the restaurant begins preparing it and cancellation is no longer available.",
                    ],
                },
                {
                    heading: "Vendor obligations",
                    body: [
                        "Vendors must keep their restaurant profile and menu accurate, hold any licences required to sell food, and handle orders promptly and lawfully.",
                    ],
                    bullets: [
                        "Menu items are reviewed before publication and may be rejected or removed.",
                        "The Free plan is limited to three active items. Premium adds unlimited items, a badge and featured placement.",
                        "Premium is a 30-day purchase. Access ends when the paid period ends unless renewed.",
                    ],
                },
                {
                    heading: "Payments",
                    body: [
                        "Food orders are paid directly to the restaurant on delivery. Premium subscriptions are charged through Stripe, and access is granted only after Stripe confirms the payment.",
                    ],
                },
                {
                    heading: "Prohibited behaviour",
                    body: [
                        "Do not attempt to access other accounts, submit unlawful or misleading content, manipulate reviews or orders, scrape the service, or interfere with its security. Accounts that violate these rules may be blocked without notice.",
                    ],
                },
                {
                    heading: "Changes and liability",
                    body: [
                        "PizzaHub may update features or these terms. Material changes will be communicated through the service. The platform is provided on an as-is basis to the extent permitted by law, and nothing here limits rights you have under applicable consumer law.",
                    ],
                },
            ]}
        />
    );
}
