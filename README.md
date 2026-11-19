This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Stripe Premium setup

Premium upgrades use Stripe Checkout (one-time payment for a 30-day period). Stripe is only used for vendor subscriptions; customer orders keep the existing cash-on-delivery flow.

The payment API lives in the Express backend at `../pizza-hub-server` (port `7000`). The Next.js app only calls it from the browser and reads the saved payment result.

1. Add the frontend API URL to `pizza-hub/.env`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:7000
```

2. In `pizza-hub-server/.env`, add the shared auth secret and Stripe keys:

```bash
BETTER_AUTH_SECRET=<same value as the frontend>
BETTER_AUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=bdt
STRIPE_UNIT_AMOUNT=49900   # ৳499.00 in minor units
```

3. Start both apps:

```bash
# terminal 1 — backend API
cd pizza-hub-server && npm run dev

# terminal 2 — frontend
cd pizza-hub && npm run dev
```

4. Forward webhooks to the Express server while developing:

```bash
stripe listen --forward-to localhost:7000/api/payments/webhook
```

5. Use the test card `4242 4242 4242 4242`, any future expiry date and any CVC.

Premium is activated **only** by the signature-verified webhook in the Express server. The success page cannot activate a plan; it only reads the transaction the webhook saved. Checkout sessions are always created from the authenticated vendor session, and the vendor id is never read from the request body.

Menu and profile images are uploaded through the Express API (`POST /api/uploads`) and stored in MongoDB, then served from `GET /api/images/:id`. No third-party image host or API key is required. Set `PUBLIC_API_URL` in `pizza-hub-server/.env` to the public API origin so stored image links work in production.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
