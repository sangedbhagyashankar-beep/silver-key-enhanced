# Silver Key Hotel — Setup Guide

## Quick Start

### 1. Backend
```bash
cd backend
npm install
# Edit .env — set MONGO_URI, optionally set RAZORPAY and ANTHROPIC keys
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
# Edit .env — set VITE_RAZORPAY_KEY_ID if you have Razorpay
npm run dev
```

### 3. Seed the database (first time only)
```bash
cd backend
node src/config/seed.js
```

---

## Fixes Applied

### 1. Login/Logout
- **Logout** now works even with an expired access token (uses refresh cookie)
- Auth routes restructured so logout doesn't require `protect` middleware

### 2. My Bookings Page
- Fixed route ordering in Express: `/my` route was conflicting with `/:bookingId` param route
- Bookings now match by both `userId` AND `guest.email` (so pre-login bookings appear)
- Proper error handling and loading states

### 3. Room Booking Flow
- Fixed booking creation response to return `bookingId` properly
- Guest form auto-fills from logged-in user's profile
- Razorpay SDK loaded in `index.html` (was missing)
- Payment step now works in both real (Razorpay) and demo mode

### 4. Real AI Chatbot
- Chatbot now uses **Claude AI** (claude-haiku) when `ANTHROPIC_API_KEY` is set
- Falls back to keyword matching if no API key
- Fixed quick-reply race condition (was setting input state then calling sendMessage before re-render)

### 5. Razorpay Integration
- Added `<script src="https://checkout.razorpay.com/v1/checkout.js">` to index.html
- Payment verification uses signature check only when real keys are present
- Demo mode clearly indicated to user

---

## Configuration

### Razorpay (Real Payments)
1. Create account at https://dashboard.razorpay.com
2. Go to Settings → API Keys → Generate Test Key
3. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
4. Add to `frontend/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   ```

### AI Chatbot
1. Get key from https://console.anthropic.com
2. Add to `backend/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxx
   ```

---

## Default Admin Login
After seeding, an admin account is created:
- **Email:** admin@silverkey.com  
- **Password:** Admin@123456

