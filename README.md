# BBTA - Restaurant Management System

A comprehensive full-stack restaurant management and ordering system with separate applications for customers, staff, and administrators.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

BBTA is a full-featured restaurant management system designed to streamline operations and improve customer experience. The system consists of four main applications:

- **Client Frontend (bbta-client-fe)**: Customer-facing application for browsing menus, placing orders, and booking tables
- **Admin Frontend (bbta-admin-fe)**: Administrative dashboard for managing staff, menus, customers, and analytics
- **Staff Frontend (bbta-staff-fe)**: Kitchen and service staff interface for managing orders and operations
- **Backend API (bbta-be)**: Node.js/Express server handling all business logic and data management

## 🛠 Tech Stack

### Frontend Applications
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 7.x
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **UI Components**: 
  - Vant 4.x (Client Frontend)
  - Element Plus 2.11 (Admin & Staff Frontends)
- **HTTP Client**: Axios 1.x
- **Routing**: Vue Router 4.6
- **Node**: ^20.19.0 || >=22.12.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1
- **Language**: TypeScript 5.9
- **Database**: MongoDB (Mongoose 8.19)
- **Authentication**: bcrypt 6.0
- **CORS**: cors 2.8
- **Environment Management**: dotenv 17.2
- **Development**: Nodemon, ts-node

### Development Tools (All Projects)
- **Linting**: ESLint 9.37
- **Formatting**: Prettier 3.6
- **Type Checking**: TypeScript / vue-tsc
- **Additional Linting**: Oxlint 1.23 (Admin & Staff FE)

## 📁 Project Structure

```
bbta/
├── bbta-client-fe/          # Customer web application
│   ├── src/
│   │   ├── pages/           # Page components (TableBooking, OrderFood, etc.)
│   │   ├── router/          # Vue Router configuration
│   │   ├── stores/          # Pinia store (useAuth, etc.)
│   │   ├── plugin/          # Axios setup
│   │   ├── assets/          # CSS and images
│   │   └── utils/           # Utility functions
│   └── vite.config.ts
│
├── bbta-admin-fe/           # Admin dashboard application
│   ├── src/
│   │   ├── views/           # Admin views (Dashboard, Users, Menu, etc.)
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   ├── router/          # Admin routes
│   │   ├── plugin/          # Axios setup
│   │   ├── utils/           # Utility constants
│   │   └── assets/          # Styling and images
│   └── vite.config.ts
│
├── bbta-staff-fe/           # Staff/Kitchen interface
│   ├── src/
│   │   ├── views/           # Staff views (Kitchen, Payment, etc.)
│   │   ├── layout/          # Layout components
│   │   ├── router/          # Staff routes
│   │   ├── constant/        # App constants
│   │   ├── plugin/          # Axios setup
│   │   └── assets/          # Styling
│   └── vite.config.ts
│
├── bbta-be/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Route handlers (auth, orders, food, tables, etc.)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── models/          # Mongoose schemas
│   │   ├── middleware/      # Express middleware
│   │   ├── logger/          # Logging utilities
│   │   ├── utils/           # Helper functions
│   │   ├── app.ts           # Express app setup
│   │   ├── config.ts        # Configuration
│   │   └── index.ts         # Entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── bbta.code-workspace      # VS Code workspace configuration
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.19.0 or higher (or 22.12.0+)
- **npm**: v10+ or compatible package manager
- **MongoDB**: Local instance or MongoDB Atlas connection string
- **Git**: For version control
- **VS Code** (recommended): With extensions for Vue and TypeScript

### Recommended VS Code Extensions

- Volar (Vue Official)
- TypeScript Vue Plugin
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Element UI Helper (for Admin & Staff)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/phamthao2001/bbta.git
```

### 2. Install Dependencies for All Projects

Navigate to each project directory and install dependencies:

#### Backend Setup
```bash
cd bbta-be
npm install
```

#### Client Frontend Setup
```bash
cd ../bbta-client-fe
npm install
```

#### Admin Frontend Setup
```bash
cd ../bbta-admin-fe
npm install
```

#### Staff Frontend Setup
```bash
cd ../bbta-staff-fe
npm install
```

### 3. Configure Environment Variables

#### Backend Configuration (.env)

Create or update `bbta-be/.env`:

```env
# MongoDB Connection String
MONGOOSE_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=bbta-cluster

# API Configuration
PORT=5000
NODE_ENV=development

# Add other environment variables as needed
```

#### Frontend Configuration

Check `.env.local` or `.env` files in frontend projects if custom API endpoints are needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🎮 Running the Application

### Option 1: Run All Services Separately (Recommended for Development)

#### Terminal 1 - Backend Server
```bash
cd bbta-be
npm run dev
# Server will run on http://localhost:5000
```

#### Terminal 2 - Client Frontend
```bash
cd bbta-client-fe
npm run dev
# Client will run on http://localhost:5173 (or next available port)
```

#### Terminal 3 - Admin Frontend
```bash
cd bbta-admin-fe
npm run dev
# Admin will run on http://localhost:5174 (or next available port)
```

#### Terminal 4 - Staff Frontend
```bash
cd bbta-staff-fe
npm run dev
# Staff will run on http://localhost:5175 (or next available port)
```

### Option 2: Run Individual Projects

Each project can be run independently:

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format
```

## 🏗 Project Architecture

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
├──────────────┬──────────────────┬──────────────┬────────────┤
│ Customer FE  │   Admin FE       │   Staff FE   │  (Browser) │
│ Vue 3 + TS   │  Vue 3 + TS      │ Vue 3 + TS   │            │
├──────────────┴──────────────────┴──────────────┴────────────┤
│                    HTTP / REST API                           │
│              (Axios with CORS enabled)                       │
├─────────────────────────────────────────────────────────────┤
│                      Backend API Server                      │
│              (Node.js / Express / TypeScript)                │
├─────────────┬──────────────┬──────────────┬────────────────┤
│ Controllers │  Services    │   Models     │   Middleware   │
│ Auth        │  Business    │  MongoDB     │  CORS, Auth    │
│ Orders      │  Logic       │  Schemas     │  Error Handler │
│ Food        │              │              │                │
│ Tables      │              │              │                │
└─────────────┴──────────────┴──────────────┴────────────────┘
                            ↓
                    ┌──────────────────┐
                    │    MongoDB       │
                    │    Database      │
                    └──────────────────┘
```

### Data Flow

1. **Client Applications** make HTTP requests to the Backend API
2. **Backend API** (Express) routes requests to appropriate controllers
3. **Controllers** delegate business logic to services
4. **Services** interact with MongoDB through Mongoose models
5. **Responses** are returned to clients in JSON format

## ✨ Features

### Customer Features
- Browse restaurant menu
- Place food orders
- Book tables
- Order history
- QR code login

### Admin Features
- Manage customers and staff
- Menu management
- Order analytics
- Table management
- Dashboard with KPIs
- Staff management

### Staff Features
- View kitchen orders
- Update order status
- Process payments
- QR code scanning
- Order tracking

### Common Features
- User authentication (bcrypt)
- Role-based access control
- Real-time order updates
- Responsive design (Tailwind CSS)
- Error handling and logging

## 📚 API Documentation

The backend API is organized into the following main controllers:

### Authentication (`/api/auth`)
- User login/registration
- Password management
- Token validation

### Orders (`/api/orders`)
- Create orders
- Get order history
- Update order status
- Order analytics

### Food Menu (`/api/food`)
- Get menu items
- Filter by category
- Search functionality

### Table Booking (`/api/table-booking`)
- Book tables
- View availability
- Cancel bookings

### Tables (`/api/tables`)
- Manage table inventory
- QR codes per table

### Customers (`/api/customers`)
- Customer profiles
- Preferences

### Staff (`/api/staff`)
- Staff management
- Role assignments

### Admin (`/api/admin`)
- System management
- Analytics

For detailed API endpoints, refer to the controller files in `bbta-be/src/controllers/`.

## 🔧 Development Guidelines

### Code Style

All projects follow consistent code standards:

- **TypeScript**: Strict mode enabled
- **Vue**: Composition API with `<script setup>` syntax
- **Formatting**: Prettier configuration in each project
- **Linting**: ESLint with Vue plugin and TypeScript support

### Running Code Quality Tools

```bash
# Lint and fix issues
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Combined (for CI/CD)
npm run build
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/your-feature`
4. Create a pull request

### Commit Message Convention

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Dependency updates, tooling

## 🐛 Troubleshooting

### Port Already in Use

If development servers fail to start due to port conflicts:

```bash
# On Windows - Kill process on port
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# On macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues

- Verify MongoDB connection string in `.env`
- Check network access in MongoDB Atlas (if using cloud)
- Ensure MongoDB service is running (if using local instance)
- Test connection with MongoDB Compass

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### TypeScript Build Errors

```bash
# Clear build cache
npm run type-check -- --force

# Rebuild
npm run build
```

### CORS Errors

- Backend CORS is configured to allow all origins (`*`)
- If frontend can't reach API, check API URL in axios configuration
- Ensure backend is running on expected port

### Vite HMR Issues

If hot module replacement isn't working:

```bash
# Restart dev server
npm run dev
```

## 📝 Environment Configuration

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGOOSE_URI` | MongoDB connection string | - |
| `PORT` | Backend server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `VITE_API_BASE_URL` | Frontend API endpoint | http://localhost:5000/api |

## 📦 Build & Deployment

### Production Build

```bash
# Backend
cd bbta-be
npm run build
npm run start

# Frontend
cd bbta-client-fe
npm run build
# Serve dist folder with static server
```

### Building All Projects

```bash
# From root directory (if using workspace)
for dir in bbta-be bbta-client-fe bbta-admin-fe bbta-staff-fe; do
  cd $dir
  npm run build
  cd ..
done
```

## 📞 Support & Contact

For issues, questions, or contributions:
1. Check existing issues and documentation
2. Create detailed bug reports with reproduction steps
3. Follow the development guidelines above

## 📄 License

ISC License - See individual project LICENSE files

---

**Last Updated**: January 2026

For the latest information and updates, check the individual project README files:
- [Client Frontend README](./bbta-client-fe/README.md)
- [Admin Frontend README](./bbta-admin-fe/README.md)
- [Staff Frontend README](./bbta-staff-fe/README.md)
- [Backend README](./bbta-be/README.md)
