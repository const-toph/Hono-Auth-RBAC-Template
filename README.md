# 🚀 Hono Full-Stack API Template

A production-ready, type-safe backend template featuring **Hono.js**, **Prisma ORM**, **JWT Authentication**, **RBAC**, and **OpenAPI documentation** with **RPC client integration**.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with refresh tokens
- **Role-Based Access Control (RBAC)** with fine-grained permissions
- **Secure password hashing** with bcryptjs
- **Token rotation** and session management
- **Rate limiting** on auth endpoints to prevent brute-force attacks

### 🎯 Type Safety & Developer Experience
- **Full TypeScript** support
- **Hono RPC Client** - End-to-end type safety from backend to frontend
- **Zod validation** - Runtime type checking and validation
- **OpenAPI/Scalar** - Auto-generated interactive API documentation
- **Stoker** integration for enhanced OpenAPI specs

### 🛠️ Backend Features
- **Prisma ORM** - Type-safe database queries with PostgreSQL
- **Pino Logger** - Fast, structured logging with pretty printing
- **Rate Limiting** - Protection against API abuse with `hono-rate-limiter`
- **Modular architecture** - Clean separation of routes, handlers, and services
- **Middleware system** - Composable middleware with `wrapWithMiddlewares`

### 📚 API Documentation
- **Scalar OpenAPI UI** - Beautiful, interactive API documentation
- **Auto-generated specs** - OpenAPI 3.1 specification from Zod schemas
- **RPC type export** - Fully typed client for frontend consumption

## 🏗️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Hono.js |
| **Runtime** | Node.js / Bun |
| **Language** | TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Validation** | Zod |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **API Docs** | @hono/zod-openapi, @scalar/hono-api-reference, Stoker |
| **Logging** | Pino, Pino-Pretty |
| **Rate Limiting** | hono-rate-limiter |
| **Type Safety** | Hono RPC Client |

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/const-toph/Hono-Auth-RBAC-Template.git
cd Hono-Auth-RBAC-Template
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
```

4. **Setup database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
# or
bun run dev
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, access the interactive API documentation:

**Scalar UI**: `http://localhost:3000/reference`

## 🎯 Usage

### Backend Development

#### Route Structure
```typescript
// routes/auth/auth.index.ts
import { createRouter } from "@/lib/create-app";
import { ipRateLimiter } from "@/middlewares/rate-limit.middleware";
import { wrapWithMiddlewares } from "@/lib/wrapWithMiddleware";

const router = createRouter()
  .openapi(
    routes.login,
    wrapWithMiddlewares(handlers.login, ipRateLimiter)
  );

export default router;
```

#### Middleware Composition
```typescript
// Combine multiple middlewares
.openapi(
  routes.protectedRoute,
  wrapWithMiddlewares(
    handlers.myHandler,
    authMiddleware,      // Check authentication
    userRateLimiter,     // Apply rate limit
    permissionMiddleware // Check permissions
  )
);
```

### Frontend Integration with RPC Client

**Install Hono Client** (Frontend)
```bash
npm install hono
```

**Setup Type-Safe Client**
```typescript
// frontend/src/lib/api.ts
import { hc } from "hono/client";
import type { AppType } from "@/backend/app"; // Import your backend types

const client = hc<AppType>("http://localhost:3000/");

export default client;
```

**Usage in React/Vue/etc**
```typescript
// Full type safety + autocomplete!
const response = await client.auth.login.$post({
  json: {
    emailOrUsername: "user@example.com",
    password: "password123"
  }
});

if (response.ok) {
  const data = await response.json();
  console.log(data.accessToken); // ✅ Fully typed!
}
```

## 🔐 Authentication Flow

### 1. Register User
```bash
POST /auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

### 2. Login
```bash
POST /auth/login
{
  "emailOrUsername": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { "id": 1, "email": "..." }
}
```

### 3. Access Protected Route
```bash
GET /users/me
Headers:
  Authorization: Bearer <accessToken>
```

### 4. Refresh Token
```bash
POST /auth/refresh
Headers:
  Authorization: Bearer <refreshToken>
```

## 🛡️ RBAC & Permissions

### Permission Structure

This template implements fine-grained permissions where:
- **Users** have **Roles**
- **Roles** have **Permissions**
- **Users** can have additional **Direct Permissions**

### Example Permission Check
```typescript
// Check if user has permission
import { hasPermission } from "@/lib/auth/permissions";

const canEditUsers = await hasPermission(userId, "users:update");
if (!canEditUsers) {
  return c.json({ error: "Forbidden" }, 403);
}
```

### Available Permissions (Default)
- `users:create` - Create users
- `users:read` - View users
- `users:update` - Edit users
- `users:delete` - Delete users
- `roles:manage` - Manage roles
- `permissions:manage` - Manage permissions

## 🚦 Rate Limiting

### IP-Based (Public Routes)
```typescript
// 5 requests per minute per IP
ipRateLimiter
```

### User-Based (Authenticated Routes)
```typescript
// 100 requests per minute per user
userRateLimiter
```

### Token-Based (Refresh Endpoint)
```typescript
// 20 requests per minute per token
tokenRateLimiter
```

See [Rate Limiter Documentation](./docs/RATE_LIMITER.md) for details.

## 📁 Project Structure

```
├── src/
│   ├── db/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   ├── lib/
│   │   ├── create-app.ts      # App factory
│   │   ├── configure-openapi.ts # OpenAPI config
│   │   └── wrapWithMiddleware.ts # Middleware helper
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   ├── permission.middleware.ts # RBAC checks
│   │   └── rate-limit.middleware.ts # Rate limiting
│   ├── routes/
│   │   ├── auth/
│   │   │   ├── auth.index.ts      # Route definitions
│   │   │   ├── auth.routes.ts     # OpenAPI route specs
│   │   │   └── auth.handlers.ts   # Request handlers
│   │   ├── users/
│   │   └── role-permissions/
│   ├── types/                     # Type definitions
│   ├── utils/                     # Utility functions
│   ├── app.ts                     # Main app setup
│   └── index.ts                   # Server entry point
├── scripts/
│   └── generate-openapi.ts        # OpenAPI spec generator
└── docs/
    └── RATE_LIMITER.md            # Rate limiter docs
```

## 🧪 Testing

### Test RPC Client
```bash
npm run test:rpc
```

### Run Tests
```bash
npm test
```

## 📜 Scripts

```json
{
  "dev": "tsx watch src/index.ts",           // Start dev server
  "build": "tsc && tsc-alias",              // Build for production
  "start": "node dist/index.js",            // Run production build
  "db:seed": "tsx src/db/seed.ts",          // Seed database
  "openapi:generate": "tsx scripts/generate-openapi.ts" // Generate OpenAPI spec
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this template for your projects!

## 🙏 Credits

- **Hono.js** - Ultra-fast web framework
- **Prisma** - Next-generation ORM
- **Stoker** by [@w3cj](https://github.com/w3cj) - OpenAPI utilities
- **Scalar** - Beautiful API documentation

## 📬 Contact

**Christopher Jay Manubay**
- Email: christopherjay.manubay@gmail.com
- LinkedIn: [christopher-jay-manubay](https://www.linkedin.com/in/christopher-jay-manubay-b47943289)
- GitHub: [@const-toph](https://github.com/const-toph)

---

⭐ If you find this template helpful, please give it a star!
