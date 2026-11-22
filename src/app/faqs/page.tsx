import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
    title: "FAQs",
    description:
        "Answers to the most common PizzaHub questions about ordering, vendor accounts, menu approval, Premium subscriptions and payments.",
};

export default function FaqsPage() {
    return (
        <ContentPage
            eyebrow="Support"
            title="Frequently asked questions"
            description="Everything you need to know about ordering, selling and managing your PizzaHub account."
            cta={{ label: "Contact support", href: "/contact" }}
            sections={[
                {
                    heading: "How do I place an order?",
                    body: [
                        "Sign in with a customer account, browse the menu, open any approved item and choose Place order. Pick a delivery date, confirm your address and the restaurant will accept or reject the request.",
                    ],
                    bullets: [
                        "Only one active (pending or accepted) order is allowed at a time per customer.",
                        "Pending orders can be cancelled from your dashboard, accepted orders cannot.",
                        "Orders are paid directly to the restaurant on delivery.",
                    ],
                },
                {
                    heading: "Why can't I see my menu item?",
                    body: [
                        "Every new or updated menu item goes through admin review. It appears on the public menu only after an administrator approves it.",
                    ],
                    bullets: [
                        "Pending — submitted and waiting for review.",
                        "Approved — visible to customers.",
                        "Rejected — hidden until you fix and resubmit it.",
                        "Inactive — approved but temporarily unavailable.",
                    ],
                },
                {
                    heading: "What does the Free vendor plan include?",
                    body: [
                        "Free vendor accounts can keep up to three active menu items. Active means pending review or approved and available.",
                        "Premium removes that limit and adds a Premium badge, featured placement on the home page and priority review.",
                    ],
                },
                {
                    heading: "How does Premium billing work?",
                    body: [
                        "Premium is a one-time 30-day purchase handled by Stripe Checkout. Your vendor account is upgraded only after Stripe confirms the payment through a signed webhook — never from the browser redirect alone.",
                        "You can cancel auto-continuation from the subscription page. Premium stays active until the end of the period you already paid for.",
                    ],
                },
                {
                    heading: "How do I create an administrator account?",
                    body: [
                        "Administrator accounts cannot be created from the public sign-up form. An existing administrator assigns that role directly, which keeps marketplace moderation and user blocking locked down.",
                    ],
                },
                {
                    heading: "How do I reset my password?",
                    body: [
                        "Sign in with Google if your account uses Google, or contact support from the registered email address. Password rules: at least six characters with one uppercase and one lowercase letter.",
                    ],
                },
            ]}
        />
    );
}
