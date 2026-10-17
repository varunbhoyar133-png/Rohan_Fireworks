# Rohan Fireworks — Premium Fireworks Store & Admin Portal

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-10b981)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/Status-Production%20Ready-amber)](#)

A polished, high-performance web platform for **Rohan Fireworks**, an Indian fireworks brand. Features a festive storefront aesthetic, catalogue discovery, an enquiry-based quotation workflow compliant with regional fireworks regulations, and a protected administrative dashboard for managing products, inventory audit history, categories, customer enquiries, and store settings.

---

## 🌟 Highlights & Features

### 1. Brand Identity & Visual Design
- **Festive Aesthetic:** Deep midnight navy backgrounds (`#060913`, `#0B0F19`) accented with warm gold, amber, and festive orange.
- **Brand Logo:** Distinct text logo treatment for **ROHAN FIREWORKS** with an animated festive spark symbol.
- **Green Cracker Verification:** Highlights CSIR-NEERI approved formulations, safe viewing distances, and sound decibel ratings on all products.
- **Responsive & Accessible:** Fully optimized across mobile, tablet, and desktop screens with smooth micro-interactions.

### 2. Storefront Homepage
- **Dynamic Announcement Bar:** Real-time festive greetings and delivery notices, configurable via the admin dashboard.
- **Hero Section:** Official headline: *"Celebrate Every Moment with Rohan Fireworks"* with *"Explore Collection"* CTA.
- **Category Showcase:** Cards linking to Sparklers (Phuljhadi), Flower Pots (Anar), Ground Chakkars, Sky Rockets, Aerial Multi-Shot Cakes, Festive Gift Boxes, and Kids Novelties.
- **Featured Fireworks:** Product cards featuring INR (`₹`) pricing, pack sizes, stock status badges, and quick-view modals.
- **Promotional Offer Banner:** Admin-editable seasonal campaign section.
- **About Rohan Fireworks:** Customer-focused business story emphasizing quality testing, safe storage, and transparent pricing without fabricated claims.
- **Contact & Store Locator:** Phone assistance, direct WhatsApp chat link, physical store address, and business hours.
- **Statutory Safety & Compliance:** Complete safety guidelines, Dos and Don'ts, and legal notices adhering to the Indian Explosives Act.

### 3. Product Catalogue & Festive Enquiry Cart
- **Fast Filtering & Search:** Search by firework name or SKU (`RF-SPK-01`), category pills, price and alphabetical sorting, and "In Stock Only" toggle.
- **Dedicated Product Page:** Detailed gallery, pack contents, visual effect, sound level, safe viewing distance advisory, and related items.
- **Festive Enquiry Wishlist Drawer:** 
  - Slide-in cart showing selected fireworks, item quantities, and real-time total in INR (`₹`).
  - **One-Click WhatsApp Quotation:** Formats an itemized message sent directly to the store's WhatsApp number.
  - **Submit Festive Enquiry Form:** Collects customer name, mobile, delivery city/address, and festival occasion; saves to database and triggers a celebratory sparkle animation with a reference code (`RF-ENQ-2026-XXXX`).

### 4. Protected Admin Dashboard (`/admin`)
- **Secure Authentication:** Protected routes with JWT tokens, password hashing with bcrypt, and login rate limiting.
- **Overview Dashboard:** Total products, units in physical stock, inventory valuation in INR (`₹`), low-stock warnings, and recent enquiries.
- **Product Management:**
  - Add, edit, and delete products (with double-confirmation modal).
  - Image file uploads or external URLs with live preview.
  - Manage name, SKU (uniqueness validated), category, description, price, stock, low-stock threshold, sound level, green cracker verification, visibility toggle, and featured flag.
- **Inventory Management & Audit Trail:**
  - Real-time stock counts with low-stock warnings.
  - Stock adjustment modal (+/- stock) with reasons (Received Festive Shipment, Store Floor Sale, Damaged/Discarded, Stock Audit, Customer Return).
  - Strict guard against negative inventory.
  - Complete persistent inventory audit log (timestamp, previous stock, change, new quantity, reason, operator).
- **Category Management:**
  - Add, edit, and delete categories with images and custom slugs.
  - **Dependency Protection:** Prevents category deletion if products are assigned, displaying a warning with linked product names.
- **Customer Enquiry Management:**
  - Filter inquiries by status (*New*, *Contacted*, *Confirmed*, *Fulfilled*, *Cancelled*).
  - Search by customer name, phone, city, or reference number.
  - View itemized bill breakdown.
  - Update status and internal admin notes.
  - One-click direct WhatsApp reply to the customer.
- **Store Settings:**
  - Edit store name, logo text, tagline, phone, WhatsApp number, email, address, and business hours.
  - Toggle announcement bar and promotional banner.
  - Update statutory safety policies.
  - Change administrator password securely.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express, Helmet, CORS, Morgan, Multer (file uploads), Express Rate Limit |
| **Database** | MongoDB Atlas with Mongoose (with automatic in-memory fallback for instant zero-config local run) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt password hashing |
| **Hosting Ready** | Vercel (Frontend), Node.js / Render / Railway / Heroku (Backend), MongoDB Atlas (Cloud Database) |

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js** v18+ installed on your system.
- NPM v9+

### 2. Installation
Clone the repository and install dependencies for both frontend and backend:
```bash
# Install all dependencies
npm run install:all
```

### 3. Launch Development Server
```bash
# Runs both backend API (port 5000) and frontend Vite server (port 5173)
npm run dev
```

> **Note on Database Zero-Configuration:**
> The backend automatically checks for a MongoDB Atlas or local MongoDB URI. If none is active, it seamlessly launches an embedded in-memory MongoDB engine and seeds the database with the default administrator, 7 festive categories, 16 authentic products, default store settings, and sample customer enquiries. You can test immediately without setting up an external database first!

Visit the application in your browser:
- **Storefront:** [http://localhost:5173/](http://localhost:5173/)
- **Catalogue:** [http://localhost:5173/shop](http://localhost:5173/shop)
- **Admin Portal:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Default Administrator Credentials

Use these credentials to log in to `/admin/login`:

- **Email:** `admin@rohanfireworks.com`
- **Password:** `Admin@12345`

### Secure Utility to Create or Reset Admin Credentials
To create a new administrator account or reset the password via the command-line:
```bash
npm --prefix backend run create-admin
```
Follow the interactive prompts to set the administrator's name, email, and password.

---

## 🌐 Connecting to MongoDB Atlas (Production Setup)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist your server's IP address (or `0.0.0.0/0` for cloud hosts).
3. Copy your MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/rohan_fireworks?retryWrites=true&w=majority`).
4. Update `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rohan_fireworks?retryWrites=true&w=majority
   JWT_SECRET=your_production_secure_jwt_secret_key_here
   CLIENT_URL=https://your-rohan-fireworks-store.vercel.app
   ```
5. Seed initial data into your MongoDB Atlas database:
   ```bash
   npm run seed
   ```

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Import the project into **Vercel**.
2. Set the **Root Directory** to `frontend`.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. In Environment Variables, set:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api` (points to your deployed backend API)
5. Deploy! Single-page routing is already pre-configured in `frontend/vercel.json`.

### Deploying Backend to Render / Railway / Node Host
1. Deploy the `backend` directory to your Node.js cloud provider (e.g. Render, Railway, DigitalOcean).
2. Set the **Start Command** to `node src/server.js`.
3. Configure the following environment variables:
   - `PORT`: `5000` (or host provided port)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A long, random cryptographic string
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://rohan-fireworks.vercel.app`)

---

## 📁 Project Directory Structure

```
Fireworks/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Atlas connection & in-memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # Admin login, profile, password change
│   │   │   ├── productController.js  # Product catalogue CRUD & search
│   │   │   ├── categoryController.js # Category management & dependency check
│   │   │   ├── inventoryController.js# Stock adjustment & audit logs
│   │   │   ├── enquiryController.js  # Wishlist enquiries & quotation management
│   │   │   └── settingsController.js # Business info, banners, policies
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT token authentication
│   │   │   ├── uploadMiddleware.js   # Image uploads with size/type validation
│   │   │   └── errorMiddleware.js    # Error handling & Mongoose duplicate check
│   │   ├── models/
│   │   │   ├── AdminUser.js          # Admin schema with bcrypt
│   │   │   ├── Category.js           # Categories schema
│   │   │   ├── Product.js            # Products schema with unique SKU
│   │   │   ├── InventoryLog.js       # Persistent stock adjustment history
│   │   │   ├── Enquiry.js            # Customer quotation enquiries
│   │   │   └── Setting.js            # Dynamic store configuration
│   │   ├── routes/                   # API endpoint routes
│   │   ├── scripts/
│   │   │   ├── seed.js               # Initial database seed script
│   │   │   └── createAdmin.js        # CLI utility to create/reset admin
│   │   └── server.js                 # Express server & CORS configuration
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # BrandLogo, ProductCard, ProductModal
│   │   │   ├── enquiry/              # EnquiryDrawer, EnquirySubmitModal
│   │   │   └── layout/               # Navbar, AnnouncementBar, Footer, AdminLayout
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Admin session context
│   │   │   ├── EnquiryContext.jsx    # Cart wishlist & WhatsApp message builder
│   │   │   └── StoreSettingsContext.jsx # Global store configuration
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Hero, categories, featured, about, contact
│   │   │   ├── Shop.jsx              # Search, category pills, price sort, grid
│   │   │   ├── ProductDetail.jsx     # Detail view, specs, safety clearance
│   │   │   ├── Categories.jsx        # Categories directory
│   │   │   ├── About.jsx             # Genuine brand story & values
│   │   │   ├── Contact.jsx           # Store address, phone, WhatsApp, form
│   │   │   ├── SafetyGuidelines.jsx  # Dos and Don'ts, clearance chart
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx    # Secure admin login
│   │   │       ├── AdminOverview.jsx # KPIs, low stock warnings, recent enquiries
│   │   │       ├── AdminProducts.jsx # Product CRUD with SKU validation
│   │   │       ├── AdminInventory.jsx# Stock adjustment & audit log history
│   │   │       ├── AdminCategories.jsx# Category CRUD & dependency protection
│   │   │       ├── AdminEnquiries.jsx # Quotation status & WhatsApp reply
│   │   │       └── AdminSettings.jsx # Persist business info & banner controls
│   │   ├── services/
│   │   │   └── api.js                # Fetch client with auth headers
│   │   ├── App.jsx                   # React Router routing
│   │   ├── main.jsx                  # Application entry point
│   │   └── index.css                 # Tailwind CSS & festive theme
│   ├── vercel.json                   # Vercel SPA routing rewrites
│   ├── vite.config.js                # Vite config with API proxy
│   └── package.json
├── .gitignore
├── package.json                      # Workspace root scripts
└── README.md
```

---

## 📜 Legal & Compliance Disclaimer

Rohan Fireworks promotes safe, responsible festivities. All fireworks listed in our catalogue adhere to CSIR-NEERI green cracker formulations in compliance with Supreme Court of India directives. Products are catalogued for quotation inquiry and regional distribution in accordance with municipal guidelines and the Indian Explosives Act.
