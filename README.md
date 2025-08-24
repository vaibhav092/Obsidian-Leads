# 🎯 LeadMS - Lead Management System

A modern, full-stack lead management application built with React, Node.js, and Prisma. Features a beautiful dark UI with real-time data management, advanced filtering, and secure authentication.

![LeadMS Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure cookie storage
- **Protected routes** with automatic token refresh
- **Role-based access control** for user management
- **Secure password handling** with bcrypt encryption

### 📊 Lead Management
- **CRUD operations** for leads with real-time updates
- **Advanced filtering system** with multiple operators
- **Pagination** with customizable page sizes
- **Bulk operations** for efficient data management
- **Lead scoring** and qualification tracking

### 🎨 Modern UI/UX
- **Dark theme** with gradient accents
- **Responsive design** for all devices
- **AG Grid integration** for powerful data tables
- **Real-time updates** with optimistic UI
- **Loading states** and error handling

### 🔧 Technical Features
- **RESTful API** with proper HTTP status codes
- **Database migrations** with Prisma
- **CORS configuration** for cross-origin requests
- **Cache control** headers for optimal performance
- **Error handling** with detailed logging

## 🏗️ Architecture

```
LeadMS/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── util/          # Utility functions & API
│   │   └── services/      # Business logic services
│   └── public/            # Static assets
└── Server/                # Node.js Backend
    ├── Controller/        # Route controllers
    ├── Middleware/        # Custom middleware
    ├── Router/           # API routes
    ├── lib/              # Database & utilities
    └── prisma/           # Database schema & migrations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/LeadMS.git
cd LeadMS
```

### 2. Backend Setup
```bash
cd Server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd Client
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/leadms"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📊 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- firstName (String)
- lastName (String)
- email (String, Unique)
- password (String, Hashed)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Leads Table
```sql
- id (UUID, Primary Key)
- firstName (String)
- lastName (String)
- email (String)
- phone (String, Optional)
- company (String, Optional)
- city (String, Optional)
- state (String, Optional)
- source (Enum)
- status (Enum)
- score (Integer)
- leadValue (Decimal, Optional)
- isQualified (Boolean)
- userId (UUID, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)
- lastActivityAt (DateTime, Optional)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/refresh` - Refresh access token
- `GET /api/users/logout` - User logout
- `GET /api/users/me` - Get current user profile
- `GET /api/users/islogin` - Check login status

### Leads Management
- `GET /api/leads` - Get all leads (with pagination & filtering)
- `GET /api/leads/:id` - Get specific lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/user/:userId` - Get leads by user

## 🎨 UI Components

### Core Components
- **LeadModal** - Create/Edit lead form
- **FilterField** - Advanced filtering interface
- **ProtectedRoute** - Authentication wrapper
- **DarkTheme** - Theme configuration
- **Logout** - User logout component

### UI Library
- **Button** - Styled button components
- **Card** - Content container
- **Input** - Form input fields
- **Label** - Form labels
- **Badge** - Status indicators
- **Tabs** - Tab navigation

## 🔒 Security Features

- **JWT Authentication** with secure cookie storage
- **Password Hashing** using bcrypt
- **CORS Protection** with configurable origins
- **Input Validation** on both client and server
- **SQL Injection Prevention** with Prisma ORM
- **XSS Protection** with proper content encoding

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with Node.js build command: `npm install && npx prisma generate && npx prisma migrate deploy`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables for production API URL
3. Deploy with build command: `npm run build`

## 🛠️ Development

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma client
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Structure
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Main application pages in `src/pages/`
- **Context**: Global state management in `src/context/`
- **API**: API utilities and configurations in `src/util/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AG Grid** for powerful data table functionality
- **Tailwind CSS** for utility-first styling
- **Prisma** for type-safe database access
- **React** for the amazing frontend framework
- **Node.js** for the robust backend runtime

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@leadms.com
- Documentation: [docs.leadms.com](https://docs.leadms.com)

---

**Made with ❤️ by the LeadMS Team**
