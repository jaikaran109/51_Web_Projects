# REST API Documentation
## Smart Food Donation Platform
- **Live Production URL:** `https://smart-food-donation-distribution-system-1.onrender.com/api`
- **Local Dev URL:** `http://localhost:5000/api`

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Marcus Vance",
    "email": "donor@example.com",
    "password": "password123",
    "role": "donor",
    "organizationName": "Grand Horizon Banquets",
    "organizationType": "Caterer & Events",
    "phone": "+1 555-0144",
    "address": {
      "street": "45 Royale Plaza",
      "city": "Metro Central",
      "state": "Metro",
      "pincode": "100002"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { "id": "...", "name": "Marcus Vance", "role": "donor" }
  }
  ```

### 1.2 User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:** `{ "email": "donor@example.com", "password": "password123" }`
- **Response (200 OK):** Returns JWT token and sanitized user profile object.

### 1.3 1-Click Demo Login
- **Endpoint:** `POST /api/auth/demo-login`
- **Access:** Public
- **Request Body:** `{ "role": "donor" }` (or `"receiver"`, `"admin"`)

### 1.4 Get Current Profile
- **Endpoint:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Private

---

## 2. Food Listing APIs (`/api/listings`)

### 2.1 Get All Listings
- **Endpoint:** `GET /api/listings`
- **Access:** Public
- **Query Parameters:** `search`, `category`, `dietary`, `status`, `sortBy`, `page`, `limit`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 6,
    "total": 12,
    "listings": [
      {
        "_id": "...",
        "title": "Vegetarian Buffet Surplus",
        "category": "Cooked Meals",
        "quantity": 65,
        "quantityUnit": "servings",
        "status": "Available",
        "urgencyScore": 85,
        "aiRiskAnalysis": { "riskLevel": "Urgent", "hoursRemaining": 3.5 }
      }
    ]
  }
  ```

### 2.2 Create Food Listing
- **Endpoint:** `POST /api/listings`
- **Headers:** `Authorization: Bearer <token>` (Donor / Admin)
- **Request Body:**
  ```json
  {
    "title": "Fresh Sourdough Loaves & Croissant Baskets",
    "category": "Bakery & Bread",
    "dietaryType": "Vegetarian",
    "quantity": 40,
    "quantityUnit": "boxes",
    "cookedTime": "2026-08-20T10:00:00.000Z",
    "expiryTime": "2026-08-21T18:00:00.000Z",
    "storageCondition": "Ambient (Room Temp)",
    "allergens": ["Gluten"],
    "pickupAddress": { "street": "12 Baker Lane", "city": "Metro East" },
    "contactPhone": "+1 555-0177"
  }
  ```

### 2.3 Get Listing by ID
- **Endpoint:** `GET /api/listings/:id`
- **Access:** Public

### 2.4 Update / Delete Listing
- **Endpoints:** `PUT /api/listings/:id`, `DELETE /api/listings/:id`
- **Headers:** `Authorization: Bearer <token>` (Owner / Admin)

---

## 3. Pickup Logistics APIs (`/api/pickups`)

### 3.1 Claim Food Listing
- **Endpoint:** `POST /api/pickups`
- **Headers:** `Authorization: Bearer <token>` (NGO / Receiver)
- **Request Body:**
  ```json
  {
    "listingId": "60d21b4667d0d8992e610c85",
    "transportMode": "Light Commercial Van",
    "volunteerCount": 2,
    "targetBeneficiaryGroup": "Urban Slum Community",
    "estimatedBeneficiariesCount": 65,
    "pickupNotes": "Arriving with insulated food boxes in 45 minutes."
  }
  ```

### 3.2 Accept Pickup Claim
- **Endpoint:** `PUT /api/pickups/:id/accept`
- **Headers:** `Authorization: Bearer <token>` (Donor Owner / Admin)

### 3.3 Mark Food Collected (Picked Up)
- **Endpoint:** `PUT /api/pickups/:id/pickup`
- **Headers:** `Authorization: Bearer <token>` (NGO Receiver / Admin)

### 3.4 Verify & Mark Delivered
- **Endpoint:** `PUT /api/pickups/:id/deliver`
- **Headers:** `Authorization: Bearer <token>` (NGO Receiver / Admin)
- **Request Body:**
  ```json
  {
    "otp": "482910",
    "deliveryNote": "65 meals distributed to shelter residents."
  }
  ```

---

## 4. Analytics & AI APIs

### 4.1 Aggregate Platform Overview
- **Endpoint:** `GET /api/analytics/overview`
- **Access:** Public

### 4.2 AI Shelf Life Recommendation
- **Endpoint:** `POST /api/ai/shelf-life`
- **Request Body:** `{ "category": "Cooked Meals", "storageCondition": "Insulated Hot Container" }`

### 4.3 AI Demand & Spoilage Forecast
- **Endpoint:** `GET /api/ai/demand-forecast`
- **Access:** Public
