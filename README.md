# Dad's Shop – Backend (Phase 1)
Node.js + Express + PostgreSQL (Render free tier). Minimal APIs for products and sales.
## Endpoints
- GET /health
- GET /api/products
- POST /api/products (auth)
- PUT /api/products/:id (auth)
- DELETE /api/products/:id (auth)
- POST /api/sales (auth)
- GET /api/sales?from=YYYY-MM-DD&to=YYYY-MM-DD (auth)
Auth: Header Authorization: Bearer <ADMIN_TOKEN>
Deploy: Use render.yaml as Blueprint. Set ADMIN_TOKEN in service env vars. Load schema.sql into the DB once.
