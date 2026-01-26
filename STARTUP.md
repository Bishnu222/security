# Secure App Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (running on default port 27017)

## Installation
Run the following command in the root directory to install all dependencies for both client and server:

```bash
npm run setup
```

## Running the Application
To start both the backend server and the frontend client simultaneously:

```bash
npm start
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Security Features Implemented
- **Authentication**: JWT-based, HTTP-only cookies, password hashing (bcrypt), rate limiting.
- **Frontend**: React, Protected Routes, Axios interceptors.
- **Backend**: Helmet (headers), XSS-Clean, Mongo-Sanitize, HPP, Rate Limiting.
- **Payment**: Stripe integration structure ready (requires valid API key in `.env`).

## Notes
- Ensure MongoDB is running before starting the app.
- Update `server/.env` with your own secrets for production use.
