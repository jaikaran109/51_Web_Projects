# Database Design & Architecture
## Smart Food Donation Platform (MongoDB Collections)

---

## 1. Schema Overview

The database is built on MongoDB using 8 primary normalized collections to support high-throughput donation listing, geospatial radius searching, and real-time logistics tracking.

```
+------------------+         +--------------------+         +---------------------+
|      Users       | <-----> |    FoodListings    | <-----> |   PickupRequests    |
+------------------+         +--------------------+         +---------------------+
  - _id                        - _id                          - _id
  - name                       - donorId (ref User)           - listingId (ref)
  - email                      - title                        - donorId (ref)
  - role                       - category                     - receiverId (ref)
  - organizationName           - quantity                     - status
  - location [2dsphere]        - expiryTime                   - verificationOtp
  - isVerified                 - urgencyScore                 - statusTimeline []
                               - location [2dsphere]
                               - status
```

---

## 2. Collections Specification

### 2.1 Users Collection
Stores Donors, NGO Receivers, and System Administrators with verification badges and performance metrics.
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique index)
- `password`: String (bcrypt hashed)
- `role`: Enum (`'donor'`, `'receiver'`, `'admin'`)
- `organizationName`: String
- `organizationType`: String
- `phone`: String
- `address`: { street, city, state, pincode, formattedAddress }
- `location`: { type: "Point", coordinates: [lng, lat] } (2dsphere index)
- `isVerified`: Boolean
- `verificationStatus`: Enum (`'pending'`, `'verified'`, `'rejected'`, `'unsubmitted'`)
- `metrics`: { totalDonationsCount, totalDonatedKg, totalMealsSaved, totalPickupsCompleted, rating, reviewCount }

### 2.2 FoodListings Collection
Primary module storing surplus food offers with shelf-life degradation metadata.
- `_id`: ObjectId
- `donorId`: ObjectId (ref: User)
- `donorName`: String
- `donorOrg`: String
- `title`: String
- `category`: Enum (`'Cooked Meals'`, `'Bakery & Bread'`, `'Raw Groceries'`, `'Fruits & Vegetables'`, `'Packaged & Canned'`, `'Dairy & Eggs'`, `'Beverages'`, `'Mixed Assortment'`)
- `dietaryType`: Enum (`'Vegetarian'`, `'Non-Vegetarian'`, `'Vegan'`, `'Eggitarian'`, `'Halal'`)
- `quantity`: Number
- `quantityUnit`: Enum (`'servings'`, `'kg'`, `'boxes'`, `'packets'`, `'liters'`)
- `estimatedMeals`: Number
- `cookedTime`: Date
- `expiryTime`: Date
- `storageCondition`: Enum (`'Ambient (Room Temp)'`, `'Refrigerated (0-4°C)'`, `'Frozen (-18°C)'`, `'Insulated Hot Container'`)
- `allergens`: [String]
- `images`: [String]
- `pickupAddress`: { street, city, state, pincode }
- `location`: { type: "Point", coordinates: [lng, lat] } (2dsphere index)
- `contactPhone`: String
- `status`: Enum (`'Available'`, `'Requested'`, `'Accepted'`, `'Picked Up'`, `'Delivered'`, `'Expired'`, `'Cancelled'`)
- `urgencyScore`: Number (0 - 100)
- `activeClaimId`: ObjectId (ref: PickupRequest)
- `claimedBy`: ObjectId (ref: User)

### 2.3 PickupRequests Collection
Tracks custody lifecycle and delivery handover between Donors and NGOs.
- `_id`: ObjectId
- `listingId`: ObjectId (ref: FoodListing)
- `donorId`: ObjectId (ref: User)
- `receiverId`: ObjectId (ref: User)
- `receiverName`: String
- `receiverOrg`: String
- `receiverPhone`: String
- `status`: Enum (`'Pending'`, `'Accepted'`, `'Picked Up'`, `'Delivered'`, `'Cancelled'`, `'Rejected'`)
- `estimatedPickupTime`: Date
- `actualPickupTime`: Date
- `deliveredTime`: Date
- `transportMode`: String
- `volunteerCount`: Number
- `targetBeneficiaryGroup`: String
- `estimatedBeneficiariesCount`: Number
- `verificationOtp`: String (6-digit code)
- `isOtpVerified`: Boolean
- `statusTimeline`: [{ status, timestamp, note, updatedBy }]

### 2.4 Categories Collection
Lookup table for food classes, baseline shelf-life hours, and cold-chain storage recommendations.

### 2.5 ActivityLogs Collection
Audit log trail recording all critical platform events (`USER_REGISTERED`, `LISTING_CREATED`, `PICKUP_ACCEPTED`, `PICKUP_DELIVERED`, `NGO_VERIFIED`).

### 2.6 Notifications Collection
In-app notification messages delivered to Donors and NGOs for claim status updates and alert triggers.

### 2.7 Reviews Collection
Ratings (1-5 stars) and qualitative feedback exchanged between donors and receivers post-delivery.

### 2.8 Settings Collection
Platform-wide operational thresholds (carbon offset multiplier, urgency threshold hours, maximum radius).

---

## 3. Database Indexes
- `users.email`: Unique index
- `users.location`: 2dsphere index for spatial proximity queries
- `foodlistings.location`: 2dsphere index
- `foodlistings.status + expiryTime`: Compound index for active listing queries
- `activitylogs.createdAt`: Descending sort index
