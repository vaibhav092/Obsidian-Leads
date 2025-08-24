# 🎯Obsidian Leads - Lead Management System

A full-stack Leads CRM system built with React (Vite + Tailwind + AG Grid) on the frontend and Express.js + JWT Auth on the backend.
It allows secure user authentication, lead management (CRUD), server-side pagination & filtering, and a sleek modern UI.

🚀 Features

🔐 Authentication

Register / Login / Logout with JWT (httpOnly cookies)

Bcrypt-hashed passwords

Protected routes, 401 handling

👥 Lead Management

Create, Read, Update, Delete (CRUD) leads

Unique email validation

Enum-based status and source

Score (0–100) & Lead Value

Last Activity Date tracking

📑 API Features

Server-side pagination (page, limit)

Filtering (string, enum, number, date, boolean)

RESTful routes with proper HTTP codes

🎨 Frontend (React + Tailwind + AG Grid)

Modern UI with dark + blue translucent theme

Editable grid with API integration

Sorting, filtering, pagination on UI

Responsive layout

⚡ Deployment Ready

Fully deployable backend + frontend + DB stack

Works on any cloud (Render, Railway, Vercel, Netlify, etc.)

🛠️ Tech Stack

Frontend:

React (Vite)

TailwindCSS + ShadCN UI

AG Grid (custom dark/blue theme)

React Router

Backend:

Node.js + Express

JWT Auth (httpOnly cookies)

Bcrypt (password hashing)

Helmet + Rate Limiting (security)

Database:

PostgreSQL / MySQL / MongoDB (choose your DB)

📡 API Endpoints
Auth

POST /api/auth/register → Register user

POST /api/auth/login → Login & set JWT cookie

POST /api/auth/logout → Clear cookie

GET /api/auth/current-user → Get logged-in user

Leads

GET /api/leads → List leads with pagination/filtering

GET /api/leads/:id → Get lead by ID

POST /api/leads → Create lead

PUT /api/leads/:id → Update lead

DELETE /api/leads/:id → Delete lead

GET /api/leads/user/:userId → Leads for specific user

⚙️ Setup & Installation

Clone Repo

git clone https://github.com/your-username/leads-crm.git
cd leads-crm


Backend Setup

cd server
npm install
npm run dev


Create .env in server/ with:

PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret


Frontend Setup

cd client
npm install
npm run dev


Open http://localhost:5173 🎉
