# 🍽️ SimbiEat — Food Ordering System for Hostel Canteens

> A full-stack web application that brings a seamless food ordering experience to hostel canteens — built for students, managed by admins.

**🌐 Live Demo:** [symbi-eat-pearl.vercel.app](https://symbi-eat-pearl.vercel.app)  
**📦 Repository:** [github.com/faraj2003/SimbiEat-Project](https://github.com/faraj2003/SimbiEat-Project)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)
- [API Overview](#-api-overview)
- [Authentication & Authorization](#-authentication--authorization)
- [Payment Integration](#-payment-integration)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🧾 Overview

SimbiEat is a comprehensive food ordering platform designed specifically for hostel canteen environments. Students can browse the canteen menu, add items to their cart with custom instructions, place orders, and track their delivery status in real time. On the other side, canteen administrators get a dedicated dashboard to manage the menu, monitor incoming orders, and analyze sales data.

The project is built with **Next.js 15** (App Router), **MongoDB** via Mongoose, **NextAuth.js** for authentication, and a full **shadcn/ui** + **Tailwind CSS** component library for a polished, responsive UI.

---

## ✨ Features

### For Students (Users)
- **User Authentication** — Secure sign-up, login, and session management via NextAuth.js
- **Menu Browsing** — View all available food items with images, descriptions, and prices
- **Shopping Cart** — Add/remove items, adjust quantities, and leave special preparation instructions per item
- **Checkout & Order Placement** — Complete orders with delivery details
- **Order Tracking** — Real-time order status updates from preparation through to delivery
- **Order History** — View all past orders and their statuses

### For Admins
- **Admin Dashboard** — Centralized control panel with stats and analytics (powered by Recharts)
- **Food Item Management** — Add, edit, and remove menu items; upload item images
- **Order Management** — View and update the status of all incoming orders
- **User Management** — Browse all registered users with order statistics

### General
- **Role-based Access Control** — Middleware-protected routes: `/admin/*` restricted to admin users, `/cart`, `/checkout`, `/orders/*`, and `/profile/*` require authentication
- **Payment Integration** — Razorpay payment gateway integration for secure, real-time order payments. Supports UPI, cards, net banking, and wallets out of the box
- **Email Notifications** — Nodemailer for transactional emails
- **Responsive Design** — Fully functional on desktop and mobile
- **Dark Mode Support** — via `next-themes`
- **Toast Notifications** — via Sonner

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15.2.4 (App Router) |
| **Language** | TypeScript |
| **Frontend** | React 19, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB + Mongoose |
| **Authentication** | NextAuth.js (JWT strategy) |
| **Payments** | Razorpay |
| **Email** | Nodemailer |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
SimbiEat-Project/
├── app/                        # Next.js App Router
│   ├── (pages)/                # Route segments (menu, cart, checkout, orders, profile)
│   ├── admin/                  # Admin-only pages (dashboard, orders, food items, users)
│   ├── api/                    # API route handlers
│   │   ├── auth/               # NextAuth configuration
│   │   ├── food/               # CRUD for food items
│   │   ├── orders/             # Order creation and status updates
│   │   ├── users/              # User management
│   │   └── upload/             # Image upload handler
│   └── auth/                   # Login / Register pages
├── components/                 # Reusable UI components
│   └── ui/                     # shadcn/ui primitives
├── context/                    # React Context providers (cart, etc.)
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions, MongoDB connection
├── models/                     # Mongoose schemas (User, FoodItem, Order)
├── public/                     # Static assets and uploaded food images
├── styles/                     # Global CSS
├── types/                      # TypeScript type definitions
├── middleware.ts               # Route protection logic
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **MongoDB** — local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

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

Create a `.env.local` file in the root directory (see [Environment Variables](#-environment-variables) below).

**4. Seed the database**

```bash
npm run seed
```

This populates the database with initial food items and the default admin/user accounts.

**5. Start the development server**

```bash
npm run dev
```

**6. Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following:

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

Alternatively, you can register a new user account directly from the app.

---

## 📡 API Overview

All API routes live under `/app/api/`. Key endpoints:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/food` | Fetch all food items | No |
| `POST` | `/api/food` | Create a new food item | Admin |
| `PUT` | `/api/food/[id]` | Update a food item | Admin |
| `DELETE` | `/api/food/[id]` | Delete a food item | Admin |
| `POST` | `/api/orders` | Place a new order | User |
| `GET` | `/api/orders` | Get all orders (admin) or user's orders | User/Admin |
| `PUT` | `/api/orders/[id]` | Update order status | Admin |
| `POST` | `/api/payment/create-order` | Create a Razorpay order and return `order_id` | User |
| `POST` | `/api/payment/verify` | Verify Razorpay payment signature and confirm order | User |
| `GET` | `/api/users` | Get all users with stats | Admin |
| `POST` | `/api/upload` | Upload food item image | Admin |
| `POST` | `/api/auth/register` | Register a new user | No |

---

## 🛡️ Authentication & Authorization

SimbiEat uses **NextAuth.js** with a JWT strategy. Route protection is handled at the middleware layer (`middleware.ts`):

- `/admin/*` — Accessible only to users with `role: "admin"`. Any other user (or unauthenticated visitor) is redirected to `/auth/login`.
- `/cart`, `/checkout`, `/orders/*`, `/profile/*` — Require any authenticated session. Unauthenticated users are redirected to login.
- `/`, `/auth/*`, and API routes — Publicly accessible.

Passwords are hashed with **bcryptjs** before being stored in MongoDB.

---

## 💳 Payment Integration

SimbiEat uses **Razorpay** as its payment gateway, giving students a smooth, secure checkout experience without ever leaving the app.

### How it works

The payment flow follows Razorpay's recommended two-step server-side verification pattern:

1. **Order Creation** — When a student confirms their cart and proceeds to pay, the client calls `/api/payment/create-order`. The server uses the Razorpay Node SDK to create a payment order on Razorpay's end and returns an `order_id` along with the amount and currency.

2. **Checkout UI** — The client-side Razorpay checkout modal is opened using the `order_id`. The student completes payment using any supported method — UPI, debit/credit card, net banking, or wallets.

3. **Signature Verification** — On successful payment, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to the client. These are immediately forwarded to `/api/payment/verify`, where the server recomputes the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and compares it against the one provided. This step is critical — it ensures the payment response hasn't been tampered with.

4. **Order Confirmation** — Only after successful signature verification is the order marked as confirmed in MongoDB and the student shown a success screen.

### Supported Payment Methods

Razorpay supports a wide range of Indian payment methods out of the box:

- UPI (GPay, PhonePe, Paytm, etc.)
- Debit & Credit Cards (Visa, Mastercard, RuPay)
- Net Banking (50+ banks)
- Digital Wallets

### Setup

1. Create a free account at [razorpay.com](https://razorpay.com) and navigate to **Settings → API Keys**.
2. Generate a key pair and add both values to your `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
```

> **Note:** Use `rzp_test_` keys during development — no real money is charged. Switch to `rzp_live_` keys only in production.

3. For testing payments locally, use Razorpay's test card details:
   - Card: `4111 1111 1111 1111`
   - Expiry: any future date
   - CVV: any 3 digits
   - OTP: `1234`

---

## ☁️ Deployment

The project is deployed on **Vercel** and is live at [symbi-eat-pearl.vercel.app](https://symbi-eat-pearl.vercel.app).

To deploy your own instance:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add all required environment variables in Vercel's project settings.
4. Deploy — Vercel auto-detects Next.js and handles the build.

The `next.config.mjs` has `ignoreBuildErrors: true` and `unoptimized: true` for images, which ensures a smooth Vercel deployment without strict TypeScript/ESLint build gates.

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for full details.

---

> Built with ❤️ for hostel life. Hungry? [Order now →](https://symbi-eat-pearl.vercel.app)
