# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
npm run dev              # Start development server with hot reload using --watch
```

### Database Operations
```bash
npm run db:generate      # Generate new Drizzle migrations from schema changes
npm run db:migrate       # Apply pending migrations to database
npm run db:studio        # Open Drizzle Studio for database inspection
```

### Code Quality
```bash
npm run lint             # Run ESLint to check for code issues
npm run lint:fix         # Automatically fix ESLint issues where possible
npm run format           # Format code using Prettier
npm run format:check     # Check if code formatting is correct
```

## Architecture Overview

This is a Node.js Express API server for an acquisitions management system with the following key architectural patterns:

### Modular Structure
- **Import paths**: Uses Node.js subpath imports (prefixed with `#`) for clean internal imports
- **Layered architecture**: Controllers → Services → Models pattern for separation of concerns
- **Route organization**: RESTful API routes organized by feature/domain

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Migrations**: Schema-first approach with Drizzle Kit for database versioning
- **Models**: Located in `src/models/` using Drizzle's table definitions

### Authentication System
- **JWT-based**: Uses jsonwebtoken for stateless authentication
- **Cookie storage**: HTTP-only cookies for token storage with security configurations
- **Password hashing**: bcrypt for secure password storage
- **Role-based**: Supports user roles (user/admin)

### Logging & Monitoring
- **Winston logger**: Structured logging with file and console transports
- **Morgan**: HTTP request logging integrated with Winston
- **Health endpoint**: `/health` route for monitoring uptime and status

### Code Organization Pattern
```
src/
├── config/          # Database, logger, and other configurations
├── controllers/     # Request handlers and response formatting
├── models/          # Drizzle schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic and data operations
├── utils/           # Shared utilities (JWT, cookies, formatting)
└── validations/     # Zod schemas for request validation
```

### Key Dependencies
- **Express 5**: Modern Express.js server framework
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Neon**: Serverless PostgreSQL database
- **Zod**: Schema validation for API inputs
- **Winston**: Structured application logging
- **Helmet & CORS**: Security middleware for API protection

### Environment Configuration
Copy `.env.example` to `.env` and configure:
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `JWT_SECRET`: Secret for JWT token signing
- `PORT`: Server port (defaults to 4000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Winston logging level

### Development Practices
- **ES Modules**: Uses `"type": "module"` for modern import/export syntax
- **Code formatting**: Prettier with single quotes, 2-space indentation
- **Linting**: ESLint with custom rules for Node.js and modern JavaScript
- **Path aliases**: Subpath imports for clean, maintainable import statements
- **Error handling**: Centralized error handling with proper logging
- **Validation**: Zod schemas for all API input validation

### Security Features
- **Helmet**: Security headers for production
- **CORS**: Cross-origin request handling
- **Cookie security**: HTTP-only, secure cookies with SameSite protection
- **Password security**: bcrypt hashing with salt rounds
- **JWT expiration**: 1-day token expiration for security

When working with this codebase:
1. Always use the `#` import aliases instead of relative paths
2. Follow the established controller → service → model pattern
3. Add proper Zod validation schemas for new API endpoints
4. Use the Winston logger instead of console.log for production code
5. Follow existing patterns for database operations using Drizzle ORM
6. Ensure proper error handling and logging in all service functions