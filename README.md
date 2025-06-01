# Marketplace App

A full-stack e-commerce marketplace with user and admin frontends, built with FastAPI, Next.js, PostgreSQL, and Redis.

---

## Features

- User authentication (login/register)
- Product catalog with search and filtering
- Shopping cart functionality
- Order management
- Admin dashboard
  - Product management
  - Category management
  - Order tracking
  - User management
- Responsive design
- Image upload and processing
- Real-time inventory tracking

## Tech Stack

- **Backend:**
  - FastAPI
  - SQLAlchemy
  - PostgreSQL
  - Redis
  - JWT Authentication

- **Frontend & Admin:**
  - Next.js 13+ (App Router)
  - TypeScript
  - TailwindCSS
  - React Context
  - React Hot Toast

- **Testing:**
  - Jest
  - React Testing Library
  - Cypress
  - Pytest

- **DevOps:**
  - Docker
  - Docker Compose
  - GitHub Actions (if implemented)

## Setup

1. Clone and install:
```bash
git clone user/marketplace-app
cd marketplace-app
```

2. Environment setup:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp admin-frontend/.env.example admin-frontend/.env.local
cp user-frontend/.env.example user-frontend/.env.local
```

3. Start services:
```bash
docker compose up --build
```

4. Access:
- User Frontend: http://localhost:3000
- Admin Frontend: http://localhost:3001 
- API Docs: http://localhost:8000/docs

## Default Admin Account
- Email: admin@example.com
- Password: admin123

## Testing

Backend:
```bash
docker compose exec backend pytest
```

Frontend:
```bash
cd user-frontend
npm test

cd ../admin-frontend
npm test
```

E2E Tests:
```bash
cd user-frontend
npm run cypress:open
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License

## Author

Jian Carlo M. de Joya
dejoyajiancarlo@gmail.com
