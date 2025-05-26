# Marketplace App

A full-stack e-commerce marketplace with user and admin frontends, built with FastAPI, Next.js, PostgreSQL, and Redis.

---

## Features

- User registration, login, password reset
- Product catalog with search and filtering
- Shopping cart and checkout
- Order history
- Admin dashboard for managing products, categories, users, and orders
- Analytics dashboard
- API documentation (Swagger/OpenAPI)
- Dockerized for easy deployment

---

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Redis
- **Frontend:** Next.js (React, TypeScript)
- **Admin Frontend:** Next.js (React, TypeScript)
- **Testing:** Pytest, Jest, Cypress
- **Containerization:** Docker, Docker Compose

---

## Quick Start

### 1. Clone the repository

```sh
git clone user/marketplace-app
cd marketplace-app
```

### 2. Copy and configure environment variables

```sh
cp backend/.env.example backend/.env
cp admin-frontend/.env.example admin-frontend/.env.local
cp user-frontend/.env.example user-frontend/.env.local
```
Edit the `.env` and `.env.local` files as needed (e.g., set `SECRET_KEY`).

### 3. Build and start all services

```sh
docker compose up --build
```

### 4. Access the applications

- **User Frontend:** http://localhost:3000
- **Admin Frontend:** http://localhost:3001
- **API Docs:** http://localhost:8000/docs

---

## Running Tests

### Backend

```sh
docker compose exec backend bash
pytest --cov=app
```

### Frontend

```sh
cd admin-frontend
npm test

cd ../user-frontend
npm test
```

### End-to-End (E2E) Tests

```sh
cd user-frontend
npx cypress open
```

---

## API Documentation

- Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive Swagger UI.

---

## Project Structure

```
marketplace-app/
├── backend/           # FastAPI backend
├── admin-frontend/    # Admin dashboard (Next.js)
├── user-frontend/     # User-facing frontend (Next.js)
├── docker-compose.yml
└── ...
```

---

## Environment Variables

- **backend/.env.example:** Backend config (Postgres, Redis, secret key, etc.)
- **admin-frontend/.env.example:** Admin frontend config (API URL)
- **user-frontend/.env.example:** User frontend config (API URL)

**Always copy `.env.example` to `.env` or `.env.local` and edit as needed.**

---

## Deployment Notes

- For production, set strong secrets and production database credentials in your `.env` files.
- You may want to set up HTTPS, a production-ready database, and a production Redis instance.
- For scaling, consider using a process manager (e.g., Gunicorn for FastAPI) and a reverse proxy (e.g., Nginx).

---

## Troubleshooting

- If you see errors about missing `.env` or `.env.local`, ensure you copied the example files and edited them.
- If Docker Compose warns about missing variables, create a `.env` in the project root with the required variables.

---

## Author

[Jian Carlo M. de Joya] — [dejoyajiancarlo@gmail.com]
