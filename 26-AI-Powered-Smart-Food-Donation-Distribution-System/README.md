# Smart Food Donation Platform (SFD)
> **Full Stack MERN Web Application — Capstone Project**  
> *Connecting Surplus Food Donors with Verified NGOs via AI Demand Forecasting and Real-Time Logistics Tracking.*

---

## 🌐 Live Deployment & Links

| Service | Platform | Link | Status |
|---|---|---|---|
| **Frontend Application** | **Vercel** | [![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_App-black?style=for-the-badge&logo=vercel)](https://ai-powered-smart-food-donation-git-d38894-jaikaran109s-projects.vercel.app) | ![Vercel](https://img.shields.io/badge/Deployed-Active-brightgreen?style=flat-square) |
| **Backend REST API** | **Render** | [![Render Deployment](https://img.shields.io/badge/Render-API_Server-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://smart-food-donation-distribution-system-1.onrender.com/api/health) | ![Render](https://img.shields.io/badge/Deployed-Active-brightgreen?style=flat-square) |
| **API Base URL** | **Production** | [`https://smart-food-donation-distribution-system-1.onrender.com/api`](https://smart-food-donation-distribution-system-1.onrender.com/api) | ![API](https://img.shields.io/badge/Status-Online-brightgreen?style=flat-square) |
| **Source Code** | **GitHub** | [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/jaikaran109/AI-Powered-Smart-Food-Donation-Distribution-System) | ![Git](https://img.shields.io/badge/Branch-main-blue?style=flat-square) |
| **Deployment Guide** | **Documentation** | [Step-by-Step Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | ![Docs](https://img.shields.io/badge/Docs-Complete-blue?style=flat-square) |

---

## 🌟 Key Features

- **🔐 Robust Authentication & Role-Based Access (RBAC):**
  - Granular role isolation for **Food Donors**, **NGO Receivers**, and **Platform Administrators**.
  - Secure password hashing (`bcryptjs`) & JWT session management.
  - 1-Click Evaluation Accounts on the Login screen for instant testing.

- **🍲 Food Listing & Lifecycle Management (CRUD):**
  - Comprehensive listing attributes: food category, dietary type, quantity, cooked timestamp, expiry deadline, storage condition, and pickup location.
  - **Dynamic Urgency Scoring (0-100)** and real-time freshness badge indicators.
  - Multi-faceted search, category filtering, dietary sorting, and status toggling.

- **🚚 Real-Time Pickup Tracking & Handover Security:**
  - 4-Stage Status Pipeline: `Pending` ➔ `Accepted` ➔ `Picked Up` ➔ `Delivered`.
  - Secure **6-digit Handover OTP Verification** to ensure verified custody transfer.
  - Comprehensive audit trail and donation lifecycle event logs.

- **🗺️ Interactive Geospatial Maps:**
  - Dual explore view: Responsive Grid Feed and Interactive Leaflet (OpenStreetMap) radius map.

- **🤖 Smart AI Matchmaker & Recommendation Engine (MCDA Model):**
  - Multi-Criteria Decision Analysis (MCDA) matching algorithm to dynamically rank best-fit NGOs for any surplus batch:
    - **Geospatial Proximity (35%):** Haversine distance & travel ETA optimization ($\le 3\text{km} \rightarrow 35\text{ pts}$).
    - **Capacity & Demand Fit (30%):** Evaluates donation batch quantity vs NGO intake capacity ratio ($0.7 \le Q/C \le 1.3 \rightarrow 30\text{ pts}$).
    - **Dietary & Preservation Fit (20%):** Cold chain requirements and dietary restrictions compatibility.
    - **Reliability & Trust Index (15%):** Verified accreditation badge (+8 pts) & community historical rating (+7 pts).
  - 1-Click Donor-to-NGO Instant Dispatch Alert routing.
  - Spoilage and shelf-life degradation curve evaluation and cold chain storage safety recommendations.

- **🛡️ Admin Control Tower & Analytics:**
  - Aggregate KPIs (Meals saved, kg food rescued, CO2 avoided, community value).
  - User moderation and 1-click NGO accreditation verification.
  - Platform audit trail and listing moderation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router DOM v6, Lucide Icons, Leaflet / React-Leaflet, Chart.js |
| **Backend** | Node.js, Express.js RESTful API, Express-Validator |
| **Database** | MongoDB & Mongoose ODM (8 Collections with Geospatial Indexes) |
| **Auth & Security** | JSON Web Tokens (JWT), bcryptjs, CORS |
| **Styling** | Custom Vanilla CSS Design System with Dark/Light Theme & Glassmorphism |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 or a MongoDB Atlas URI

### 1. Installation
Install all dependencies for root, backend, and frontend with a single command:
```bash
npm run install:all
```
*(Or navigate to `backend/` and `frontend/` and run `npm install` in each)*

### 2. Seed Database with Realistic Data
Populate realistic Donors, NGOs, Listings, Pickup lifecycles, and Analytics:
```bash
npm run seed
```

### 3. Run Development Servers
Start both backend API (`http://localhost:5000`) and frontend Vite dev server (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

---

## 🔑 Pre-Configured Demo Accounts

For rapid evaluation, use the 1-click buttons on the Login page or log in manually:

| Role | Email | Password | Organization |
|---|---|---|---|
| **Donor** | `donor@tajkitchens.com` | `password123` | Grand Horizon Banquets & Catering |
| **Donor** | `bakery@artisangold.com` | `password123` | Artisan Gold Bakery & Patisserie |
| **NGO** | `ngo@foodforall.ngo` | `password123` | Food For All Relief Foundation (Verified) |
| **NGO** | `shelter@hopecommunity.ngo` | `password123` | Hope Children & Homeless Shelter |
| **Admin** | `admin@smartfood.org` | `password123` | Smart Food Donation Platform |

---

## 📁 Repository Structure

```
SFD-Anti/
├── backend/
│   ├── src/
│   │   ├── config/ (MongoDB connection)
│   │   ├── models/ (8 Mongoose models: User, FoodListing, PickupRequest, Category, etc.)
│   │   ├── middleware/ (JWT Auth, RBAC, Central Error Handler, Validator)
│   │   ├── controllers/ (Auth, Listings, Pickups, Analytics, AI, Users, Reviews)
│   │   ├── routes/ (REST API endpoints)
│   │   ├── utils/ (AI Predictor, Activity Logger, Database Seeder)
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ (Navbar, Footer, StatCards, ListingCards, FoodMap, Timelines, AI Widgets)
│   │   ├── context/ (AuthContext, NotificationContext, ThemeContext)
│   │   ├── pages/ (12 Pages: Home, Listings, Details, Create, Dashboards, AI Studio, Impact, Auth)
│   │   ├── services/ (Centralized Axios/Fetch API client)
│   │   ├── styles/ (Modern design system: dark/light theme, glassmorphism)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── docs/
│   ├── SRS.md (IEEE 830 compliant Software Requirements Specification)
│   ├── API_DOCUMENTATION.md (Full REST API schemas)
│   └── DATABASE_DESIGN.md (ER diagrams & schemas)
├── package.json (Concurrently orchestration)
└── README.md
```

---

## 📄 Documentation
- [Software Requirements Specification (SRS)](docs/SRS.md)
- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [Database Architecture & Design](docs/DATABASE_DESIGN.md)

---

## 📜 License
MIT License. Built for Capstone Project Demonstration. 
