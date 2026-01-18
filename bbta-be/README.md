# BBTA Backend API

A robust Node.js/Express REST API for the restaurant management system, handling authentication, order management, table bookings, menu management, and more.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

The BBTA Backend API is the core service that powers all frontend applications (customer, admin, and staff). It provides RESTful endpoints for:

- **Authentication** - User login, registration, and token management
- **Order Management** - Create, update, and track orders
- **Menu Management** - Manage food items and categories
- **Table Management** - Manage restaurant tables and bookings
- **User Management** - Customer, staff, and admin profiles
- **Serve Sessions** - Track active dining sessions
- **Analytics** - Order and business metrics

## 🛠 Tech Stack

| Component  | Version               | Purpose                 |
| ---------- | --------------------- | ----------------------- |
| Node.js    | ^20.19.0 or >=22.12.0 | Runtime environment     |
| Express    | 5.1.0                 | Web framework           |
| TypeScript | 5.9.3                 | Language                |
| MongoDB    | (Atlas/Local)         | NoSQL database          |
| Mongoose   | 8.19.1                | MongoDB ODM             |
| bcrypt     | 6.0.0                 | Password hashing        |
| CORS       | 2.8.5                 | Cross-origin requests   |
| dotenv     | 17.2.3                | Environment management  |
| nodemon    | 3.1.10                | Development auto-reload |
| ts-node    | 10.9.2                | TypeScript execution    |

### Development Tools

- **ESLint** 9.37.0 - Code linting
- **Prettier** 3.6.2 - Code formatting
- **TypeScript ESLint** 8.46.0 - TypeScript linting

## 📁 Project Structure

```
bbta-be/
├── src/
│   ├── index.ts                 # Entry point - server initialization
│   ├── app.ts                   # Express app configuration
│   ├── config.ts                # Environment configuration
│   │
│   ├── controllers/             # Route handlers
│   │   ├── auth.controller.ts           # Authentication logic
│   │   ├── order.controller.ts          # Order operations
│   │   ├── food.controller.ts           # Menu management
│   │   ├── table.controller.ts          # Table management
│   │   ├── table-booking.controller.ts  # Table bookings
│   │   ├── customer.controller.ts       # Customer profiles
│   │   ├── staff.controller.ts          # Staff management
│   │   ├── admin.controller.ts          # Admin operations
│   │   └── serve-session.controller.ts  # Serve sessions
│   │
│   ├── routes/                  # API route definitions
│   │   ├── index.route.ts               # Route aggregator
│   │   ├── auth.route.ts
│   │   ├── order.route.ts
│   │   ├── food.route.ts
│   │   ├── table.route.ts
│   │   ├── table-booking.route.ts
│   │   ├── customer.route.ts
│   │   ├── staff.route.ts
│   │   ├── admin.route.ts
│   │   └── serve-session.route.ts
│   │
│   ├── models/                  # Mongoose schemas
│   │   ├── admin.model.ts
│   │   ├── customer.model.ts
│   │   ├── staff.model.ts
│   │   ├── food.model.ts
│   │   ├── order.model.ts
│   │   ├── table.model.ts
│   │   ├── table-booking.model.ts
│   │   ├── serve-session.model.ts
│   │   ├── bill.model.ts
│   │   └── list-serve-static.model.ts
│   │
│   ├── services/                # Business logic (optional)
│   │
│   ├── middleware/              # Custom Express middleware
│   │   ├── isAdmin.middleware.ts        # Admin authorization
│   │   └── isStaff.middleware.ts        # Staff authorization
│   │
│   ├── logger/                  # Logging utilities
│   │   ├── index.ts                     # Logger instance
│   │   └── type.ts                      # Logger types
│   │
│   └── utils/                   # Helper functions
│       ├── categories.ts                # Food categories
│       └── gen-token.ts                 # Token generation
│
├── .env                         # Environment variables
├── .env.example                 # Example environment file
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier configuration
├── .eslintignore                # ESLint ignore rules
├── eslint.config.mts            # ESLint configuration
├── tsconfig.json                # TypeScript configuration
├── nodemon.json                 # Nodemon watch configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## 📋 Prerequisites

### System Requirements

- **Node.js**: v20.19.0 or higher (or v22.12.0+)
- **npm**: v10+ (or compatible package manager like yarn, pnpm)
- **MongoDB**: Version 4.4+ (local instance or MongoDB Atlas cloud)
- **Git**: For version control

### MongoDB Setup

#### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?appOptions=...`
4. Add IP to whitelist (or allow all `0.0.0.0/0` for development)

#### Option 2: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

3. Connection string: `mongodb://localhost:27017/bbta`

### Verify MongoDB Connection

```bash
# Test with MongoDB Compass or mongosh
mongosh "mongodb://localhost:27017"
```

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
cd c:\Users\kbbk\Desktop\bbta\bbta-be
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies from `package.json`:

- Express and middleware
- MongoDB and Mongoose
- Development tools (TypeScript, ESLint, Prettier, etc.)

### 3. Configure Environment Variables

Create or update `.env` file in the project root:

```env
# MongoDB Connection
MONGOOSE_URI=mongodb+srv://username:password@cluster.mongodb.net/bbta?appName=bbta-cluster

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Add other configuration as needed
# LOG_LEVEL=info
# API_VERSION=v1
```

### Environment File Options

**Development (.env.local)**

```env
MONGOOSE_URI=mongodb://localhost:27017/bbta
PORT=5000
NODE_ENV=development
```

**Production (.env.production)**

```env
MONGOOSE_URI=mongodb+srv://username:password@cluster.mongodb.net/bbta
PORT=3000
NODE_ENV=production
```

### 4. Verify Setup

```bash
# Check Node and npm versions
node --version    # Should be >= 20.19.0
npm --version     # Should be >= 10

# Build TypeScript (check for compilation errors)
npm run build

# Type check
npx tsc --noEmit
```

## 🎮 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

- Server will start on `http://localhost:5000`
- Uses Nodemon for automatic reload on file changes
- Shows detailed MongoDB debug logs

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Check Server Status

Once running, verify with:

```bash
# In a new terminal
curl http://localhost:5000/api/health

# Or check specific endpoints
curl http://localhost:5000/api/food
```

## 📚 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication Routes (`/auth`)

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/login`    | User login        | No            |
| POST   | `/auth/register` | User registration | No            |
| POST   | `/auth/logout`   | User logout       | Yes           |
| GET    | `/auth/verify`   | Verify token      | Yes           |
| POST   | `/auth/refresh`  | Refresh token     | Yes           |

### Food Routes (`/food`)

| Method | Endpoint                   | Description           | Auth Required |
| ------ | -------------------------- | --------------------- | ------------- |
| GET    | `/food`                    | Get all food items    | No            |
| GET    | `/food/categories`         | Get food categories   | No            |
| GET    | `/food/:id`                | Get food by ID        | No            |
| POST   | `/food`                    | Create food item      | Admin         |
| PUT    | `/food/:id`                | Update food item      | Admin         |
| DELETE | `/food/:id`                | Delete food item      | Admin         |
| GET    | `/food/category/:category` | Get foods by category | No            |

### Order Routes (`/order`)

| Method | Endpoint                | Description          | Auth Required  |
| ------ | ----------------------- | -------------------- | -------------- |
| GET    | `/order`                | Get all orders       | Admin/Staff    |
| GET    | `/order/:id`            | Get order by ID      | Customer/Staff |
| POST   | `/order`                | Create new order     | Customer       |
| PUT    | `/order/:id`            | Update order status  | Staff          |
| DELETE | `/order/:id`            | Cancel order         | Customer/Staff |
| GET    | `/order/table/:tableId` | Get orders for table | Staff          |
| PUT    | `/order/:id/status`     | Update order status  | Staff          |

### Table Routes (`/table`)

| Method | Endpoint            | Description      | Auth Required |
| ------ | ------------------- | ---------------- | ------------- |
| GET    | `/table`            | Get all tables   | No            |
| GET    | `/table/:id`        | Get table by ID  | No            |
| POST   | `/table`            | Create table     | Admin         |
| PUT    | `/table/:id`        | Update table     | Admin         |
| DELETE | `/table/:id`        | Delete table     | Admin         |
| GET    | `/table/:id/status` | Get table status | No            |
| PUT    | `/table/:id/qr`     | Generate QR code | Admin         |

### Table Booking Routes (`/table-booking`)

| Method | Endpoint                        | Description        | Auth Required  |
| ------ | ------------------------------- | ------------------ | -------------- |
| GET    | `/table-booking`                | Get all bookings   | Staff          |
| GET    | `/table-booking/:id`            | Get booking by ID  | Customer/Staff |
| POST   | `/table-booking`                | Create booking     | Customer       |
| PUT    | `/table-booking/:id`            | Update booking     | Customer/Staff |
| DELETE | `/table-booking/:id`            | Cancel booking     | Customer       |
| GET    | `/table-booking/table/:tableId` | Get table bookings | Staff          |

### Customer Routes (`/customer`)

| Method | Endpoint               | Description          | Auth Required  |
| ------ | ---------------------- | -------------------- | -------------- |
| GET    | `/customer`            | Get all customers    | Admin          |
| GET    | `/customer/:id`        | Get customer profile | Customer/Admin |
| POST   | `/customer`            | Create customer      | No             |
| PUT    | `/customer/:id`        | Update profile       | Customer       |
| DELETE | `/customer/:id`        | Delete account       | Customer       |
| GET    | `/customer/:id/orders` | Get customer orders  | Customer       |

### Staff Routes (`/staff`)

| Method | Endpoint          | Description          | Auth Required |
| ------ | ----------------- | -------------------- | ------------- |
| GET    | `/staff`          | Get all staff        | Admin         |
| GET    | `/staff/:id`      | Get staff profile    | Staff/Admin   |
| POST   | `/staff`          | Create staff account | Admin         |
| PUT    | `/staff/:id`      | Update staff info    | Staff/Admin   |
| DELETE | `/staff/:id`      | Remove staff         | Admin         |
| PUT    | `/staff/:id/role` | Update staff role    | Admin         |

### Admin Routes (`/admin`)

| Method | Endpoint                   | Description        | Auth Required |
| ------ | -------------------------- | ------------------ | ------------- |
| GET    | `/admin/dashboard`         | Get dashboard data | Admin         |
| GET    | `/admin/analytics/orders`  | Order analytics    | Admin         |
| GET    | `/admin/analytics/revenue` | Revenue data       | Admin         |
| GET    | `/admin/logs`              | System logs        | Admin         |
| POST   | `/admin/settings`          | Update settings    | Admin         |
| GET    | `/admin/reports`           | Generate reports   | Admin         |

### Serve Session Routes (`/serve-session`)

| Method | Endpoint                    | Description         | Auth Required |
| ------ | --------------------------- | ------------------- | ------------- |
| GET    | `/serve-session`            | Get all sessions    | Staff         |
| GET    | `/serve-session/:id`        | Get session details | Staff         |
| POST   | `/serve-session`            | Start new session   | Staff         |
| PUT    | `/serve-session/:id`        | Update session      | Staff         |
| DELETE | `/serve-session/:id`        | End session         | Staff         |
| GET    | `/serve-session/:id/orders` | Get session orders  | Staff         |

## 🗄 Database Models

### Food Model

```typescript
{
  name: String (required),
  price: Number (required),
  category: String (required),
  image_url: String,
  description: String,
  is_deleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```typescript
{
  serve_session_id: ObjectId (ref: ServeSession),
  table_order_id: ObjectId (ref: Table),
  ordered: [{
    food_id: ObjectId (ref: Food),
    quantity: Number,
    price: Number
  }],
  preparing: [{
    food_id: ObjectId (ref: Food),
    quantity: Number,
    price: Number,
    table_id: ObjectId (ref: Table),
    time_started: Date
  }],
  cancelled: [{
    food_id: ObjectId (ref: Food),
    quantity: Number,
    table_id: ObjectId (ref: Table),
    time_cancelled: Date,
    cancelled_by_staff_id: ObjectId (ref: Staff),
    cancelled_by_customer: Boolean,
    reason_cancelled: String
  }],
  served: [{
    food_id: ObjectId (ref: Food),
    quantity: Number,
    price: Number,
    table_id: ObjectId (ref: Table),
    time_served: Date
  }],
  time_ordered: Date (default: now)
}
```

### Customer Model

```typescript
{
  username: String (required, unique),
  password: String (required, hashed with bcrypt),
  email: String (required, unique),
  phone: String,
  fullname: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Table Model

```typescript
{
  table_number: Number (required, unique),
  capacity: Number (required),
  location: String,
  status: String (enum: available, occupied, reserved),
  qr_code: String,
  is_active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Staff Model

```typescript
{
  username: String (required, unique),
  password: String (required, hashed),
  email: String (required, unique),
  fullname: String,
  phone: String,
  role: String (enum: waiter, chef, manager),
  department: String,
  is_active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model

```typescript
{
  username: String (required, unique),
  password: String (required, hashed),
  email: String (required, unique),
  fullname: String,
  permissions: [String],
  is_active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Table Booking Model

```typescript
{
  customer_id: ObjectId (ref: Customer),
  table_id: ObjectId (ref: Table),
  booking_date: Date (required),
  booking_time: String (required),
  party_size: Number (required),
  special_requests: String,
  status: String (enum: confirmed, cancelled, completed),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Serve Session Model

```typescript
{
  table_id: ObjectId (ref: Table),
  customer_id: ObjectId (ref: Customer),
  staff_id: ObjectId (ref: Staff),
  start_time: Date (required),
  end_time: Date,
  total_amount: Number,
  status: String (enum: active, completed, cancelled),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Middleware

### Admin Middleware (`isAdmin.middleware.ts`)

Protects admin-only routes by validating authorization token.

```typescript
// Usage in routes
router.post('/create-food', isAdmin_middleware, createFoodHandler);
```

**Request Header:**

```
Authorization: <admin_token>
```

### Staff Middleware (`isStaff.middleware.ts`)

Protects staff-only routes.

```typescript
// Usage in routes
router.put('/order/:id/status', isStaff_middleware, updateOrderStatusHandler);
```

### Custom Middleware Pattern

```typescript
// Middleware chain example
app.use('/api/admin', isAdmin_middleware);
app.use('/api/staff', isStaff_middleware);
```

## 🔧 Development Guidelines

### Code Structure

1. **Controllers** - Handle HTTP requests/responses
2. **Routes** - Define API endpoints and middleware
3. **Models** - Define database schemas
4. **Services** - Encapsulate business logic
5. **Middleware** - Cross-cutting concerns
6. **Utils** - Reusable helper functions

### Naming Conventions

- **Files**: snake_case with descriptive names (e.g., `order.controller.ts`)
- **Functions**: camelCase (e.g., `createOrder`, `updateOrderStatus`)
- **Exports**: Use named exports for controllers, models
- **Models**: Suffix with `.model.ts`, export as singular noun
- **Routes**: Suffix with `.route.ts`

### Creating a New Feature

1. **Create Model** (`src/models/feature.model.ts`)

   ```typescript
   import { model, Schema } from 'mongoose';

   const featureSchema = new Schema({
     name: { type: String, required: true },
     // ... fields
   });

   export default model('Feature', featureSchema);
   ```

2. **Create Controller** (`src/controllers/feature.controller.ts`)

   ```typescript
   import { Request, Response } from 'express';
   import featureModel from '../models/feature.model';

   export const getFeature = async (req: Request, res: Response) => {
     try {
       const data = await featureModel.find();
       res.json(data);
     } catch (err) {
       res.status(500).json({ error: (err as Error).message });
     }
   };
   ```

3. **Create Route** (`src/routes/feature.route.ts`)

   ```typescript
   import { Router } from 'express';
   import { getFeature } from '../controllers/feature.controller';

   export const feature_route = Router();

   feature_route.get('/feature', getFeature);
   ```

4. **Register Route** (in `src/routes/index.route.ts`)

   ```typescript
   import { feature_route } from './feature.route';

   export const all_routes = [
     // ... existing routes
     feature_route,
   ];
   ```

### Code Quality

#### Linting

```bash
# Run ESLint with auto-fix
npm run lint

# Format code with Prettier
npm run format

# Check for formatting issues
npm run format -- --check
```

#### Type Checking

```bash
# Run TypeScript compiler check
npx tsc --noEmit

# Build with type checking
npm run build
```

### Error Handling

Implement consistent error handling:

```typescript
try {
  const data = await Model.findById(id);
  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(data);
} catch (error) {
  logger.error('Error message:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

### Logging

Use the logger utility:

```typescript
import logger from '../logger';

logger.log('Info message');
logger.error('Error message');
logger.warn('Warning message');
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `MongoNetworkError: connect ECONNREFUSED`**

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas: check IP whitelist)

```bash
# Test connection
mongosh "your_connection_string"
```

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::5000`**

```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Module Not Found

**Error: `Cannot find module 'express'`**

```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### TypeScript Compilation Error

**Error: `TS2307: Cannot find module`**

```bash
# Clear build artifacts and rebuild
rm -r dist
npm run build
```

### CORS Issues

If frontend can't reach API:

```typescript
// Verify CORS is enabled in app.ts
app.use(cors({ origin: '*' })); // Allow all origins in dev
```

For production, restrict origins:

```typescript
app.use(
  cors({
    origin: ['https://example.com', 'https://admin.example.com'],
    credentials: true,
  }),
);
```

### Request Body Not Parsing

**Error: `undefined` in `req.body`**

```typescript
// Ensure middleware is set up (check app.ts)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Send requests with correct Content-Type
fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Mongoose Deprecation Warnings

**Error: Deprecation warnings in console**

Already handled in `src/index.ts`:

```typescript
mongoose.connect(env.MONGOOSE_URI, {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
});
```

## 📈 Monitoring & Logging

### Enable Debug Logging

The app automatically enables Mongoose debug logging in development:

```typescript
mongoose.set('debug', true);
```

Check console output for detailed MongoDB operation logs.

### Custom Logging

```typescript
import logger from './logger';

logger.log('Application started');
logger.warn('Warning message');
logger.error('Error occurred:', error);
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with compiled JavaScript.

### Environment Setup for Production

```env
MONGOOSE_URI=mongodb+srv://prod-user:password@prod-cluster.mongodb.net/bbta
PORT=3000
NODE_ENV=production
```

### Run on Server

```bash
npm install --production
npm start
```

### Docker Deployment (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t bbta-backend .
docker run -p 5000:5000 --env-file .env bbta-backend
```

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB/Mongoose Docs](https://mongoosejs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)

## 📞 Support

For issues or questions:

1. Check error messages and logs
2. Review troubleshooting section above
3. Check related issue in project repository
4. Create detailed issue report with error logs

---

**Last Updated**: January 2026

**Version**: 1.0.0
