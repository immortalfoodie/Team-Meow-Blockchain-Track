# National Blockchain-Based Judicial Evidence Logging System

A full-stack application for secure, tamper-proof judicial evidence management using blockchain technology. This system provides:

- Immutable, tamper-proof ledger for evidence logging
- Chain of custody tracking with blockchain notarization (Sepolia Testnet)
- Role-based access control for judicial stakeholders (Police, Lab, Judge, Admin)
- Evidence integrity verification
- Comprehensive audit trail

---

## Features

- **Backend:** Node.js (Express) with blockchain integration (Ethereum Sepolia Testnet)
- **Frontend:** React + Vite
- **Smart Contract:** Solidity (JudicialEvidenceLedger.sol)
- **Authentication:** JWT-based, role-aware
- **Audit Logging:** All actions are logged and auditable

---

## User Roles & Capabilities

| Role    | Capabilities |
|---------|-------------|
| Police  | Register evidence, transfer custody, upload files |
| Lab     | View/analyze assigned evidence, generate reports |
| Judge   | Verify evidence integrity, view details, access audit |
| Admin   | View all logs, manage users, monitor blockchain |

---

## Quick Start

### 1. Clone the Repository
```sh
git clone https://github.com/immortalfoodie/Team-Meow-Blockchain-Track.git
cd Team-Meow-Blockchain-Track
```

### 2. Backend Setup
```sh
cd meow-backend/backend
cp .env.example .env  # Edit with your blockchain keys
npm install
npm start
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```sh
cd ../../Team-Meow-Blockchain-Track-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Login (Demo Accounts)
- Police:  `officer_sharma` / `police123`
- Lab:     `lab_verma` / `lab123`
- Judge:   `judge_mehta` / `judge123`
- Admin:   `admin` / `admin123`

---

## System Overview

- **Evidence Registration:** Police upload digital evidence, which is hashed and notarized on-chain.
- **Custody Transfer:** Chain of custody is tracked and each transfer is recorded on the blockchain.
- **Verification:** Judges can verify the integrity of evidence by uploading the file and comparing hashes.
- **Audit Trail:** All actions (upload, transfer, verify) are logged and viewable by authorized users.

---

## Smart Contract
- Located at: `meow-backend/backend/contracts/JudicialEvidenceLedger.sol`
- Deployed on: Sepolia Testnet
- Functions: addEvidence, transferCustody, getEvidence, getCustodyTrail, verifyHash, etc.

---

## Folder Structure

```
Team-Meow-Blockchain-Track/
├── meow-backend/
│   └── backend/
│       ├── contracts/         # Solidity smart contract
│       ├── routes/            # Express API routes
│       ├── services/          # Blockchain, audit, user logic
│       ├── uploads/           # Uploaded evidence files
│       └── ...
├── Team-Meow-Blockchain-Track-frontend/
│   ├── src/
│   │   ├── pages/             # React pages (Dashboards, Login, etc.)
│   │   ├── components/        # Shared UI components
│   │   └── api/               # API client
│   └── ...
└── SYSTEM_OVERVIEW.js         # System summary and API reference
```

---

## User Guide

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm
- (Optional) MetaMask for blockchain contract interaction

### 2. Environment Variables
- Copy `.env.example` to `.env` in `meow-backend/backend/` and fill in:
  - `BLOCKCHAIN_RPC_URL` (Sepolia/Alchemy/Infura)
  - `CONTRACT_ADDRESS` (deployed contract)
  - `ACCOUNT_ADDRESS` and `ACCOUNT_PRIVATE_KEY`

### 3. Running the App
- **Backend:**
  - `cd meow-backend/backend && npm start`
- **Frontend:**
  - `cd Team-Meow-Blockchain-Track-frontend && npm run dev`
- Open [http://localhost:5173](http://localhost:5173) in your browser

### 4. Using the App
- **Login** with demo credentials or your own user
- **Police:** Register evidence, transfer custody
- **Lab:** View/analyze assigned evidence
- **Judge:** Verify evidence integrity
- **Admin:** View all logs, manage users

### 5. Blockchain
- All evidence hashes and custody events are recorded on the Sepolia testnet
- You can view contract and transactions on [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

## Support
For issues, open an issue on GitHub or contact the maintainers.

---

## License
MIT
