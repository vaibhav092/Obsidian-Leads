# 🎯 LeadMS - Lead Management System

A modern lead management app built with React, Node.js, and Prisma. Features dark UI, real-time data, and secure authentication.

## ✨ Features
- 🔐 JWT authentication with protected routes
- 📊 CRUD operations for leads with advanced filtering
- 🎨 Dark theme with AG Grid data tables
- 🔒 Secure API with CORS protection
- 📱 Responsive design for all devices

## 🚀 Quick Start

### Backend Setup
```bash
cd Server
npm install
# Set up .env with DATABASE_URL and JWT_SECRET
npx prisma generate && npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd Client
npm install
npm run dev
```

## 🔧 Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/leadms"
JWT_SECRET="your-secret-key"
PORT=3000
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📊 Database Schema

**Users**: id, firstName, lastName, email, password, createdAt  
**Leads**: id, firstName, lastName, email, phone, company, city, state, source, status, score, leadValue, isQualified, userId, createdAt

## 🔌 Key API Endpoints

**Auth**: `/api/users/login`, `/api/users/register`, `/api/users/logout`  
**Leads**: `GET/POST /api/leads`, `PUT/DELETE /api/leads/:id`

## 🚀 Deployment

**Backend (Render)**: Connect repo, set env vars, deploy  
**Frontend (Vercel)**: Connect repo, set VITE_API_BASE_URL, deploy

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, AG Grid
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Auth**: JWT with secure cookies
- **Deploy**: Render (Backend), Vercel (Frontend)

---

**Made with ❤️ by LeadMS Team**
