# National Blockchain-Based Judicial Evidence Logging System
## Comprehensive Technical Documentation

---

## Table of Contents
1. [Problem Statement & Objectives](#problem-statement--objectives)
2. [System Architecture](#system-architecture)
3. [Technical Stack](#technical-stack)
4. [Component Breakdown](#component-breakdown)
5. [How It Works: End-to-End Flow](#how-it-works-end-to-end-flow)
6. [Security & Compliance](#security--compliance)
7. [Deployment Configuration](#deployment-configuration)
8. [Project Roadmap](#project-roadmap)
9. [Future Enhancements](#future-enhancements)

---

## Problem Statement & Objectives

### The Challenge
Digital evidence in judicial proceedings faces critical challenges:
- **Tampering Risk**: Evidence can be modified without detection
- **Chain of Custody**: Difficult to maintain accurate custody records
- **Auditability**: No transparent way to verify evidence history
- **Trust Issues**: Multiple stakeholders need assurance of evidence integrity

### Our Solution
A blockchain-enabled system that provides:
- **Immutability**: Evidence records cannot be altered once recorded
- **Transparency**: Complete audit trail of all evidence interactions
- **Cryptographic Verification**: Mathematical proof of evidence integrity
- **Role-Based Access**: Controlled access based on judicial roles

---

## System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      TIER 1: Frontend                        │
│                      (Person A)                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Upload  │  │ Verify  │  │ History │  │  Auth   │       │
│  │   UI    │  │   UI    │  │   UI    │  │   UI    │       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
└───────┼───────────┼─────────────┼─────────────┼────────────┘
        │           │             │             │
        └───────────┴─────────────┴─────────────┘
                         │
                    REST API
                         │
┌────────────────────────┼────────────────────────────────────┐
│                      TIER 2: Backend                         │
│                      (Person B - YOU)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js REST API                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   JWT    │  │  SHA-256 │  │  Audit   │           │  │
│  │  │  Auth    │  │  Hashing │  │  Logger  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────┘
                          │
                  Web3.js Interface
                          │
┌─────────────────────────┼──────────────────────────────────┐
│                      TIER 3: Blockchain                      │
│                      (Person C)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Smart Contract: JudicialEvidenceLedger      │  │
│  │                                                       │  │
│  │  Functions:                                           │  │
│  │    • addEvidence(id, hash, owner)                    │  │
│  │    • transferCustody(id, newOwner)                   │  │
│  │    • getEvidence(id)                                 │  │
│  │    • getCustodyHistory(id)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│              Ethereum Blockchain (Ganache Local)            │
│                    Immutable Ledger                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Stack

### Backend (Your Responsibility)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js v16+ | JavaScript execution environment |
| **Framework** | Express.js v5 | REST API server |
| **Authentication** | JWT (jsonwebtoken) | Stateless user authentication |
| **Blockchain** | Web3.js v4 | Ethereum interaction |
| **Hashing** | Node crypto (SHA-256) | Evidence integrity verification |
| **File Handling** | Multer | Evidence file uploads |
| **CORS** | cors | Cross-origin resource sharing |
| **Environment** | dotenv | Configuration management |

### Blockchain Layer

| Component | Details |
|-----------|---------|
| **Network** | Ethereum (Ganache Local) |
| **RPC URL** | http://127.0.0.1:8545 |
| **Chain ID** | 1337 |
| **Contract** | JudicialEvidenceLedger |
| **Address** | 0x1a8465E39f3538c9f3E3710a39F5269ad6F76ec7 |
| **Language** | Solidity (by Person C) |

---

## Component Breakdown

### 1. Authentication System (`services/users.js`, `routes/auth.js`, `middleware/auth.js`)

#### How It Works

**User Database:**
```javascript
// Mock in-memory database with pre-configured judicial users
const users = [
  { id: "USR001", username: "officer_sharma", role: "POLICE", ... },
  { id: "USR003", username: "lab_verma", role: "LAB", ... },
  { id: "USR005", username: "judge_mehta", role: "JUDGE", ... },
  { id: "USR007", username: "admin", role: "ADMIN", ... }
];
```

**Login Flow:**
1. User submits credentials
2. Backend validates username/password
3. System generates JWT token with user details
4. Token contains: `{ userId, username, role, name }`
5. Token signed with secret key (from .env)
6. Token valid for 24 hours

**JWT Structure:**
```
Header:    { "alg": "HS256", "typ": "JWT" }
Payload:   { "userId": "USR001", "role": "POLICE", ... }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

**Role-Based Access Control:**
```javascript
// Middleware checks token and role
allowRoles(["POLICE"]) → Only police can access
allowRoles(["POLICE", "LAB"]) → Police OR lab can access
```

---

### 2. Evidence Upload System

#### The Process

**Step 1: Police Officer Uploads Evidence**
```
POST /api/evidence/upload
Headers: Authorization: Bearer <jwt-token>
Body (multipart):
  - file: evidence.pdf
  - evidenceId: EVD-2024-001
  - caseId: CASE-2024-001
  - description: "Digital forensic image"
```

**Step 2: Backend Processing**
```javascript
// 1. Receive file as buffer
const fileBuffer = req.file.buffer;

// 2. Generate SHA-256 hash (digital fingerprint)
const hash = crypto.createHash("sha256")
  .update(fileBuffer)
  .digest("hex");
// Result: "a7ffc6f8bf1ed76651c14756a061d662..."

// 3. Record on blockchain
const txHash = await contract.methods
  .addEvidence(evidenceId, caseId, hash, owner)
  .send({ from: ACCOUNT, gas: 3000000 });
```

**Step 3: Blockchain Records**
```solidity
// Smart contract stores:
struct Evidence {
    string evidenceId;
    string caseId;
    string hash;        // SHA-256 hash
    string owner;       // Current custodian
    uint256 timestamp;  // When recorded
}
```

**Step 4: Audit Log**
```javascript
// Parallel audit trail (off-chain)
{
  action: "EVIDENCE_UPLOAD",
  userId: "USR001",
  username: "officer_sharma",
  evidenceId: "EVD-2024-001",
  details: { fileName: "evidence.pdf", hash: "a7ffc..." },
  txHash: "0x123abc...",
  timestamp: "2024-01-27T14:30:00Z"
}
```

---

### 3. Evidence Verification System

#### How Tamper Detection Works

**The Mathematical Principle:**
- Any change to a file (even 1 bit) completely changes its SHA-256 hash
- Blockchain stores the original hash immutably
- Re-hashing the file and comparing proves integrity

**Step 1: Judge Uploads File to Verify**
```
POST /api/evidence/verify
Headers: Authorization: Bearer <judge-token>
Body:
  - file: evidence.pdf
  - evidenceId: EVD-2024-001
```

**Step 2: Backend Verification**
```javascript
// 1. Re-hash the uploaded file
const newHash = generateHash(req.file.buffer);

// 2. Fetch original hash from blockchain
const evidence = await contract.methods
  .getEvidence(evidenceId)
  .call();

// 3. Compare hashes
const isValid = (newHash === evidence.hash);
```

**Step 3: Response**
```javascript
{
  verified: true/false,
  message: "Evidence intact" OR "Evidence tampered!",
  originalHash: "a7ffc6...",
  currentHash: "a7ffc..." OR "different-hash",
  verifiedBy: "Hon. Justice Mehta"
}
```

---

### 4. Chain of Custody System

#### Tracking Evidence Movement

**Custody Transfer Flow:**
```
Police → Lab → Judge

1. Police uploads evidence
   Owner: USR001 (officer_sharma)
   
2. Police transfers to Lab
   POST /api/evidence/transfer
   { evidenceId: "EVD-001", newOwnerId: "USR003" }
   
3. Blockchain records transfer
   Event: CustodyTransferred
   Previous: USR001
   New: USR003
   
4. Lab analyzes and transfers to Judge
   Repeat process
```

**Blockchain Custody History:**
```javascript
[
  { owner: "USR001", timestamp: 1706361000, action: "CREATED" },
  { previousOwner: "USR001", owner: "USR003", timestamp: 1706447400, action: "TRANSFER" },
  { previousOwner: "USR003", owner: "USR005", timestamp: 1706533800, action: "TRANSFER" }
]
```

---

### 5. Audit Logging System (`services/audit.js`)

#### Dual-Layer Logging

**Why Two Audit Systems?**
1. **Blockchain**: Immutable evidence records (expensive, permanent)
2. **Audit Service**: Detailed activity logs (cheap, searchable)

**What Gets Logged:**
```javascript
Every action logs:
- Timestamp (ISO 8601)
- User (ID, username, role)
- Action type (UPLOAD, VERIFY, TRANSFER, ACCESS_DENIED)
- Evidence/Case IDs
- Success/failure status
- Transaction hash (if blockchain)
- IP address
- Additional details
```

**Audit Statistics:**
```javascript
getStats() → {
  totalLogs: 1,247,
  byAction: {
    EVIDENCE_UPLOAD: 523,
    CUSTODY_TRANSFER: 312,
    EVIDENCE_VERIFY: 198
  },
  byRole: {
    POLICE: 835,
    LAB: 312,
    JUDGE: 100
  },
  successRate: "98.5%"
}
```

---

### 6. Blockchain Integration (`services/blockchain.js`)

#### Dual-Mode Architecture

**Production Mode (Ganache Running):**
```javascript
if (blockchain is accessible) {
  → Use real smart contract
  → Record transactions on chain
  → Pay gas fees
  → Get transaction hashes
}
```

**Development Mode (Ganache Not Running):**
```javascript
else {
  → Use mock in-memory storage
  → Simulate blockchain behavior
  → No gas fees
  → Generate mock transaction hashes
}
```

**Smart Contract Functions:**

| Function | Purpose | Returns |
|----------|---------|---------|
| `addEvidence()` | Record new evidence | Transaction hash |
| `transferCustody()` | Change ownership | Transaction hash |
| `getEvidence()` | Retrieve evidence | Evidence struct |
| `getCustodyHistory()` | Get all transfers | Array of events |
| `getAllCaseEvidence()` | List case evidence | Array of IDs |

---

## How It Works: End-to-End Flow

### Complete Evidence Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                   1. EVIDENCE COLLECTION                      │
└──────────────────────────────────────────────────────────────┘
                          ↓
         Police officer collects digital evidence
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   2. AUTHENTICATION                           │
└──────────────────────────────────────────────────────────────┘
                          ↓
         POST /api/auth/login
         Credentials: officer_sharma / police123
         Receive: JWT token
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   3. EVIDENCE UPLOAD                          │
└──────────────────────────────────────────────────────────────┘
                          ↓
         POST /api/evidence/upload
         File: evidence.pdf (5 MB)
            ↓
         Backend generates hash:
         a7ffc6f8bf1ed76651c14756a061d662...
            ↓
         Smart contract called:
         addEvidence("EVD-001", "CASE-001", hash, "USR001")
            ↓
         Blockchain transaction:
         TxHash: 0x8f3e2c1b0a9f8e7d6c5b4a3928170615...
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   4. CUSTODY TRANSFER                         │
└──────────────────────────────────────────────────────────────┘
                          ↓
         Police → Lab (for analysis)
         POST /api/evidence/transfer
         { evidenceId: "EVD-001", newOwnerId: "USR003" }
            ↓
         Blockchain records transfer
         Event emitted: CustodyTransferred
                          ↓
         Lab → Judge (after analysis)
         Repeat transfer process
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   5. COURT VERIFICATION                       │
└──────────────────────────────────────────────────────────────┘
                          ↓
         Judge receives physical evidence
         Judge uploads file to verify
            ↓
         POST /api/evidence/verify
         File: evidence.pdf
            ↓
         Backend:
         1. Re-hashes file
         2. Fetches original hash from blockchain
         3. Compares: newHash === blockchainHash
            ↓
         Result: VERIFIED or TAMPERED
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   6. AUDIT TRAIL                              │
└──────────────────────────────────────────────────────────────┘
                          ↓
         GET /api/evidence/EVD-001/history
            ↓
         Returns complete chain of custody:
         - When created
         - All transfers
         - Who accessed
         - Verification attempts
```

---

## Security & Compliance

### Cryptographic Security

**1. Evidence Integrity (SHA-256)**
```
SHA-256 Properties:
- Deterministic: Same input → Same hash
- Avalanche effect: 1 bit change → Completely different hash
- Collision resistant: Impossible to find two files with same hash
- One-way: Cannot reverse hash to get original file
```

**2. Authentication (JWT)**
```
JWT Security:
- Signed with HMAC-SHA256
- Secret key stored in environment variable
- Token expires in 24 hours
- Cannot be forged without secret key
```

**3. Blockchain Immutability**
```
Why Blockchain Can't Be Tampered:
- Each block contains hash of previous block
- Changing one record requires changing entire chain
- Distributed consensus (in production networks)
- Cryptographic proof of work
```

### Role-Based Access Control

| Role | Upload | Transfer | Verify | Audit | Register Users |
|------|--------|----------|--------|-------|----------------|
| **POLICE** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **LAB** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **JUDGE** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **ADMIN** | ❌ | ❌ | ❌ | ✅ | ✅ |

### Data Privacy

**What's Stored On-Chain:**
- Evidence ID
- Case ID
- SHA-256 hash
- Owner ID
- Timestamp

**What's NOT Stored On-Chain:**
- Actual evidence file (too large, privacy concerns)
- Sensitive case details
- Personal information

---

## Deployment Configuration

### Environment Setup

```env
# Server
PORT=5000

# JWT Security
JWT_SECRET=production-secret-key-256-bits-minimum
JWT_EXPIRES_IN=24h

# Blockchain (Ganache Local)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x1a8465E39f3538c9f3E3710a39F5269ad6F76ec7
ACCOUNT_ADDRESS=0x760e87b1afcBe2eBe1c5c5c3C3f5eE2DaEc36134
ACCOUNT_PRIVATE_KEY=<from-ganache>

# Environment
NODE_ENV=development
```

### Network Configuration

**Ganache (Local Development):**
```
Network: Ethereum (Local)
RPC: http://127.0.0.1:8545
Chain ID: 1337
Block Time: Instant
Gas Limit: Unlimited
Accounts: 10 pre-funded
```

**Production (Future):**
```
Network: Ethereum Mainnet / Polygon / Private Chain
RPC: https://mainnet.infura.io/v3/YOUR-PROJECT-ID
Chain ID: 1 (Mainnet) / 137 (Polygon)
Gas: Market rates
Authentication: Required
```

---

## Project Roadmap

### Phase 1: Foundation (✅ COMPLETED)

**Week 1-2: Core Development**
- [x] Backend REST API setup
- [x] JWT authentication system
- [x] User management with roles
- [x] SHA-256 hashing service
- [x] Blockchain integration (Web3.js)
- [x] Mock mode for development

**Week 2-3: Evidence Management**
- [x] Evidence upload endpoint
- [x] Custody transfer system
- [x] Evidence verification
- [x] Chain of custody tracking
- [x] Audit logging system

**Week 3-4: Testing & Documentation**
- [x] API testing
- [x] Blockchain integration testing
- [x] Technical documentation
- [x] API reference guide

### Phase 2: Integration (CURRENT)

**Frontend Integration (Person A)**
- [ ] Connect frontend to backend API
- [ ] Implement file upload UI
- [ ] Implement verification UI
- [ ] Display custody history
- [ ] User authentication flow

**Smart Contract Deployment (Person C)**
- [x] Deploy JudicialEvidenceLedger contract
- [x] Verify contract functions
- [ ] Test with frontend/backend
- [ ] Production deployment

### Phase 3: Enhancement (NEXT)

**Week 5-6: Advanced Features**
- [ ] File storage system (IPFS or cloud)
- [ ] Email notifications on custody transfer
- [ ] Multi-signature approvals
- [ ] Evidence expiry and archival
- [ ] Advanced search and filtering

**Week 7-8: Production Readiness**
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Rate limiting and DDoS protection
- [ ] HTTPS/TLS setup
- [ ] Production deployment guide
- [ ] Monitoring and logging

### Phase 4: Scale & Optimize (FUTURE)

**National Deployment**
- [ ] Multi-region deployment
- [ ] Load balancing
- [ ] Disaster recovery
- [ ] 99.9% uptime SLA
- [ ] Integration with existing judicial systems

---

## Future Enhancements

### 1. Storage Integration

**IPFS (InterPlanetary File System):**
```
Current: File hashed, only hash stored
Future: File stored on IPFS, IPFS hash on blockchain

Benefits:
- Decentralized storage
- File always accessible
- Content-addressed
- No single point of failure
```

**Implementation:**
```javascript
// Upload evidence file to IPFS
const ipfsHash = await ipfs.add(file);

// Store IPFS hash on blockchain
await contract.methods
  .addEvidence(evidenceId, caseId, fileHash, ipfsHash, owner)
  .send();
```

### 2. Advanced Verification

**Multi-Modal Verification:**
```
- File hash verification (current)
- Digital signature verification
- Timestamp verification
- Geolocation verification
- Device fingerprinting
```

### 3. Smart Contract Features

**Automated Evidence Expiry:**
```solidity
function archiveEvidence(string evidenceId) {
    require(block.timestamp > evidence.expiryDate);
    evidence.archived = true;
}
```

**Multi-Signature Approvals:**
```solidity
function transferCustodyWithApproval(string evidenceId, string newOwner) {
    require(approvalCount >= 2); // Requires 2 approvals
    transferCustody(evidenceId, newOwner);
}
```

### 4. Integration APIs

**External System Integration:**
```
- Police FIR systems
- Court management systems
- Forensic lab systems
- National Crime Records Bureau
```

### 5. Analytics Dashboard

**System Metrics:**
- Total evidence logged
- Average custody transfer time
- Verification success rate
- Most active cases
- System performance

---

## Conclusion

This system provides a **legally defensible, cryptographically secure, and fully auditable** platform for managing judicial evidence. The blockchain ensures **immutability and transparency**, while the backend provides **practical usability and role-based access control**.

The architecture is designed to be:
- **Scalable**: Can handle millions of evidence records
- **Secure**: Multiple layers of cryptographic protection
- **Compliant**: Meets judicial requirements
- **Extensible**: Easy to add new features
- **Maintainable**: Clean code structure

---

**Project Team:**
- **Person A**: Frontend Development
- **Person B (You)**: Backend Trust Layer
- **Person C**: Blockchain Smart Contracts

**Contact & Support:**
- GitHub: https://github.com/immortalfoodie/Team-Meow-Blockchain-Track
- Branch: `backend`

---

*Document Version: 1.0*  
*Last Updated: January 27, 2026*
