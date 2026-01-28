SYSTEM API ENDPOINTS - COMPREHENSIVE REFERENCE
==============================================

BASE URL: http://localhost:5000 (development)
All endpoints require HTTP headers with proper format.

═════════════════════════════════════════════════════════════════════════════

AUTHENTICATION ENDPOINTS (/api/auth)
═════════════════════════════════════════════════════════════════════════════

1. LOGIN
   URL:    POST /api/auth/login
   Auth:   None
   Body:   {
             "username": "officer_sharma",
             "password": "police123"
           }
   
   Success (200):
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "USR001",
       "username": "officer_sharma",
       "name": "Inspector Sharma",
       "role": "POLICE"
     }
   }
   
   Error (401):
   { "error": "Invalid credentials" }

   Frontend: AuthContext.tsx login()
   Demo Users:
   - officer_sharma / police123 (POLICE)
   - lab_verma / lab123 (LAB)
   - judge_mehta / judge123 (JUDGE)
   - admin / admin123 (ADMIN)

─────────────────────────────────────────────────────────────────────────────

2. GET USER PROFILE
   URL:    GET /api/auth/profile
   Auth:   Bearer token (required)
   Body:   None
   
   Success (200):
   {
     "user": {
       "id": "USR001",
       "username": "officer_sharma",
       "name": "Inspector Sharma",
       "role": "POLICE",
       "department": "Mumbai Police - Cyber Crime",
       "badgeNumber": "MH-CYB-4521"
     }
   }
   
   Error (401):
   { "error": "No token provided" }

   Frontend: Optional - getUserProfile() available in api.ts

─────────────────────────────────────────────────────────────────────────────

3. LIST ALL USERS
   URL:    GET /api/auth/users
   Auth:   Bearer token (required)
   Role:   ADMIN only
   Body:   None
   
   Success (200):
   {
     "users": [
       {
         "id": "USR001",
         "username": "officer_sharma",
         "name": "Inspector Sharma",
         "role": "POLICE",
         "department": "Mumbai Police - Cyber Crime"
       },
       ...
     ]
   }
   
   Error (403):
   { "error": "Access denied" }

   Frontend: AuditorDashboard.tsx getAllUsers()

─────────────────────────────────────────────────────────────────────────────

4. REGISTER NEW USER
   URL:    POST /api/auth/register
   Auth:   Bearer token (required)
   Role:   ADMIN only
   Body:   {
             "username": "new_officer",
             "password": "securepass123",
             "role": "POLICE",
             "name": "New Officer Name",
             "department": "Police Department"
           }
   
   Success (201):
   {
     "success": true,
     "user": {
       "id": "USR008",
       "username": "new_officer",
       "name": "New Officer Name",
       "role": "POLICE"
     }
   }
   
   Error (400):
   { "error": "Missing required fields" }
   
   Error (409):
   { "error": "Username taken" }

   Frontend: Not implemented in UI (admin only feature)

─────────────────────────────────────────────────────────────────────────────

5. VERIFY TOKEN
   URL:    POST /api/auth/verify-token
   Auth:   None
   Body:   {
             "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
           }
   
   Success (200):
   {
     "valid": true,
     "user": {
       "userId": "USR001",
       "username": "officer_sharma",
       "role": "POLICE"
     }
   }
   
   Invalid (200):
   { "valid": false }

   Frontend: Optional - can be used for session validation

═════════════════════════════════════════════════════════════════════════════

EVIDENCE ENDPOINTS (/api/evidence)
═════════════════════════════════════════════════════════════════════════════

1. UPLOAD / REGISTER EVIDENCE
   URL:    POST /api/evidence/upload
   Auth:   Bearer token (required)
   Role:   POLICE only
   Body:   FormData with:
           - evidenceId: "EV-2026-001" (string)
           - caseId: "CASE-2026-042" (string)
           - description: "Optional evidence description" (string)
           - file: <file object> (binary)
   
   Success (201):
   {
     "success": true,
     "evidenceId": "EV-2026-001",
     "caseId": "CASE-2026-042",
     "hash": "7a3f9c8b2d1e4f5a9c3b6d8e1f4a7b9c...",
     "txHash": "0x4b2e5f8a1d4c7b0e3f6a9c2d5e8b1f4a",
     "uploadedBy": "Inspector Sharma",
     "uploadedAt": "2026-01-28T09:15:23.000Z"
   }
   
   Error (400):
   { "error": "Missing evidenceId, caseId or file" }
   
   Error (401):
   { "error": "No token provided" }
   
   Error (403):
   { "error": "Access denied" }

   Frontend: EvidenceRegistration.tsx registerEvidence()
   Blockchain: Calls addEvidence()
   Audit: Logs EVIDENCE_UPLOAD

─────────────────────────────────────────────────────────────────────────────

2. TRANSFER CUSTODY
   URL:    POST /api/evidence/transfer
   Auth:   Bearer token (required)
   Role:   POLICE, LAB
   Body:   {
             "evidenceId": "EV-2026-001",
             "newOwnerId": "USR003",
             "reason": "Transfer to forensic lab for analysis"
           }
   
   Success (200):
   {
     "success": true,
     "evidenceId": "EV-2026-001",
     "previousOwner": "USR001",
     "newOwner": "USR003",
     "txHash": "0x9d5c1f2a8b4e7c3d6f1a4b8e2c5d9f3a"
   }
   
   Error (400):
   { "error": "Missing evidenceId or newOwnerId" }
   
   Error (404):
   { "error": "Evidence not found" }

   Frontend: CustodyTransfer.tsx transferCustody()
   Blockchain: Calls transferCustody()
   Audit: Logs CUSTODY_TRANSFER

─────────────────────────────────────────────────────────────────────────────

3. VERIFY EVIDENCE INTEGRITY
   URL:    POST /api/evidence/verify
   Auth:   Bearer token (required)
   Role:   JUDGE only
   Body:   FormData with:
           - evidenceId: "EV-2026-001" (string)
           - file: <file object> (binary) - the evidence file to verify
   
   Success (200):
   {
     "verified": true,
     "message": "Evidence intact - no tampering detected",
     "originalHash": "7a3f9c8b2d1e4f5a9c3b6d8e1f4a7b9c...",
     "currentHash": "7a3f9c8b2d1e4f5a9c3b6d8e1f4a7b9c...",
     "verifiedBy": "Hon. Justice Mehta"
   }
   
   Tampered (200):
   {
     "verified": false,
     "message": "WARNING: Evidence has been modified!",
     "originalHash": "7a3f9c8b2d1e4f5a9c3b6d8e1f4a7b9c...",
     "currentHash": "different_hash_here...",
     "verifiedBy": "Hon. Justice Mehta"
   }
   
   Error (400):
   { "error": "Missing evidenceId or file" }
   
   Error (404):
   { "error": "Evidence not found" }

   Frontend: EvidenceVerification.tsx verifyEvidence()
   Blockchain: Calls getEvidence() to get original hash
   Audit: Logs EVIDENCE_VERIFY

─────────────────────────────────────────────────────────────────────────────

4. GET EVIDENCE DETAILS
   URL:    GET /api/evidence/:evidenceId
   Auth:   Bearer token (required)
   Params: evidenceId = "EV-2026-001" (in URL)
   Body:   None
   
   Success (200):
   {
     "evidence": {
       "evidenceId": "EV-2026-001",
       "caseId": "CASE-2026-042",
       "hash": "7a3f9c8b2d1e4f5a9c3b6d8e1f4a7b9c...",
       "owner": "USR001",
       "timestamp": "2026-01-28T09:15:23.000Z",
       "status": "Registered"
     }
   }
   
   Error (404):
   { "error": "Not found" }

   Frontend: AnalystDashboard.tsx getEvidenceDetails() available
   Audit: Logs EVIDENCE_VIEW

─────────────────────────────────────────────────────────────────────────────

5. GET CUSTODY HISTORY
   URL:    GET /api/evidence/:evidenceId/history
   Auth:   Bearer token (required)
   Params: evidenceId = "EV-2026-001"
   Body:   None
   
   Success (200):
   {
     "evidenceId": "EV-2026-001",
     "blockchainHistory": [
       {
         "owner": "USR001",
         "timestamp": "2026-01-28T09:15:23.000Z",
         "action": "CREATED",
         "txHash": "0x4b2e5f8a1d4c7b0e3f6a9c2d5e8b1f4a"
       },
       {
         "owner": "USR003",
         "timestamp": "2026-01-28T10:30:45.000Z",
         "action": "TRANSFERRED",
         "txHash": "0x9d5c1f2a8b4e7c3d6f1a4b8e2c5d9f3a"
       }
     ],
     "auditHistory": [...]
   }
   
   Error (404):
   { "error": "Evidence not found" }

   Frontend: AnalystDashboard.tsx getEvidenceCustodyHistory()
   Audit: Logs EVIDENCE_VIEW

─────────────────────────────────────────────────────────────────────────────

6. GET EVIDENCE FOR CASE
   URL:    GET /api/evidence/case/:caseId
   Auth:   Bearer token (required)
   Params: caseId = "CASE-2026-042"
   Body:   None
   
   Success (200):
   {
     "caseId": "CASE-2026-042",
     "evidence": [
       {
         "evidenceId": "EV-2026-001",
         "hash": "7a3f9c8b...",
         "status": "Registered"
       },
       {
         "evidenceId": "EV-2026-002",
         "hash": "4b8e2a9f...",
         "status": "In Analysis"
       }
     ]
   }
   
   Error (500):
   { "error": "Internal server error" }

   Frontend: Optional - getAllEvidenceForCase() available in api.ts
   Audit: Logs EVIDENCE_VIEW

─────────────────────────────────────────────────────────────────────────────

7. GET ASSIGNED EVIDENCE (Lab/Judge)
   URL:    GET /api/evidence/assigned
   Auth:   Bearer token (required)
   Role:   LAB, JUDGE
   Body:   None
   
   Success (200):
   {
     "evidence": [
       {
         "evidenceId": "EV-2026-001",
         "caseId": "CASE-2026-042",
         "description": "Digital forensics evidence - USB drive",
         "status": "In Analysis",
         "custody": "Central Forensic Lab",
         "uploadedBy": "Inspector Sharma",
         "uploadedAt": "2026-01-28T09:15:23.000Z",
         "hash": "7a3f9c8b..."
       },
       ...
     ]
   }
   
   Error (403):
   { "error": "Access denied" }

   Frontend: AnalystDashboard.tsx fetchAssignedEvidence()
   Audit: Implicit user access

─────────────────────────────────────────────────────────────────────────────

8. GET EVIDENCE AUDIT TRAIL
   URL:    GET /api/evidence/:evidenceId/audit
   Auth:   Bearer token (required)
   Role:   ADMIN, JUDGE
   Params: evidenceId = "EV-2026-001"
   Body:   None
   
   Success (200):
   {
     "evidenceId": "EV-2026-001",
     "auditTrail": [
       {
         "id": "LOG-1706427323000-a1b2c3d4",
         "timestamp": "2026-01-28T09:15:23.000Z",
         "action": "EVIDENCE_UPLOAD",
         "user": {
           "id": "USR001",
           "username": "officer_sharma",
           "role": "POLICE"
         },
         "details": {
           "fileName": "evidence.zip",
           "fileSize": 5242880,
           "hash": "7a3f9c8b..."
         },
         "txHash": "0x4b2e5f8a...",
         "success": true
       },
       ...
     ]
   }
   
   Error (403):
   { "error": "Access denied" }

   Frontend: Optional - getAuditTrail() available in api.ts
   Audit: Logs EVIDENCE_VIEW

═════════════════════════════════════════════════════════════════════════════

HEALTH CHECK ENDPOINT
═════════════════════════════════════════════════════════════════════════════

1. SYSTEM STATUS
   URL:    GET /api/health
   Auth:   None (public)
   Body:   None
   
   Success (200):
   {
     "status": "ok",
     "time": "2026-01-28T10:30:45.123Z",
     "blockchain": {
       "connected": true,
       "network": "Sepolia Testnet"
     },
     "audit": {
       "totalLogs": 47,
       "todaysActions": 12
     }
   }

   Frontend: Available for health checks but not currently used
   Use Case: System monitoring and connection verification

═════════════════════════════════════════════════════════════════════════════

AUTHENTICATION HEADER FORMAT
═════════════════════════════════════════════════════════════════════════════

All authenticated requests must include:

Header: Authorization
Value:  Bearer <token>

Example:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVU1IwMDEiLCJ1c2VybmFtZSI6Im9mZmljZXJfc2hhcm1hIiwicm9sZSI6IlBPTElDRSIsIm5hbWUiOiJJbnNwZWN0b3IgU2hhcm1hIn0.signature_here

Frontend Handling: api.ts axios interceptor automatically adds this header

═════════════════════════════════════════════════════════════════════════════

ERROR CODES & MEANINGS
═════════════════════════════════════════════════════════════════════════════

200 OK              → Request successful
201 Created         → Resource created successfully
400 Bad Request     → Invalid request parameters or missing fields
401 Unauthorized    → No token provided or token invalid
403 Forbidden       → User lacks permission (role-based)
404 Not Found       → Resource does not exist
409 Conflict        → Resource already exists (e.g., username taken)
500 Server Error    → Internal server error

═════════════════════════════════════════════════════════════════════════════

REQUEST/RESPONSE EXAMPLES
═════════════════════════════════════════════════════════════════════════════

Example 1: Complete Evidence Upload Workflow

Step 1: Login
POST /api/auth/login
{
  "username": "officer_sharma",
  "password": "police123"
}
Response: { token: "abc123...", user: {...} }

Step 2: Store Token
localStorage.setItem('jwt', 'abc123...')

Step 3: Upload Evidence
POST /api/evidence/upload
Headers: { Authorization: "Bearer abc123..." }
FormData: { evidenceId, caseId, description, file }
Response: { success: true, hash, txHash, ... }

Step 4: Show Result to User
Display: "Evidence registered. Blockchain reference: 0x4b2e5f8a..."

─────────────────────────────────────────────────────────────────────────────

Example 2: Evidence Verification Workflow

Step 1: Judge Logs In
Same as above, gets token

Step 2: Judge Uploads Evidence Copy
POST /api/evidence/verify
Headers: { Authorization: "Bearer abc123..." }
FormData: { evidenceId, file }
Response: { verified: true/false, originalHash, currentHash }

Step 3: Display Result
If verified: "✓ Evidence intact - no tampering detected"
If not verified: "✗ WARNING: Evidence has been modified!"

═════════════════════════════════════════════════════════════════════════════

PAGINATION & FILTERING (Future Enhancements)
═════════════════════════════════════════════════════════════════════════════

GET /api/evidence/assigned?limit=10&offset=0
GET /api/auth/users?role=POLICE
GET /api/evidence/:id/history?filter=TRANSFER

Currently not implemented but backend structure supports it.

═════════════════════════════════════════════════════════════════════════════
