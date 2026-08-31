# My Dashboard - Backend

RESTful backend service for **My Dashboard**, built with **Node.js**, **Hapi.js**, and **MongoDB**.

---

## 🚀 Features

- **Hapi.js Framework (`@hapi/hapi` v21)**: Modular, robust server architecture.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) with schemas, indexing, and validation.
- **JWT Authentication & Session Management**:
  - Secure stateless authentication with `hapi-auth-jwt2` and `jsonwebtoken`.
  - Token tracking and revocation support via `AuthToken` model.
  - Refresh token flow.
- **Password Security**: Password hashing with `bcryptjs`.
- **Request Validation & Error Handling**:
  - Strict payload validation with `@hapi/joi`.
  - Structured Boom HTTP errors (`@hapi/boom`) and localized error messaging.
- **Multi-language Response Support**: Localized response messages based on `lang` header (`en`, `th`).
- **CORS Configured**: Ready for frontend integration across local and production hosts.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) (ES6+ / Node 20+) |
| **Framework** | [Hapi.js](https://hapi.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`, `hapi-auth-jwt2`), `bcryptjs` |
| **Validation** | [Joi](https://joi.dev/) (`@hapi/joi`) |
| **Error Handling** | [Boom](https://hapi.dev/module/boom/) (`@hapi/boom`) |
| **Package Manager** | Yarn |

---

## 📁 Project Structure

```text
My_Dashboard_Back/
├── config/
│   ├── db.js                 # MongoDB database connection configuration
│   └── server.js             # Hapi server instance, CORS, auth strategies, lifecycle hooks
├── server/
│   ├── constants/            # Error codes and application constants
│   ├── controllers/          # Business logic (user registration, login, profile, password)
│   ├── lang/                 # Multilingual localization messages (en, th)
│   ├── lib/                  # Utilities (auth helpers, token generator, response translators)
│   ├── models/               # Mongoose data models (User, AuthToken)
│   ├── routes/               # API route definitions and endpoint handlers
│   └── schema/               # Joi request validation schemas and standardized service responses
├── .env.example              # Template environment variables file
├── Dockerfile                # Production Docker container definition
├── docker-compose.yml        # Standalone backend + MongoDB compose setup
├── index.js                  # Application entry point
└── package.json              # Project scripts and dependencies
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the backend folder:

```bash
cp .env.example .env
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_MONGO_CONNECTION_STRING` | MongoDB connection URL | `mongodb://localhost:27017` |
| `DB_NAME` | MongoDB database name | `my-dashboard` |
| `HOST` | Server host | `localhost` or `0.0.0.0` |
| `PORT` | Server listening port | `3010` |
| `SECRET_JWT` | Secret key for JWT signing & verification | `your_jwt_secret_key` |
| `ENABLED_MANUAL_TOKEN_EXPIRED_TIME` | Enable/disable custom token expiration | `true` or `false` |
| `MANUAL_TOKEN_EXPIRED_TIME` | Custom token lifetime (e.g. seconds or duration) | `86400` |

---

## 📡 API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication & Users

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Authenticate user credentials and return JWT |
| `POST` | `/api/auth/refresh-token` | No | Obtain a new access token using a valid refresh token |
| `GET` | `/api/users/profile` | Yes (`Bearer <token>`) | Retrieve authenticated user profile |
| `PUT` | `/api/users/profile` | Yes (`Bearer <token>`) | Update authenticated user profile |
| `POST` | `/api/auth/reset-password` | Yes (`Bearer <token>`) | Update user password |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **MongoDB** running locally or via Docker
- **Yarn** (v1.22.x)

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

Ensure your `.env` file has the correct database connection string and JWT secret.

### 3. Run Development Server

```bash
yarn dev
```

The server will start with hot-reloading on `http://localhost:3010` (or your configured `PORT`).

### 4. Run in Production

```bash
yarn start
```

---

## 🐳 Docker Deployment

### Run with Docker Compose (Backend + MongoDB)

```bash
docker compose up -d
```