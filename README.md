# MERN Mastery — Full Stack Authentication System

A production-ready authentication system built with the MERN stack. Features secure user registration, email OTP verification, JWT authentication, and password reset functionality.

---

## Tech Stack

**Backend**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Zod
- Nodemailer
- crypto

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- React Context API

---

## Features

- User registration with secure password hashing
- Email OTP verification
- JWT authentication with protected routes
- Login and logout
- Forgot password with secure reset token
- Reset password via email link
- Global auth state with React Context
- Automatic token injection with Axios interceptors
- Form validation with Zod
- Responsive UI with Tailwind CSS

---

## Project Structure

```
mern-mastery/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validateRequest.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── validators/
│   │   └── authValidator.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ResetPassword.jsx
    │   │   └── VerifyOTP.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gmail account with App Password enabled

---

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file using the example:
```bash
cp .env.example .env
```

4. Fill in your environment variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Fill in your environment variables:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/register` | Register a new user | No |
| POST | `/verify-otp` | Verify email with OTP | No |
| POST | `/login` | Login and receive JWT | No |
| POST | `/forgot-password` | Request password reset email | No |
| POST | `/reset-password/:token` | Reset password with token | No |
| GET | `/me` | Get current user | Yes |

---

## Environment Variables

### Backend `.env.example`
```
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
EMAIL_USER=
EMAIL_PASS=
```

### Frontend `.env.example`
```
VITE_API_URL=
```

---

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- OTP expires after 10 minutes
- Password reset tokens expire after 15 minutes
- OTP and reset tokens deleted after single use
- Generic error messages to prevent user enumeration
- Zod validation on all incoming data
- CORS configured for frontend origin only

---

## Deployment

- **Backend** — Render
- **Frontend** — Vercel

Set `VITE_API_URL` to your Render backend URL before deploying the frontend.

---

## Author

Built by Joshua Nnorom as part of the MERN Mastery Program.
