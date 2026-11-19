# PizzaHub — Pizza Ordering & Delivery Platform

PizzaHub is a full-stack, role-based pizza ordering platform. Customers discover
local pizzerias, browse approved menu items, and place delivery orders. Vendors
manage their restaurant, menu and incoming orders, and can buy a Premium
subscription through Stripe Checkout. Admins manage users, review menu items and
monitor subscription transactions.

- **Frontend:** Next.js App Router + ShadCN UI (this repository)
- **Backend:** Express + MongoDB (`../pizza-hub-server`)
- **Live site:** _add the deployed frontend URL here_
- **Client repository:** _add the GitHub URL here_
- **Server repository:** _add the GitHub URL here_

> The rubric requires live links and at least 20 client / 12 server meaningful
> commits. Add the deployed URLs above after publishing.

## Features

### Public

- Landing page with hero, featured menu items (Premium vendors first), six pizza
  categories, benefits and "how it works" sections.
- Browse Menu with advanced search (name, category, location and restaurant),
  category/location filters, price sorting (low → high, high → low), loading
  skeletons and an empty state.
- About and Contact pages; the contact form validates input and opens a
  pre-filled email draft.
- Dark / light mode toggle (optional feature #2).

### Authentication & authorization

- Better Auth email + password and Google OAuth.
- Sign-up role choice (Customer or Vendor); admins are provisioned out-of-band.
- Password policy: 6+ characters with upper/lowercase letters.
- Blocked users are rejected on the server, not just hidden in the UI.
- Role-aware Navbar: avatar dropdown for signed-in users, Sign In / Sign Up for
  guests.
- Route guards for every dashboard, plus server-side role checks in every Server
  Action and API route.

### Customer

- Dashboard overview with order statistics.
- View item details; ordering requires a signed-in Customer.
- Track orders, view order details, cancel pending orders.
- Update name and profile image without being able to change role or plan.

### Vendor

- Restaurant profile management.
- Menu item CRUD with image upload, pending → approved/rejected review flow.
- Free plan limited to 3 active items; Premium unlocks unlimited items, a badge
  and featured placement.
- Accept/reject pending orders; only the owning vendor can act on an order.
- Stripe Checkout subscription page with success/cancel pages.

### Admin

- Platform statistics for users, vendors, customers, menu items, pending reviews
  and transactions.
- Search users, filter by role, block/unblock accounts.
- Review, approve, reject, search and delete menu items.
- Read-only transaction history (payment records cannot be edited).

## Tech stack

| Area | Packages |
| --- | --- |
| Frontend | `next` 16 (App Router, Server Actions), `react` 19, `typescript` |
| UI | `tailwindcss`, `shadcn`, `radix-ui`, `lucide-react`, `sonner` |
| Auth | `better-auth` (email/password + Google), `mongodb` adapter |
| Data | `mongodb` driver |
| Payments | `stripe` (Express backend Checkout + webhooks) |
| Theming | `next-themes` |
| Tooling | `eslint`, `eslint-config-next`, `@tailwindcss/turbopack` |

Backend packages: `express`, `cors`, `mongodb`, `better-auth`, `stripe`,
`jsonwebtoken`, `dotenv`, `typescript`.

## Environment variables

Create `.env` in **each** repository. Never commit `.env` files.

### `pizza-hub` (frontend)

```bash
NEXT_PUBLIC_API_URL=http://localhost:7000
MONGODB_URL=mongodb+srv://...
BETTER_AUTH_SECRET=<shared secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
```

### `pizza-hub-server` (backend)

```bash
MONGODB_URL=mongodb+srv://...
BETTER_AUTH_SECRET=<same value as the frontend>
BETTER_AUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
PORT=7000
PUBLIC_API_URL=http://localhost:7000
JWT_SECRET=<random string, at least 16 characters>
JWT_TTL_SECONDS=3600

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=bdt
STRIPE_UNIT_AMOUNT=49900
```

Generate a JWT secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

## Running locally

```bash
# terminal 1 — Express API (port 7000)
cd pizza-hub-server
npm install
npm run dev

# terminal 2 — Next.js app (port 3000)
cd pizza-hub
npm install
npm run dev
```

Open <http://localhost:3000>.

### Stripe webhook (Premium)

```bash
stripe listen --forward-to localhost:7000/api/payments/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`, restart the API,
then upgrade a vendor using test card `4242 4242 4242 4242`. Premium is activated
**only** by the signature-verified webhook; the browser success redirect never
changes the plan.

## Challenge implementations

### Challenge 1 — advanced search and price sorting

Browse Menu (`src/components/Menu/BrowseMenu.tsx`) starts from the approved,
active menu items supplied by the server page and applies a memoized pipeline:

1. **Search** checks the lower-cased query against item name, category, location
   and vendor name, so a pizza, a city or a restaurant name all match.
2. **Filters** narrow by exact category and location from selects populated from
   the loaded data set.
3. **Sorting** supports `Newest` (default), `Price: Low to High`,
   `Price: High to Low` and `Name: A to Z`. The sort value is part of component
   state, and "Clear filters" resets filters **and** sort order.

The result count updates live, and the empty state explains how to broaden the
search. All data is loaded once, so filtering and sorting are instant and do not
trigger extra network round-trips.

### Challenge 2 — JWT verification middleware (Express)

The Express API issues and verifies its own short-lived tokens while Better Auth
remains the source of truth for identity:

1. The browser signs in with Better Auth (HTTP-only session cookie).
2. `POST /api/auth/token` (`pizza-hub-server/tokens.ts`) reads that cookie with
   `auth.api.getSession`, rejects missing/blocked accounts, and signs an HS256
   JWT (`sub` = user id, plus name/email/role) with `JWT_SECRET`, issuer
   `pizza-hub-server`, audience `pizza-hub-client` and `JWT_TTL_SECONDS`.
3. `src/lib/api-client.ts` caches the token in memory, sends it as
   `Authorization: Bearer <token>`, and retries once after a forced refresh if
   the API answers `401`.
4. `requireAuth` (`pizza-hub-server/jwt.ts`) verifies the signature, algorithm,
   expiry, issuer and audience, then re-reads the user from MongoDB. A deleted or
   blocked account is rejected and the **role always comes from the database**,
   so a stale or tampered token cannot keep old privileges.
5. `requireRole("customer")` / `requireRole("vendor")` gate routes:
   - `POST /api/orders` → any authenticated user, then Customer only
   - `GET /api/orders` → authenticated users (returns only their own orders)
   - `POST /api/payments/checkout` → Vendor only
6. Ownership is always re-checked in the handler/database query. Requests carry
   no client-supplied user id or role:
   - customers can only see their own orders and cannot order their own items;
   - a vendor's checkout session is created from the verified token, so one
     vendor can never pay for another;
   - admins cannot place customer orders.

Responses use `401` for missing/invalid/expired tokens and `403` for valid
tokens with the wrong role or a blocked account.

## API routes (Express)

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/api/auth/token` | Better Auth session cookie |
| `GET` | `/api/orders` | JWT (own orders) |
| `POST` | `/api/orders` | JWT + Customer role |
| `POST` | `/api/payments/checkout` | JWT + Vendor role |
| `POST` | `/api/payments/webhook` | Stripe signature |
| `POST` | `/api/uploads` | Session upload guard |
| `GET` | `/api/images/:id` | Public image bytes |

## UX states and error handling

- `src/app/loading.tsx` — route-level loader; the dashboard has a matching
  skeleton in `src/app/dashboard/loading.tsx`.
- `src/app/error.tsx` — client error boundary with retry and a digest reference.
- `src/app/not-found.tsx` — custom 404 page.
- Sonner toasts (`<Toaster />` in the root layout) report success and failure for
  sign-in/sign-up, menu and profile forms, vendor/admin actions, image upload,
  order placement, cancellations and Stripe checkout. Inline form messages are
  kept for accessibility; no `alert()` calls are used.

## Scripts

```bash
npm run dev     # start the Next.js dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Notes

- Menu and profile images are uploaded through the Express API and stored in
  MongoDB, then served from `GET /api/images/:id`. No third-party image host is
  required; set `PUBLIC_API_URL` to the deployed API origin in production.
- Customer orders are paid on delivery; Stripe is used only for vendor Premium
  subscriptions, as required by the assignment.
