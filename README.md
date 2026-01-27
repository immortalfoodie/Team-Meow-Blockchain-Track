# Evidence Chain - Backend API

Backend for the judicial evidence management system with blockchain integration.

## Setup

```bash
npm install
cp .env.example .env
# edit .env with your config
node server.js
```

## Test Users

| Username | Password | Role |
|----------|----------|------|
| officer_sharma | police123 | POLICE |
| lab_verma | lab123 | LAB |
| judge_mehta | judge123 | JUDGE |
| admin | admin123 | ADMIN |

## API Endpoints

### Auth

**Login:**
```
POST /api/auth/login
Body: { "username": "officer_sharma", "password": "police123" }
```

**Get Profile:**
```
GET /api/auth/profile
Header: Authorization: Bearer <token>
```

### Evidence

**Upload (Police only):**
```
POST /api/evidence/upload
Header: Authorization: Bearer <token>
Form: file, evidenceId, caseId, description
```

**Transfer Custody (Police/Lab):**
```
POST /api/evidence/transfer
Body: { "evidenceId": "...", "newOwnerId": "...", "reason": "..." }
```

**Verify (Judge only):**
```
POST /api/evidence/verify
Form: file, evidenceId
```

**Get Evidence:**
```
GET /api/evidence/:evidenceId
```

**Get History:**
```
GET /api/evidence/:evidenceId/history
```

## Roles

- **POLICE**: Upload evidence, transfer custody
- **LAB**: Transfer custody
- **JUDGE**: Verify evidence
- **ADMIN**: Manage users

## Config

Edit `.env`:
```
PORT=5000
JWT_SECRET=your-secret-key
BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=0x...
ACCOUNT_ADDRESS=0x...
```

## Testing

```powershell
# login
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body '{"username":"officer_sharma","password":"police123"}' -ContentType "application/json"

# health check
Invoke-RestMethod -Uri http://localhost:5000/api/health
```
