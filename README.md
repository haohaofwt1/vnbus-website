# VNBus

VNBus is a dynamic booking-request marketplace for bus, limousine, shuttle, and cross-border coach routes across Vietnam and Southeast Asia.

It is built with:

- Next.js 16.2.0
- App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Zod validation
- Server Components and Server Actions

## Features

- SEO-first public marketplace with dynamic route, operator, destination, FAQ, and blog pages
- PostgreSQL-backed route, trip, operator, city, FAQ, blog, review, booking, payment, and audit data
- Server-validated booking request and contact inquiry flows
- Email/password admin login with httpOnly cookie sessions for ADMIN and STAFF users
- Dynamic sitemap and robots.txt
- Payment-ready architecture for Stripe Checkout hosted payments
- Odoo-ready extension points for later CRM sync

## 1. Install dependencies

```bash
npm install
```

## 2. Set up PostgreSQL with Supabase or Neon

Create a PostgreSQL database in either:

- Supabase: [https://supabase.com](https://supabase.com)
- Neon: [https://neon.tech](https://neon.tech)

Copy the connection string for the database you created.

## 3. Set `DATABASE_URL`

Create a local `.env` file from `.env.example` and set the database connection string:

```bash
cp .env.example .env
```

Update:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_SESSION_SECRET="change-this-to-a-long-random-string"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

## 4. Run Prisma generate

```bash
npm run prisma:generate
```

## 5. Run Prisma migration

```bash
npm run prisma:migrate
```

This creates the database tables from `prisma/schema.prisma`.

## 6. Seed data

```bash
npm run prisma:seed
```

The seed script creates:

- Users
- Cities and destinations
- Operators
- Vehicle types
- Routes
- Trips
- Reviews
- FAQs
- Blog posts
- CMS pages
- Booking requests
- Payments
- Lead activities
- Audit logs

## 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 8. Admin login

Admin routes are protected and require an account with role `ADMIN` or `STAFF`.

After seeding, sign in at:

- `/admin/login`

Seeded default admin credentials:

- Email: `admin@vnbus.com`
- Password: `admin123`

Change the seeded password immediately before any shared or production-like environment.

## 9. Build for production

```bash
npm run build
npm run start
```

## 10. Lint

```bash
npm run lint
```

This project uses the ESLint CLI because `next lint` was removed in Next.js 16.

## 11. Deploy to Vercel

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the production environment variables in Vercel.
4. Point `DATABASE_URL` at your production Supabase or Neon database.
5. Run the first migration against the production database.

Recommended Vercel environment variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## 12. Add environment variables in Vercel

In the Vercel project:

1. Open `Settings`
2. Open `Environment Variables`
3. Add the same keys from `.env.example`
4. Redeploy

## 13. Add a new route

Use the admin area:

- `/admin/routes`
- `/admin/routes/new`

Sign in first at `/admin/login`.

You will need:

- Slug
- From city
- To city
- Distance
- Duration
- Price from
- Currency
- SEO fields
- Status

## 14. Add a new trip

Use:

- `/admin/trips`
- `/admin/trips/new`

Sign in first at `/admin/login`.

You will need:

- Route
- Operator
- Vehicle type
- Departure and arrival times
- Price
- Pickup and drop-off points
- Seats
- Amenities
- Status

## 15. Add a new operator

Use:

- `/admin/operators`
- `/admin/operators/new`

Sign in first at `/admin/login`.

You will need:

- Name
- Slug
- Logo URL
- Description
- Rating
- Contact details
- Website
- Status

## 16. Manage booking requests

Use:

- `/admin/bookings`
- `/admin/bookings/[id]`

Sign in first at `/admin/login`.

Staff can:

- Review booking details
- Update booking status
- Add lead notes
- Review related payments
- Inspect audit logs

## 17. Payment-ready architecture

VNBus does not collect raw card details.

Current payment architecture:

- `Payment` model stores provider identifiers, amount, currency, status, and timestamps
- `/api/payments/create-checkout-session` prepares a hosted checkout session
- `/api/webhooks/stripe` verifies Stripe webhook signatures before mutating payment state
- Secret keys stay in environment variables only
- Booking and payment state transitions are written back to PostgreSQL

Current status:

- Stripe Checkout is scaffolded but intentionally left as a placeholder until real keys and final line-item logic are added
- PayPal is not implemented yet and returns a placeholder response

PCI-safe pattern:

1. Confirm booking details and amount server-side
2. Create a hosted checkout session with Stripe or PayPal
3. Redirect the customer to the hosted checkout page
4. Verify webhook signatures on return callbacks
5. Update `Payment` and `BookingRequest` status in the database

Do not add custom raw card forms unless you are prepared to take on PCI scope.

## 18. SEO architecture

Public pages are generated dynamically from database content:

- `/routes/[slug]`
- `/operators/[slug]`
- `/destinations/[slug]`
- `/blog/[slug]`

SEO features included:

- `generateMetadata`
- Canonical URLs
- Open Graph metadata
- Twitter Card metadata
- JSON-LD for Website, Organization, BreadcrumbList, FAQPage, and ItemList
- Dynamic sitemap
- Dynamic robots.txt

## 18. Odoo CRM integration later

Odoo is not implemented yet, but the project is prepared for it.

Recommended future integration points:

- In `lib/actions/booking.ts` after a `BookingRequest` is created:
  create an Odoo CRM lead
- In `app/api/webhooks/stripe/route.ts` after payment success:
  update the matching Odoo opportunity or booking record
- In admin booking status updates:
  sync booking lifecycle changes and internal notes back to Odoo

Suggested fields to sync later:

- Customer name
- Customer email
- Customer phone
- Route
- Trip
- Departure date
- Booking status
- Payment status
- Notes

## 19. Admin authentication

The admin area now uses a simple email/password authentication flow with secure
httpOnly cookie sessions.

Current behavior:

- `/admin/login` renders the admin sign-in form
- Unauthenticated users are redirected from `/admin/*` to `/admin/login`
- Users with role `ADMIN` or `STAFF` can access the admin area
- Users without those roles cannot access admin pages even if they know the URL
- Sign-out clears the session cookie and returns the user to `/admin/login`

Important auth files:

- `lib/auth.ts`
- `lib/admin-session.ts`
- `lib/actions/auth.ts`
- `app/admin/login/page.tsx`
- `middleware.ts`

## 20. Project structure

```text
app/
components/
components/admin/
lib/
lib/actions/
prisma/
public/
```

Important files:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `lib/prisma.ts`
- `lib/data.ts`
- `lib/validators.ts`
- `lib/actions/booking.ts`
- `app/api/payments/create-checkout-session/route.ts`
- `app/api/webhooks/stripe/route.ts`

## 21. Notes

- This project favors Server Components and form posts over heavy client-side state.
- Search filters remain lightweight and mostly server-rendered.
- Payment handling is prepared for hosted checkouts only.
- Route, operator, destination, FAQ, and blog content are all database-driven.
