# 🏨 Silver Key Hotel — Full Stack Booking System

A complete hotel booking web app built with React + Node.js + MongoDB.

## Quick Start

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- MongoDB Community Server (https://www.mongodb.com/try/download/community)

### 1. Start MongoDB
Make sure MongoDB service is running on your machine.  
Open **Services** (Win+R → `services.msc`) → Start **MongoDB Server**.

Or verify with: `mongod --version`

### 2. Install & Run Backend
```bash
cd backend
npm install --legacy-peer-deps
# .env file is already included with local MongoDB settings
npm run dev
```
Expected output:
```
info: MongoDB Connected
info: 🏨 Silver Key Hotel API running on port 5000 [development]
```

### 3. Install & Run Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

## Features
- **Room browsing** with filters and search
- **Booking wizard** — dates → guest info → payment
- **Authentication** — register, login, JWT tokens
- **Admin dashboard** — stats, revenue charts, bookings table
- **Gallery** with lightbox
- **Chatbot** with auto-responses
- **Email notifications** (configure SMTP in .env)

## Optional Services (add keys to backend/.env to enable)
| Feature | Keys needed |
|---------|-------------|
| Razorpay payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Email notifications | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` |
| Image uploads | `CLOUDINARY_*` keys |
| WhatsApp notifications | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` |

Without these keys the app still works in **demo mode** — payments are simulated, emails are logged to console.

## Make yourself Admin
1. Register an account at http://localhost:5173/register
2. Open **MongoDB Compass** → connect to `mongodb://127.0.0.1:27017`
3. Open database `silverkeyhotel` → collection `users`
4. Find your document → change `"role": "user"` to `"role": "admin"` → Save
5. Log out and log back in → you'll be redirected to `/admin`

## Project Structure
```
silver-key-hotel/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Email, payment, WhatsApp
│   │   └── utils/          # Logger, AppError, pricing
│   ├── .env                # Local environment (edit this)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API client (axios)
│   │   └── store/          # Zustand state management
│   └── package.json
└── docker-compose.yml      # Optional Docker setup
```
