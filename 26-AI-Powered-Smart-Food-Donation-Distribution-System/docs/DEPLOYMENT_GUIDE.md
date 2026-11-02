# Deployment Guide — Smart Food Donation Platform (SFD)

This guide walks through deploying the SFD full-stack application for **free** on modern cloud hosting platforms.

---

## 🌐 Recommended Deployment Options

| Architecture | Frontend | Backend | Database | Cost |
|---|---|---|---|---|
| **Option 1 (Recommended)** | [Vercel](https://vercel.com) | [Render](https://render.com) | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | 100% Free |
| **Option 2 (All-in-One)** | Built into Backend | [Render](https://render.com) | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | 100% Free |

---

## Step 1: Set Up Free Cloud Database (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a free **M0 Shared Cluster** (e.g. AWS / Mumbai or closest region).
3. Under **Database Access**, create a user (e.g., `sfd_admin` and a strong password).
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Go to **Clusters ➔ Connect ➔ Drivers (Node.js)** and copy your connection string:
   ```
   mongodb+srv://sfd_admin:<password>@cluster0.abcde.mongodb.net/smart_food_donation?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

1. Push your repository to your GitHub account.
2. Log in to [render.com](https://render.com) and click **New ➔ Web Service**.
3. Connect your GitHub repository.
4. Fill in the settings:
   - **Name:** `smart-food-donation-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String from Step 1>`
   - `JWT_SECRET`: `<Your Random Strong Secret String>`
   - `JWT_EXPIRE`: `30d`
6. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://smart-food-donation-backend.onrender.com`).

---

## Step 3: Deploy Frontend to Vercel

1. Log in to [vercel.com](https://vercel.com) and click **Add New ➔ Project**.
2. Import your GitHub repository.
3. In project configuration:
   - **Root Directory:** Edit and select `frontend`.
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://smart-food-donation-backend.onrender.com/api` *(Your deployed Render backend URL + `/api`)*
5. Click **Deploy**. Your frontend is live with an SSL domain!

---

## Step 4: Seed Cloud Database (Optional)

To seed your production MongoDB Atlas database with realistic demo accounts:
```bash
# In your local terminal or Render shell:
MONGODB_URI="your_atlas_connection_string" npm run seed
```
