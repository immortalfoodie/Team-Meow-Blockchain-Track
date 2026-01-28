# Frontend-Backend Integration Guide

This guide explains how to run the connected frontend and backend applications.

## Architecture Overview

- **Backend**: Node.js/Express server running on `http://localhost:5000`
- **Frontend**: React + TypeScript (Vite) running on `http://localhost:5173`
- **Communication**: Frontend proxies `/api` requests to backend during development

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm installed
- Both `meow-backend/backend` and `Team-Meow-Blockchain-Track-frontend` folders present

### Step 1: Install Dependencies

**For Backend:**
```bash
cd meow-backend/backend
npm install
```

**For Frontend:**
```bash
cd Team-Meow-Blockchain-Track-frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend** (`.env` file already created with correct settings):
- PORT: 5000 (updated from default 3000)
- JWT_SECRET: Change in production
- JWT_EXPIRES_IN: 24h

**Frontend** (`.env` file created automatically):
- VITE_API_URL: `http://localhost:5000/api` (dev) or `/api` (production/with proxy)

### Step 3: Start Both Services

**Terminal 1 - Start Backend:**
```bash
cd meow-backend/backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd Team-Meow-Blockchain-Track-frontend
npm run dev
# App available at http://localhost:5173
```

## How It Works

### Development Mode
- Frontend runs on port 5173 (Vite dev server)
- Vite proxy configuration (`vite.config.ts`) intercepts `/api` requests
- Proxy redirects them to `http://localhost:5000`

### API Integration Points

The frontend's `src/api/api.ts` is configured to:

1. **Authentication** (`/api/auth/login`):
   - Sends `username` and `password` to backend
   - Receives JWT token and user data
   - Stores token in localStorage

2. **Evidence Management**:
   - Upload: `POST /api/evidence/upload`
   - Transfer Custody: `POST /api/evidence/transfer`
   - Verify: `POST /api/evidence/verify`
   - Get Details: `GET /api/evidence/:evidenceId`
   - Get History: `GET /api/evidence/:evidenceId/history`

3. **Auth Token**:
   - All API requests automatically include `Authorization: Bearer {token}` header

## Backend Endpoints

### Auth Routes (`/api/auth`)
- `POST /login` - Login with username/password
- `GET /profile` - Get current user profile (requires auth)
- `POST /register` - Register new user (admin only)
- `GET /users` - List all users (admin only)
- `POST /verify-token` - Verify JWT token validity

### Evidence Routes (`/api/evidence`)
- `POST /upload` - Upload new evidence (multipart form, police only)
- `POST /transfer` - Transfer custody of evidence
- `POST /verify` - Verify evidence integrity (multipart form, judge only)
- `GET /:evidenceId` - Get evidence details
- `GET /:evidenceId/history` - Get custody history
- `GET /case/:caseId` - Get all evidence for a case
- `GET /:evidenceId/audit` - Get audit trail (admin/judge only)

### Health Check
- `GET /api/health` - Check server and blockchain connection status

## Frontend Features

The frontend includes the following authenticated pages:

- **Login** (`/login`) - Authentication page
- **Police Dashboard** (`/police`) - Evidence registration
- **Analyst Dashboard** (`/analyst`) - Evidence analysis
- **Auditor Dashboard** (`/auditor`) - Audit trail viewing
- **Judge Dashboard** (`/judge`) - Evidence verification
- **Evidence Registration** - Upload and register evidence
- **Evidence Verification** - Verify evidence integrity
- **Custody Transfer** - Transfer evidence custody

## Testing the Connection

1. Start both services following Step 3
2. Navigate to `http://localhost:5173`
3. Login with demo credentials:
   - Email: `officer@demo.local`
   - Password: `password123`
4. The login will work with demo data, then real API calls will work for other operations

## Troubleshooting

### Backend Connection Errors
- Ensure backend is running on port 5000
- Check `.env` file has `PORT=5000`
- Verify firewall allows localhost:5000

### CORS Errors
- Backend has `cors()` middleware enabled
- Frontend proxy is configured in `vite.config.ts`
- In production, ensure proper CORS headers are set

### API Response Issues
- Check browser DevTools Network tab to see actual requests
- Backend logs show all requests with timestamps
- Verify JWT token is stored in localStorage after login

### Port Already in Use
- Change port in backend `.env` file
- Update frontend `.env` accordingly
- Update Vite proxy config if needed

## Production Deployment

1. **Build Frontend**:
   ```bash
   cd Team-Meow-Blockchain-Track-frontend
   npm run build
   # Creates `dist/` folder
   ```

2. **Serve Static Files**:
   - Serve contents of `dist/` folder as static files from backend or separate CDN
   - Backend at different domain? Update CORS configuration

3. **Environment Variables**:
   - Backend: Set `JWT_SECRET` to strong random value
   - Frontend: Use `.env.production` with `VITE_API_URL=/api` for same-origin requests

## Key Integration Changes Made

1. **Vite Config**: Added proxy to redirect `/api` requests to `http://localhost:5000`
2. **API Client**: Updated to use environment variables for base URL
3. **Login Function**: Modified to handle backend response format (username field, user object in response)
4. **Evidence Endpoints**: Changed from `/register` to `/upload`, updated field names
5. **Environment Files**: Created `.env` files with proper configuration

## Support

For issues with:
- **Backend logic**: Check `meow-backend/backend/` files
- **Frontend UI**: Check `Team-Meow-Blockchain-Track-frontend/src/` files
- **Integration**: Verify configuration in `vite.config.ts` and `src/api/api.ts`
