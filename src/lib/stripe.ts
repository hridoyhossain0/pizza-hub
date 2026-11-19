import "server-only";

import Stripe from "stripe";

/**
 * Server-only Stripe client.
 *
 * The secret key is read exclusively on the server. `getStripe()` returns
 * `null` when Stripe has not been configured yet so that pages and actions can
 * show a clear message instead of crashing the whole app.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe | null {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

    if (!secretKey) {
        return null;
    }

    if (!client) {
        client = new Stripe(secretKey);
    }

    return client;
}

export function requireStripe(): Stripe {
    const stripe = getStripe();

    if (!stripe) {
        throw new Error(
            "Stripe is not configured yet. Add STRIPE_SECRET_KEY to the .env file and restart the server."
        );
    }

    return stripe;
}

export const STRIPE_NOT_CONFIGURED_MESSAGE =
    "Payments are not configured yet. Add STRIPE_SECRET_KEY to the .env file and restart the server.";

export interface PremiumPriceConfig {
    /** ISO currency code, always lowercase (Stripe requirement). */
    currency: string;
    /** Amount in the currency's minor unit (e.g. 49900 = ৳499.00). */
    unitAmount: number;
}

/**
 * Premium price configuration. Defaults to BDT 499 because the dashboard
 * displays ৳499. Override with STRIPE_CURRENCY / STRIPE_UNIT_AMOUNT when the
 * Stripe account needs to charge in another currency.
 */
export function getPremiumPriceConfig(): PremiumPriceConfig {
    const currency = (process.env.STRIPE_CURRENCY?.trim() || "bdt").toLowerCase();
    const unitAmount = Number(process.env.STRIPE_UNIT_AMOUNT?.trim() || 49900);

    if (!/^[a-z]{3}$/.test(currency)) {
        throw new Error(
            "STRIPE_CURRENCY must be a three-letter ISO currency code such as bdt or usd."
        );
    }

    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
        throw new Error(
            "STRIPE_UNIT_AMOUNT must be a positive integer in the currency's minor unit."
        );
    }

    return { currency, unitAmount };
}

/** Converts a Stripe minor-unit amount into a human-readable amount. */
export function fromMinorUnit(amount: number | null | undefined): number {
    if (!amount) {
        return 0;
    }

    return Math.round(amount) / 100;
}
