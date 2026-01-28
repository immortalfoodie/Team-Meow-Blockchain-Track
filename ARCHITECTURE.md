# Frontend-Backend Architecture

## Connection Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Browser (http://localhost:5173)                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                               │   │
│  │  - Login Page                                        │   │
│  │  - Dashboards (Police, Analyst, Auditor, Judge)     │   │
│  │  - Evidence Management Pages                        │   │
│  │                                                      │   │
│  │  API Client (src/api/api.ts)                        │   │
│  │  axios baseURL: http://localhost:5000/api           │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│              Vite Proxy (vite.config.ts)                     │
│              /api → http://localhost:5000                    │
│                          ↓                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           │ with JWT Token
                           ↓
         ┌─────────────────────────────────┐
         │                                   │
         │  Node.js/Express Backend         │
         │  (http://localhost:5000)         │
         │                                   │
         │  Routes:                         │
         │  ├─ /api/auth                   │
         │  │  ├─ POST /login              │
         │  │  ├─ GET /profile             │
         │  │  └─ POST /register           │
         │  │                               │
         │  ├─ /api/evidence               │
         │  │  ├─ POST /upload             │
         │  │  ├─ POST /transfer           │
         │  │  ├─ POST /verify             │
         │  │  ├─ GET /:evidenceId         │
         │  │  └─ GET /:evidenceId/history │
         │  │                               │
         │  └─ /api/health                 │
         │                                   │
         │  Services:                       │
         │  ├─ auth.js                     │
         │  ├─ blockchain.js               │
         │  ├─ hash.js                     │
         │  ├─ users.js                    │
         │  └─ audit.js                    │
         │                                   │
         └─────────────────────────────────┘
                      ↓
         ┌─────────────────────────────────┐
         │  External Services              │
         │  ├─ Blockchain (Smart Contract) │
         │  ├─ File Storage (uploads/)     │
         │  └─ Audit Logs                  │
         └─────────────────────────────────┘
```

## Data Flow Example: Login

```
1. User enters credentials in Frontend
   ↓
2. Frontend calls POST /api/auth/login with {username, password}
   ↓
3. Vite Proxy intercepts request, forwards to http://localhost:5000
   ↓
4. Backend validates credentials against users database
   ↓
5. Backend generates JWT token using JWT_SECRET
   ↓
6. Backend returns {success: true, token, user: {...}}
   ↓
7. Frontend receives response, stores JWT in localStorage
   ↓
8. Subsequent requests include Authorization: Bearer {token} header
```

## File Structure Changes

### Frontend (`Team-Meow-Blockchain-Track-frontend/`)
```
├── vite.config.ts           [MODIFIED] - Added /api proxy
├── .env                     [NEW] - API URL for dev
├── .env.production          [NEW] - API URL for prod
└── src/
    └── api/
        └── api.ts           [MODIFIED] - Updated endpoints & auth
```

### Backend (`meow-backend/backend/`)
```
├── .env                     [MODIFIED] - PORT changed to 5000
├── server.js                [UNCHANGED] - Already has CORS
├── routes/
│   ├── auth.js             [UNCHANGED] - Correct endpoints
│   └── evidence.js         [UNCHANGED] - Correct endpoints
└── services/
    └── ...                 [UNCHANGED]
```

## Environment Configuration

### Development
- Frontend: `http://localhost:5173` with Vite proxy
- Backend: `http://localhost:5000` with CORS enabled
- API Base URL: `/api` (proxied by Vite)

### Production
- Frontend: Built to `dist/` folder
- Backend: Can be same or different domain
- API Base URL: `/api` (same domain) or `https://api.example.com` (different domain)
- CORS: Configure based on domain structure

## Key Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | React | 19.2.0 |
| Frontend Build | Vite | 7.2.5 |
| Language | TypeScript | 5.9.3 |
| HTTP Client | Axios | 1.7.9 |
| Backend | Express | 5.2.1 |
| Runtime | Node.js | 18+ |
| Auth | JWT | jsonwebtoken 9.0.3 |
| File Upload | Multer | 2.0.2 |
| Web3 | web3 | 4.16.0 |
