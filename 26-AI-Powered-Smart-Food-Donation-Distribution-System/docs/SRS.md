# Software Requirements Specification (SRS)
## Project: Smart Food Donation Platform (SFD)
**Category:** Full Stack Web Application — Capstone Project  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  

---

## 1. Introduction

### 1.1 Purpose
The purpose of the **Smart Food Donation Platform** is to eliminate food wastage and combat hunger by providing a centralized, transparent, and technology-driven channel connecting food surplus donors (caterers, restaurants, banquets, supermarkets, event organizers) with verified Non-Governmental Organizations (NGOs) and relief shelters.

### 1.2 Scope
The system encompasses:
- Role-based registration and authentication (Donor, NGO / Receiver, Administrator) with JWT & RBAC.
- Full CRUD food listing lifecycle management with real-time freshness tracking and storage advisory.
- Interactive geospatial map view (Leaflet OpenStreetMap) and radius discovery.
- 4-stage logistics and donation pickup lifecycle (`Pending` -> `Accepted` -> `Picked Up` -> `Delivered`).
- Secure custody transfer using 6-digit OTP verification.
- Smart AI demand forecasting and spoilage degradation risk analysis.
- Administrative moderation, analytics dashboards, and complete activity audit logging.

### 1.3 Definitions & Acronyms
- **MERN:** MongoDB, Express.js, React.js, Node.js
- **RBAC:** Role-Based Access Control
- **JWT:** JSON Web Token
- **NGO:** Non-Governmental Organization
- **OTP:** One-Time Password

---

## 2. Overall Description

### 2.1 User Classes & Characteristics
1. **Food Donor:** Commercial restaurants, banquet halls, event organizers, and households who post surplus food details, review incoming pickup requests, accept claims, generate handover OTPs, and monitor impact statistics.
2. **NGO / Receiver:** Verified charities, shelter homes, community kitchens, and relief volunteers who browse available surplus food, submit pickup claims, manage logistics vehicles, update delivery status, and verify handover.
3. **Administrator:** System moderators who verify NGO credentials, moderate food listings, manage user accounts, inspect audit trails, and oversee aggregate platform analytics.

### 2.2 System Architecture
The application follows a decoupled Client-Server architecture:
- **Frontend Layer:** React.js (SPA) with Vite, dynamic responsive CSS design system, dark/light theme support, and Leaflet interactive maps.
- **Backend API Layer:** Node.js and Express.js RESTful API with modular controllers, middlewares, and centralized error handling.
- **Database Layer:** MongoDB with Mongoose ODM handling 8 normalized collections.

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization Module
- **FR-1.1:** The system shall allow users to register as a `donor` or `receiver` (NGO) with organization details.
- **FR-1.2:** The system shall hash user passwords using `bcryptjs` before storage.
- **FR-1.3:** The system shall authenticate users and issue signed JWT tokens for protected session management.
- **FR-1.4:** The system shall enforce RBAC restricting administrative and donor/receiver specific endpoints.

### 3.2 Food Listing Module
- **FR-2.1:** Donors shall be able to create, update, view, and delete surplus food listings.
- **FR-2.2:** Food listings must include title, category, quantity, unit, dietary classification, cooked time, expiry time, storage condition, pickup address, and contact numbers.
- **FR-2.3:** The system shall dynamically compute an **Urgency Score (0-100)** and real-time freshness status based on elapsed time and shelf-life baselines.
- **FR-2.4:** The explore page shall support multi-parameter filtering: category, dietary type, status, search keyword, and sort criteria.

### 3.3 Pickup Logistics & Tracking Module
- **FR-3.1:** Verified NGOs shall be able to claim available food listings specifying transport mode, volunteer count, target beneficiary group, and estimated beneficiaries.
- **FR-3.2:** The system shall maintain an immutable status progression: `Pending` -> `Accepted` -> `Picked Up` -> `Delivered`.
- **FR-3.3:** The system shall generate a unique 6-digit OTP code required for handover verification upon delivery.
- **FR-3.4:** Every status transition must record an audit timeline entry with timestamp, note, and updating user ID.

### 3.4 Smart AI Demand & Spoilage Prediction Module
- **FR-4.1:** The AI engine shall provide shelf-life recommendations and storage instructions based on food category and storage method.
- **FR-4.2:** The system shall forecast geographic zone demand and peak surplus time windows to optimize dispatch logistics.

### 3.5 Administrative & Analytics Module
- **FR-5.1:** Administrators shall be able to view aggregate KPIs: meals saved, food weight rescued, carbon offset, and active listings.
- **FR-5.2:** Administrators shall have authority to verify NGO credentials or deactivate non-compliant accounts.
- **FR-5.3:** The system shall log significant platform events to the `ActivityLog` collection for auditability.

---

## 4. Non-Functional Requirements
- **NFR-1 (Performance):** REST API response times must average under 200ms under standard loads.
- **NFR-2 (Security):** All private endpoints must require valid Bearer JWT tokens in request headers.
- **NFR-3 (Usability):** Fully responsive interface adapting to desktop, tablet, and mobile viewport sizes.
- **NFR-4 (Reliability):** Comprehensive error handling preventing server crashes on unhandled exceptions.
