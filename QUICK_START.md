# Quick Start Guide

## 🚀 Start Here

### Prerequisites
- Node.js 18+ installed
- npm installed

### 3-Minute Quick Start

#### Option 1: Automatic Setup (Windows)
```bash
cd copy-withfrontend
setup.bat
```

#### Option 2: Automatic Setup (Linux/Mac)
```bash
cd copy-withfrontend
bash setup.sh
```

#### Option 3: Manual Setup
```bash
# Backend
cd meow-backend/backend
npm install
npm start

# In another terminal
cd Team-Meow-Blockchain-Track-frontend
npm install
npm run dev
```

### Access the Application
- 🌐 Frontend: **http://localhost:5173**
- 🔌 Backend: **http://localhost:5000**
- 📋 API Health: **http://localhost:5000/api/health**

---

## 📝 Test Login

**Email**: `officer@demo.local`  
**Password**: `password123`

Other demo accounts:
- `analyst@demo.local` / `password123`
- `judge@demo.local` / `password123`

---

## 📁 Project Structure

```
copy-withfrontend/
├── meow-backend/backend/          # Node.js Express Server
│   ├── .env                        # Config (PORT=5000)
│   ├── server.js                   # Main server
│   ├── routes/
│   │   ├── auth.js                 # Login, register
│   │   └── evidence.js             # Upload, verify, transfer
│   └── services/                   # Business logic
│
├── Team-Meow-Blockchain-Track-frontend/  # React App
│   ├── .env                        # Dev config
│   ├── .env.production             # Prod config
│   ├── vite.config.ts              # API proxy
│   └── src/
│       ├── api/api.ts              # API client
│       ├── pages/                  # Dashboard pages
│       └── context/AuthContext.tsx # Auth state
│
├── INTEGRATION_GUIDE.md            # Full setup guide
├── ARCHITECTURE.md                 # System design
├── CONNECTION_CHECKLIST.md         # Verification steps
└── CHANGES_SUMMARY.md              # What was changed

```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login              # Login with username/password
GET    /api/auth/profile            # Get current user
POST   /api/auth/register           # Register new user (admin)
GET    /api/auth/users              # List users (admin)
POST   /api/auth/verify-token       # Verify JWT token
```

### Evidence Management
```
POST   /api/evidence/upload         # Upload evidence
POST   /api/evidence/transfer       # Transfer custody
POST   /api/evidence/verify         # Verify integrity
GET    /api/evidence/:id            # Get evidence details
GET    /api/evidence/:id/history    # Get custody history
GET    /api/evidence/:id/audit      # Get audit trail
GET    /api/evidence/case/:caseId   # Get case evidence
```

### Health Check
```
GET    /api/health                  # Server and blockchain status
GET    /                             # API info
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port already in use | Change PORT in `.env` |
| CORS error | Ensure backend is running with proxy |
| Login fails | Check backend console for errors |
| 404 on API call | Verify backend running on port 5000 |
| No token stored | Check localStorage in DevTools |

See **CONNECTION_CHECKLIST.md** for detailed troubleshooting.

---

## 📊 Frontend Pages

- 🔐 **Login** (`/login`) - Authentication
- 👮 **Police Dashboard** (`/police`) - Evidence registration
- 🔬 **Analyst Dashboard** (`/analyst`) - Evidence analysis  
- 📋 **Auditor Dashboard** (`/auditor`) - Audit viewing
- ⚖️ **Judge Dashboard** (`/judge`) - Evidence verification

---

## 🔑 Key Files to Know

### Frontend
- `src/api/api.ts` - All API calls
- `src/context/AuthContext.tsx` - Authentication state
- `src/pages/` - Dashboard pages
- `vite.config.ts` - Build config & proxy

### Backend
- `server.js` - Server setup
- `routes/auth.js` - Authentication logic
- `routes/evidence.js` - Evidence management
- `services/` - Business logic

---

## 📚 Complete Documentation

For detailed information, see:

1. **INTEGRATION_GUIDE.md** - Full setup, troubleshooting, deployment
2. **ARCHITECTURE.md** - System design, data flows, tech stack
3. **CONNECTION_CHECKLIST.md** - Verification steps, testing, issues
4. **CHANGES_SUMMARY.md** - All modifications made

---

## 🚢 Deployment

### Build Frontend
```bash
cd Team-Meow-Blockchain-Track-frontend
npm run build
# Creates dist/ folder
```

### Deploy
- Serve `dist/` folder as static files
- Backend on same or different origin
- Update `VITE_API_URL` in `.env.production`

---

## ✅ Verification

1. Backend running?
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Frontend running?
   ```
   Open http://localhost:5173
   ```

3. Can login?
   ```
   Email: officer@demo.local
   Password: password123
   ```

4. API working?
   - Open DevTools (F12)
   - Go to Network tab
   - Try to login
   - Should see POST /api/auth/login request

---

## 🎯 Next Steps

- [ ] Run setup script
- [ ] Start backend
- [ ] Start frontend
- [ ] Test login
- [ ] Test evidence upload
- [ ] Check browser DevTools Network tab
- [ ] Review API responses
- [ ] Customize as needed

---

## 📞 Quick Help

**Backend won't start?**
- Check port: `netstat -ano | findstr :5000`
- Change PORT in `.env`

**Frontend shows blank page?**
- Check browser console (F12)
- Run `npm install`
- Check vite.config.ts

**API returning 404?**
- Ensure backend on port 5000
- Check endpoint names in api.ts
- Verify backend routes match

**Token not working?**
- Check localStorage in DevTools
- Verify Authorization header in Network tab
- Check backend JWT_SECRET in .env

---

## 📖 Useful Commands

```bash
# Backend
cd meow-backend/backend
npm start              # Start server
npm install            # Install dependencies

# Frontend
cd Team-Meow-Blockchain-Track-frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Run ESLint
```

---

**Ready?** Start the backend and frontend, then open http://localhost:5173! 🎉

For questions, check the documentation files or review the backend console logs.
