# Aroma Frontend (minimal)

This is a minimal Vite + React front-end that talks to the existing Aroma backend.

Quick start:

1. cd client
2. npm install
3. Create a `.env` file in `client/` with (optional):

VITE_API_BASE=http://localhost:5001

4. npm run dev

The front-end provides pages:
- / : Home
- /products : Product list (GET /api/products)
- /products/:id : Product details (GET /api/products/:id)
- /login : Login (POST /api/auth/login)

Notes:
- This is intentionally minimal. Add components, styling and features as needed.
- The backend must be running (see backend `server.js`).
