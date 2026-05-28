# 🍽️ SimbiEat — Food Ordering System for Hostel Canteens

A full-stack web application that brings a seamless food ordering experience to hostel canteens — built for students, managed by admins.

🌐 **Live Demo:** [symbi-eat-pearl.vercel.app](https://symbi-eat-pearl.vercel.app)
📦 **Repository:** [github.com/faraj2003/SimbiEat-Project](https://github.com/faraj2003/SimbiEat-Project)

---

## 🤝 Credits & Collaboration

This project was developed collaboratively with:

- Tejas Lahade
- Karan Kamble
- Hrithik Rayapati

📂 **Original Base Project:** [github.com/tejas2912/Symbi-Eat](https://github.com/tejas2912/Symbi-Eat)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)
- [Seeding the Database](#-seeding-the-database)
- [API Overview](#-api-overview)
- [Authentication & Authorization](#️-authentication--authorization)
- [Payment Integration](#-payment-integration)
- [Deployment](#️-deployment)
- [License](#-license)

---

## 🧾 Overview

SimbiEat is a comprehensive food ordering platform designed specifically for hostel canteen environments. Students can browse the canteen menu, add items to their cart with custom instructions, apply discount coupons, place orders, and track their delivery status in real time. Canteen administrators get a dedicated dashboard to manage the menu, monitor incoming orders, and analyze sales data.

The project is built with **Next.js 15** (App Router), **MongoDB** via Mongoose, **NextAuth.js** for authentication, and a full **shadcn/ui + Tailwind CSS** component library for a polished, responsive UI.

---

## ✨ Features

### For Students (Users)

- **User Authentication** — Secure sign-up, login, and session management via NextAuth.js
- **Menu Browsing** — View all available food items with images, descriptions, and prices
- **Shopping Cart** — Add/remove items, adjust quantities, and leave special preparation instructions per item
- **Coupon Discounts** — Apply discount codes at checkout; the system validates minimum order values and caps the maximum discount
- **Checkout & Order Placement** — Complete orders with delivery instructions and payment via Razorpay
- **Order Confirmation** — Dedicated confirmation screen after successful payment
- **Order Tracking** — Real-time order status updates (Pending → Preparing → Ready → Completed)
- **Order History** — View all past orders and their statuses

### For Admins

- **Admin Dashboard** — Centralized control panel with stats and analytics (powered by Recharts), including today's revenue, pending order count, and a 7-day orders/revenue chart
- **Food Item Management** — Add, edit, and remove menu items; upload item images
- **Order Management** — View and update the status of all incoming orders
- **User Management** — Browse all registered users with per-user order counts and total spend
- **Coupon Management** — Create and manage discount coupons with percentage discounts, max-discount caps, minimum order values, and optional expiry dates

### General

- **Role-based Access Control** — Middleware-protected routes: `/admin/*` restricted to admins, `/cart`, `/checkout`, `/orders/*`, and `/profile/*` require any authenticated session
- **Payment Integration** — Razorpay payment gateway supporting UPI, cards, net banking, and wallets
- **Email Notifications** — Transactional emails via Nodemailer
- **Responsive Design** — Fully functional on desktop and mobile
- **Dark Mode Support** — via next-themes
- **Toast Notifications** — via Sonner

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.4 (App Router) |
| Language | TypeScript (with one legacy JS model — `FoodItem.js`) |
| Frontend | React 19, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Authentication | NextAuth.js v4 (JWT strategy) |
| Payments | Razorpay |
| Email | Nodemailer |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## 📁 Project Structure

```
SimbiEat-Project/
├── app/
│   ├── admin/                  # Admin-only pages
│   │   ├── components/         # Admin sidebar and shared components
│   │   ├── food-items/         # Menu management page
│   │   ├── orders/             # Order list and order detail pages
│   │   ├── users/              # User list page
│   │   └── page.tsx            # Admin dashboard (stats + charts)
│   ├── api/
│   │   ├── admin/
│   │   │   ├── stats/          # Dashboard analytics endpoint
│   │   │   └── users/          # User management endpoint
│   │   ├── auth/
│   │   │   ├── [...nextauth]/  # NextAuth configuration
│   │   │   └── register/       # New user registration
│   │   ├── coupons/            # Coupon CRUD + /validate endpoint
│   │   ├── food/               # Food item CRUD (by ID)
│   │   ├── food-items/         # Food item list endpoint
│   │   ├── orders/             # Order creation and status updates
│   │   ├── payment/
│   │   │   ├── create-order/   # Create Razorpay order
│   │   │   └── verify/         # Verify Razorpay payment signature
│   │   ├── seed/               # Database seed endpoint (see Seeding section)
│   │   └── upload/             # Image upload handler
│   ├── auth/                   # Login / Register pages
│   ├── cart/                   # Cart page
│   ├── checkout/               # Checkout page
│   ├── confirmation/           # Post-payment confirmation page
│   └── orders/                 # Order history and tracking
├── components/
│   └── ui/                     # shadcn/ui primitives
├── context/                    # React Context providers (cart, etc.)
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions, MongoDB connection, auth config
├── models/                     # Mongoose schemas (User, FoodItem, Order, Coupon)
├── public/                     # Static assets and uploaded food images
├── styles/                     # Global CSS
├── types/                      # TypeScript type definitions
├── middleware.ts                # Route protection logic
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.18 or higher** (required by Next.js 15)
- **MongoDB** — local instance or a MongoDB Atlas cluster

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/faraj2003/SimbiEat-Project.git
cd SimbiEat-Project
```

**2. Install dependencies**

```bash
npm install
# or
pnpm install
```

**3. Configure environment variables**

Create a `.env.local` file in the project root. See [Environment Variables](#-environment-variables) below.

**4. Seed the database**

See the [Seeding the Database](#-seeding-the-database) section below for instructions.

**5. Start the development server**

```bash
npm run dev
```

**6.** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/simbieat

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Razorpay — required for payment integration
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Nodemailer (optional — for email notifications)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

For production on Vercel, set these as environment variables in your Vercel project settings.

---

## 🔑 Demo Credentials

The seeded database includes two test accounts:

**Admin Account**
```
Email:    admin@simbieat.com
Password: admin123
```

**Regular User Account**
```
Email:    user@simbieat.com
Password: user123
```

You can also register a new account from the app's sign-up page.

---

## 🌱 Seeding the Database

There is no `npm run seed` script. Seeding is done via an HTTP endpoint.

> ⚠️ **Warning:** The seed endpoint **deletes all existing data** in the `users`, `foodItems`, and `coupons` collections before inserting fresh records. Do not run this against a database with data you want to keep.

With the development server running, visit the following URL in your browser (or use curl):

```
http://localhost:3000/api/seed
```

This will populate the database with:

- 8 food items (biryanis, curries, dosas, fried rice, noodles)
- 2 discount coupons (`WELCOME20` and `FLAT50`)
- The two demo user accounts listed above

---

## 📡 API Overview

All API routes live under `/app/api/`. Key endpoints:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/food` | Fetch all food items | No |
| POST | `/api/food` | Create a new food item | Admin |
| PUT | `/api/food/[id]` | Update a food item | Admin |
| DELETE | `/api/food/[id]` | Delete a food item | Admin |
| POST | `/api/orders` | Place a new order | User |
| GET | `/api/orders` | Get all orders (admin) or user's own orders | User/Admin |
| PUT | `/api/orders/[id]` | Update order status | Admin |
| POST | `/api/payment/create-order` | Create a Razorpay order and return `order_id` | User |
| POST | `/api/payment/verify` | Verify Razorpay payment signature and confirm order | User |
| GET | `/api/coupons` | Fetch all coupons | No |
| POST | `/api/coupons` | Create a new coupon | Admin |
| PUT | `/api/coupons/[id]` | Update a coupon | Admin |
| DELETE | `/api/coupons/[id]` | Delete a coupon | Admin |
| POST | `/api/coupons/validate` | Validate a coupon code against an order total | No |
| GET | `/api/admin/stats` | Dashboard analytics (revenue, orders by day, etc.) | Admin |
| GET | `/api/admin/users` | All users with order count and total spend | Admin |
| POST | `/api/upload` | Upload food item image | Admin |
| POST | `/api/auth/register` | Register a new user | No |

---

## 🛡️ Authentication & Authorization

SimbiEat uses **NextAuth.js v4** with a JWT strategy. Route protection is handled at the middleware layer (`middleware.ts`):

- `/admin/*` — Accessible only to users with `role: "admin"`. All others are redirected to `/auth/login`.
- `/cart`, `/checkout`, `/orders/*`, `/profile/*` — Require any authenticated session. Unauthenticated users are redirected to login.
- `/`, `/auth/*`, and API routes — Publicly accessible.

Passwords are hashed with **bcryptjs** before being stored in MongoDB. The `User` model handles hashing automatically via a `pre-save` hook.

---

## 💳 Payment Integration

SimbiEat uses **Razorpay** as its payment gateway.

### How It Works

The payment flow follows Razorpay's recommended two-step server-side verification pattern:

1. **Order Creation** — When a student confirms their cart, the client calls `/api/payment/create-order`. The server uses the Razorpay Node SDK to create a payment order and returns an `order_id` along with the amount and currency.

2. **Checkout UI** — The client-side Razorpay checkout modal opens using the `order_id`. The student completes payment via any supported method.

3. **Signature Verification** — On successful payment, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to the client. These are forwarded to `/api/payment/verify`, where the server recomputes the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and compares it against the provided value. This ensures the payment response hasn't been tampered with.

4. **Order Confirmation** — Only after a successful signature verification is the order saved to MongoDB and the student redirected to the confirmation screen.

### Supported Payment Methods

- UPI (GPay, PhonePe, Paytm, etc.)
- Debit & Credit Cards (Visa, Mastercard, RuPay)
- Net Banking (50+ banks)
- Digital Wallets

### Setup

1. Create a free account at [razorpay.com](https://razorpay.com) and go to **Settings → API Keys**.
2. Generate a key pair and add both values to your `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
```

Use `rzp_test_` keys during development — no real money is charged. Switch to `rzp_live_` keys only in production.

### Test Card Details

| Field | Value |
|---|---|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | 1234 |

---

## ☁️ Deployment

The project is deployed on Vercel and is live at [symbi-eat-pearl.vercel.app](https://symbi-eat-pearl.vercel.app).

To deploy your own instance:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add all required environment variables in Vercel's project settings.
4. Deploy — Vercel auto-detects Next.js and handles the build.

`next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`, which allows the project to build on Vercel without failing on any existing type or lint errors. Images also use `unoptimized: true` for compatibility with static hosting.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for full details.

---

*Built with ❤️ for hostel life.*
