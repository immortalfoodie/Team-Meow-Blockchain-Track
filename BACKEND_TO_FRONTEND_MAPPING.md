BACKEND-TO-FRONTEND MAPPING
===========================

## BACKEND SERVICES LAYER

### 1. users.js (User Management)
Functions Available:
- findByUsername(username) → finds user by username
- findById(id) → finds user by ID  
- validatePassword(user, password) → validates password
- sanitizeUser(user) → removes sensitive data (password)
- getAllUsers() → returns all users without passwords
- addUser(userData) → creates new user

Pre-configured Users:
- Police Officers (POLICE role):
  * officer_sharma / police123 (Inspector Sharma, Mumbai Police - Cyber Crime)
  * officer_patel / police123 (Sub-Inspector Patel, Mumbai Police - Cyber Crime)

- Lab Analysts (LAB role):
  * lab_verma / lab123 (Dr. Verma, Central Forensic Science Laboratory)
  * lab_khan / lab123 (Dr. Khan, State Forensic Science Laboratory)

- Judges (JUDGE role):
  * judge_mehta / judge123 (Hon. Justice Mehta, Mumbai High Court)
  * judge_reddy / judge123 (Hon. Justice Reddy, Sessions Court, Mumbai)

- Admin (ADMIN role):
  * admin / admin123 (System Administrator)

Frontend Usage: AuthContext.tsx login() function validates against these users

---

### 2. blockchain.js (Evidence Storage & Notarization)
Functions Available:
- isChainUp() → checks if blockchain connection is available
- addEvidence(evidenceId, caseId, hash, owner) → records evidence on blockchain
- transferCustody(evidenceId, newOwner) → transfers custody with blockchain record
- getEvidence(evidenceId) → retrieves evidence details
- getCustodyHistory(evidenceId) → gets chain of custody history
- getAllCaseEvidence(caseId) → gets all evidence for a case
- getConnectionStatus() → returns blockchain connection status

Supports:
- Local Ganache (http://127.0.0.1:7545)
- Sepolia Testnet (via Alchemy/Infura)
- Mock fallback (when blockchain not available)

Frontend Usage:
- EvidenceRegistration.tsx → calls registerEvidence() which uses addEvidence()
- CustodyTransfer.tsx → calls transferCustody() 
- AnalystDashboard.tsx → calls getEvidenceCustodyHistory()
- EvidenceVerification.tsx → calls verifyEvidence() which uses getEvidence()

---

### 3. hash.js (File Hashing)
Functions Available:
- generateHash(buffer) → SHA256 hash of file content

Frontend Usage:
- Backend generates hashes of uploaded files
- Frontend receives hash and verifies it matches on blockchain
- Used in evidence registration and verification workflows

---

### 4. audit.js (Audit Trail Logging)
Functions Available:
- logAction(params) → creates immutable audit log entry
- getLogs(filters) → retrieves audit logs with optional filtering
- getStats() → returns audit statistics
- getEvidenceHistory(evidenceId) → gets history of specific evidence

Logged Actions:
- USER_LOGIN - User authentication
- USER_REGISTER - New user registration
- EVIDENCE_UPLOAD - Evidence file uploaded
- EVIDENCE_VERIFY - Evidence integrity verified
- CUSTODY_TRANSFER - Custody transferred between users
- EVIDENCE_VIEW - Evidence accessed/viewed
- ACCESS_DENIED - Unauthorized access attempt

Frontend Usage:
- AuditorDashboard.tsx → calls getAllUsers() and displays audit trail
- All page components trigger audit logs via backend API calls

---

## BACKEND ROUTES LAYER

### 1. auth.js Routes (/api/auth/*)

Endpoint: POST /api/auth/login
Request: { username, password }
Response: { success: true, token: "JWT", user: {...} }
Frontend: AuthContext.tsx login()
Audit: Logs USER_LOGIN action

Endpoint: GET /api/auth/profile
Authentication: Required (JWT)
Response: { user: {...} }
Frontend: Not currently used, available for user profile page
Audit: Implicit user access

Endpoint: POST /api/auth/register
Authentication: Required (ADMIN role)
Request: { username, password, role, name, department }
Response: { success: true, user: {...} }
Frontend: Not implemented in UI yet (admin only)

Endpoint: GET /api/auth/users
Authentication: Required (ADMIN role)
Response: { users: [...] }
Frontend: AuditorDashboard.tsx getAllUsers()

Endpoint: POST /api/auth/verify-token
Request: { token }
Response: { valid: true, user: {...} }
Frontend: Not currently used, available for token validation

---

### 2. evidence.js Routes (/api/evidence/*)

Endpoint: POST /api/evidence/upload
Authentication: Required (POLICE role)
Request: FormData with evidenceId, caseId, description, file
Response: { success: true, evidenceId, caseId, hash, txHash, uploadedBy, uploadedAt }
Frontend: EvidenceRegistration.tsx registerEvidence()
Blockchain: addEvidence() called
Audit: Logs EVIDENCE_UPLOAD action

Endpoint: POST /api/evidence/transfer
Authentication: Required (POLICE, LAB roles)
Request: { evidenceId, newOwnerId, reason }
Response: { success: true, evidenceId, previousOwner, newOwner, txHash }
Frontend: CustodyTransfer.tsx transferCustody()
Blockchain: transferCustody() called
Audit: Logs CUSTODY_TRANSFER action

Endpoint: POST /api/evidence/verify
Authentication: Required (JUDGE role)
Request: FormData with evidenceId, file
Response: { verified: true/false, message, originalHash, currentHash, verifiedBy }
Frontend: EvidenceVerification.tsx verifyEvidence()
Blockchain: getEvidence() called for comparison
Audit: Logs EVIDENCE_VERIFY action

Endpoint: GET /api/evidence/:evidenceId
Authentication: Required
Response: { evidence: {...} }
Frontend: AnalystDashboard.tsx - available for detail view
Audit: Logs EVIDENCE_VIEW action

Endpoint: GET /api/evidence/:evidenceId/history
Authentication: Required
Response: { evidenceId, blockchainHistory, auditHistory }
Frontend: AnalystDashboard.tsx getEvidenceCustodyHistory()
Audit: Logs EVIDENCE_VIEW action

Endpoint: GET /api/evidence/case/:caseId
Authentication: Required
Response: { caseId, evidence: [...] }
Frontend: Not currently used, available for case-based queries

Endpoint: GET /api/evidence/:evidenceId/audit
Authentication: Required (ADMIN, JUDGE roles)
Response: { evidenceId, auditTrail: [...] }
Frontend: AuditorDashboard.tsx - could fetch specific evidence audit
Audit: Logs EVIDENCE_VIEW action

Endpoint: GET /api/evidence/assigned
Authentication: Required (LAB, JUDGE roles)
Response: { evidence: [...] }
Frontend: AnalystDashboard.tsx fetchAssignedEvidence()
Audit: Implicit user access

---

### 3. Health Check Route (/api/health)

Endpoint: GET /api/health
Authentication: Not required
Response: { status: "ok", time, blockchain: {...}, audit: {...} }
Frontend: Can be used for system status checks
Used in: Backend connection verification

---

## MIDDLEWARE LAYER

### auth.js (Authentication Middleware)

Functions:
- verifyToken(req, res, next) → validates JWT token
  * Extracts token from "Bearer token" format
  * Validates token signature and expiry
  * Attaches user object to request

- allowRoles(roles) → validates user role
  * Returns 403 Forbidden if role not allowed
  * Used on protected endpoints

Frontend Integration:
- Auth token stored in localStorage after login
- API client (api.ts) automatically includes "Authorization: Bearer {token}" header
- ProtectedRoute component checks role before rendering pages

---

## FRONTEND-TO-BACKEND MAPPING

### Authentication Flow
Frontend Component: AuthContext.tsx
↓ login(email, password)
↓ API Call: POST /api/auth/login { username: email, password }
↓ Backend: auth.js findByUsername() + validatePassword()
↓ Response: JWT token + user object
↓ localStorage: store jwt, role, name

### Evidence Registration (Police Officer)
Frontend Component: EvidenceRegistration.tsx
↓ handleSubmit() with form data + file
↓ API Call: POST /api/evidence/upload FormData
↓ Backend: routes/evidence.js POST /upload
  ├─ Middleware: verifyToken() + allowRoles(['POLICE'])
  ├─ Services: hash.generateHash(file)
  ├─ Services: blockchain.addEvidence(evidenceId, caseId, hash, userId)
  ├─ Services: audit.logAction(EVIDENCE_UPLOAD)
  └─ Response: { success, evidenceId, hash, txHash, uploadedBy, uploadedAt }
↓ Frontend: Show status message with blockchain reference

### Evidence Analysis (Lab Analyst)
Frontend Component: AnalystDashboard.tsx
↓ useEffect: fetchAssignedEvidence()
↓ API Call: GET /api/evidence/assigned
↓ Backend: routes/evidence.js GET /assigned
  ├─ Middleware: verifyToken() + allowRoles(['LAB', 'JUDGE'])
  ├─ Services: getAllCaseEvidence() or mock data
  └─ Response: { evidence: [...] }
↓ Frontend: Display list of assigned evidence
↓ On select: getEvidenceCustodyHistory(evidenceId)
  ├─ API Call: GET /api/evidence/:evidenceId/history
  ├─ Backend: routes/evidence.js GET /:evidenceId/history
  ├─ Services: blockchain.getCustodyHistory()
  ├─ Services: audit.getEvidenceHistory()
  └─ Response: { blockchainHistory, auditHistory }
↓ Frontend: Show custody chain and details

### Evidence Verification (Judge)
Frontend Component: EvidenceVerification.tsx
↓ handleSubmit() with evidenceId + file
↓ API Call: POST /api/evidence/verify FormData
↓ Backend: routes/evidence.js POST /verify
  ├─ Middleware: verifyToken() + allowRoles(['JUDGE'])
  ├─ Services: hash.generateHash(file)
  ├─ Services: blockchain.getEvidence(evidenceId)
  ├─ Compare hashes
  ├─ Services: audit.logAction(EVIDENCE_VERIFY)
  └─ Response: { verified: true/false, originalHash, currentHash, verifiedBy }
↓ Frontend: Show verification result (✓ or ✗)

### Custody Transfer (Police/Lab)
Frontend Component: CustodyTransfer.tsx
↓ handleSubmit() with evidenceId, recipient, notes
↓ API Call: POST /api/evidence/transfer
↓ Backend: routes/evidence.js POST /transfer
  ├─ Middleware: verifyToken() + allowRoles(['POLICE', 'LAB'])
  ├─ Services: blockchain.transferCustody(evidenceId, newOwnerId)
  ├─ Services: audit.logAction(CUSTODY_TRANSFER)
  └─ Response: { success, evidenceId, previousOwner, newOwner, txHash }
↓ Frontend: Show transfer confirmation with transaction ref

### Audit Dashboard (Admin/System)
Frontend Component: AuditorDashboard.tsx
↓ useEffect: getAllUsers()
↓ API Call: GET /api/auth/users
↓ Backend: routes/auth.js GET /users
  ├─ Middleware: verifyToken() + allowRoles(['ADMIN'])
  ├─ Services: users.getAllUsers()
  └─ Response: { users: [...] }
↓ Frontend: Build user directory
↓ Display audit trail from demo data
↓ Alternative: could fetch getEvidenceAudit(evidenceId) for specific items

---

## ENVIRONMENT CONFIGURATION

Backend (.env):
PORT=5000                    → Running port
JWT_SECRET=...              → Token signing key
JWT_EXPIRES_IN=24h          → Token validity
BLOCKCHAIN_RPC_URL=...      → Ganache or Sepolia endpoint
CONTRACT_ADDRESS=...        → Smart contract address
ACCOUNT_ADDRESS=...         → Account deploying contracts
ACCOUNT_PRIVATE_KEY=...     → Private key for signing (testnet only)
NODE_ENV=development        → Environment type

Frontend (.env):
VITE_API_URL=http://localhost:5000/api → Backend URL (dev)
VITE_API_URL=/api                      → Backend URL (prod with proxy)

---

## ROLE-BASED ACCESS CONTROL

POLICE Role:
- POST /api/evidence/upload → Register evidence
- POST /api/evidence/transfer → Transfer custody
- GET /api/evidence/* → View evidence
- Accessible Routes: /police, /police/register, /police/transfer

LAB Role:
- GET /api/evidence/assigned → View assigned evidence
- GET /api/evidence/:id/history → View custody history
- POST /api/evidence/transfer → Transfer custody
- Accessible Routes: /analyst

JUDGE Role:
- GET /api/evidence/assigned → View evidence
- POST /api/evidence/verify → Verify evidence integrity
- GET /api/evidence/:id/audit → View audit trail
- Accessible Routes: /judge, /judge/verify

ADMIN Role:
- GET /api/auth/users → View all users
- GET /api/evidence/:id/audit → View all audits
- POST /api/auth/register → Register new users
- Accessible Routes: /auditor

---

## DATA FLOW SUMMARY

Evidence Lifecycle:
1. POLICE Officer uploads evidence → blockchain.addEvidence() → audit.logAction(UPLOAD)
2. Evidence hashed (SHA256) → stored on-chain → audit recorded
3. LAB Analyst retrieves assigned evidence → blockchain.getCustodyHistory()
4. LAB performs analysis → notes custody chain
5. POLICE transfers to next custodian → blockchain.transferCustody() → audit.logAction(TRANSFER)
6. JUDGE verifies integrity → hash comparison → audit.logAction(VERIFY)
7. ADMIN views complete audit trail → audit.getLogs() with filters

Each action:
- Stored on blockchain (if available)
- Logged to audit trail
- Returned to frontend with transaction reference
- Displayed to user with status/confirmation

---

## MISSING/OPTIONAL FEATURES

Currently not implemented in frontend but available in backend:

1. User Registration (POST /api/auth/register)
   - Available in backend but no UI for user admin
   - Could add admin panel

2. Case-based evidence retrieval (GET /api/evidence/case/:caseId)
   - Backend has getAllCaseEvidence()
   - Could add case filter to evidence lists

3. Specific evidence audit lookup (GET /api/evidence/:id/audit)
   - Backend supports it but using demo data in UI
   - Could enhance with real backend queries

4. User profile page (GET /api/auth/profile)
   - Backend endpoint exists
   - Could add profile viewing page

---

## BLOCKCHAIN INTEGRATION

When Blockchain is UP (Ganache/Sepolia):
- All evidence records stored on-chain
- Transaction hashes returned to frontend
- Links to block explorer (Sepolia Etherscan)
- Immutable audit trail

When Blockchain is DOWN:
- Falls back to mock storage (mockDB)
- Mock transaction hashes generated
- System continues operating
- Data marked as "pending blockchain confirmation"

---

## SYSTEM RELIABILITY

Error Handling:
- Backend validates all inputs
- Frontend catches API errors and shows user-friendly messages
- Fallback demo data when real data unavailable
- Audit logging on success and failure

Security:
- JWT token-based authentication
- Role-based access control (RBAC) on all endpoints
- Password hashing with SHA256 (bcrypt recommended for production)
- Request middleware validates authentication before processing
- Audit trail captures all actions with timestamp, user, IP

Logging:
- Console logs in backend for debugging
- Audit logs in memory (database in production)
- Frontend error logs to console
- Chain of custody timestamps at each step
