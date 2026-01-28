# Frontend-Backend Connection Checklist

## Pre-Start Checks

- [ ] Backend `.env` file has `PORT=5000`
- [ ] Frontend `.env` file created with `VITE_API_URL=http://localhost:5000/api`
- [ ] `vite.config.ts` has proxy configuration for `/api`
- [ ] `src/api/api.ts` updated to use environment variables
- [ ] Backend routes match frontend API calls:
  - [ ] `/api/auth/login` - username/password
  - [ ] `/api/evidence/upload` - evidence registration
  - [ ] `/api/evidence/transfer` - custody transfer
  - [ ] `/api/evidence/verify` - evidence verification

## Startup Procedure

### Terminal 1: Start Backend
```bash
cd meow-backend/backend
npm install  # if first time
npm start
# Expected output:
# =================================
#   Evidence Chain Backend
# =================================
#   Running on port 5000
#   http://localhost:5000
# =================================
```

### Terminal 2: Start Frontend
```bash
cd Team-Meow-Blockchain-Track-frontend
npm install  # if first time
npm run dev
# Expected output:
#   VITE v... ready in ... ms
#   ➜  Local:   http://localhost:5173/
#   ➜  press h to show help
```

## Connection Verification Steps

1. **Backend Health Check**
   - Open: `http://localhost:5000`
   - Should see API info with endpoints
   - Open: `http://localhost:5000/api/health`
   - Should see status, blockchain connection, and audit stats

2. **Frontend Loads**
   - Open: `http://localhost:5173`
   - Should see login page without errors
   - Open browser DevTools (F12)
   - Check Console tab for any errors

3. **API Communication**
   - In DevTools, go to Network tab
   - Try logging in with:
     - Email: `officer@demo.local`
     - Password: `password123`
   - Watch Network tab:
     - Should see `POST /api/auth/login` request
     - Should get response (200 status)
     - Token should be stored in localStorage

4. **Check Token Storage**
   - In DevTools, go to Application/Storage tab
   - Expand localStorage
   - Should see `jwt` key with token value
   - Should see `role` key with user role
   - Should see `name` key with user name

## Common Issues & Solutions

### ❌ Backend won't start
**Error**: Port 3000/5000 already in use
**Solution**: 
- Change PORT in `.env` file
- Find process: `netstat -ano | findstr :5000` (Windows)
- Kill process: `taskkill /PID <PID> /F`

### ❌ Frontend shows blank page
**Error**: Port 5173 already in use or build error
**Solution**:
- Check terminal output for build errors
- Install dependencies: `npm install`
- Clear cache: `rm -rf node_modules && npm install`

### ❌ CORS error in browser
**Error**: "Access to XMLHttpRequest blocked by CORS"
**Solution**:
- Ensure backend is running with CORS middleware
- Check `server.js` has `app.use(cors())`
- Verify Vite proxy is working (check Network tab)

### ❌ Login fails with 404
**Error**: "POST /api/auth/login 404"
**Solution**:
- Verify backend is running on port 5000
- Check Network tab shows request going to localhost:5000
- Backend might be on wrong port - check `.env`

### ❌ JWT not being sent with requests
**Error**: 401 Unauthorized on subsequent requests
**Solution**:
- Check localStorage has `jwt` key
- Verify api.ts interceptor is setting Authorization header
- Check Network tab request headers include `Authorization: Bearer ...`

### ❌ File upload fails
**Error**: 400 Bad Request or 500 Internal Server Error
**Solution**:
- Verify multipart form-data header is set
- Check api.ts uses FormData correctly
- Backend multer might need memory limit adjustment

## Testing the Connection

### Test 1: Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","time":"...","blockchain":{...},"audit":{...}}
```

### Test 2: Login Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
# Should return: {"success":true,"token":"...","user":{...}} or 401
```

### Test 3: Frontend API Call
```javascript
// In browser console:
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log(data))
// Should return health data
```

## Deployment Checklist

### Before Going Live

- [ ] Backend JWT_SECRET changed from default
- [ ] Backend has all required environment variables
- [ ] Frontend built: `npm run build`
- [ ] Frontend dist folder has all assets
- [ ] CORS configured for production domains
- [ ] API URL updated for production
- [ ] Database/blockchain configured
- [ ] Security: No secrets in source code
- [ ] Testing: All endpoints tested

### Deployment Commands

**Backend Deployment**:
```bash
cd meow-backend/backend
npm install --production
NODE_ENV=production npm start
```

**Frontend Deployment**:
```bash
cd Team-Meow-Blockchain-Track-frontend
npm run build
# Serve dist folder from web server
```

## Documentation Files Created

1. **INTEGRATION_GUIDE.md** - Complete setup and usage guide
2. **ARCHITECTURE.md** - System design and data flows
3. **CONNECTION_CHECKLIST.md** - This file, for verification
4. **setup.bat** - Windows setup script
5. **setup.sh** - Linux/Mac setup script

## Support Resources

- Backend files: `meow-backend/backend/`
- Frontend files: `Team-Meow-Blockchain-Track-frontend/src/`
- API documentation: Backend routes in `routes/` folder
- Environment config: `.env` files in both folders
- Vite docs: https://vitejs.dev/
- Express docs: https://expressjs.com/
- React docs: https://react.dev/

## Next Steps

1. ✅ Verify all files are in place
2. ✅ Run setup script: `./setup.bat` (Windows) or `bash setup.sh` (Linux/Mac)
3. ✅ Start backend: `cd meow-backend/backend && npm start`
4. ✅ Start frontend: `cd Team-Meow-Blockchain-Track-frontend && npm run dev`
5. ✅ Test login: Go to http://localhost:5173
6. ✅ Monitor Network tab in DevTools
7. ✅ Check backend console for request logs
8. ✅ Test all features with real API calls

## Final Notes

- **Demo Mode**: Frontend has fallback demo accounts if backend login fails
- **Token Storage**: JWT tokens stored in localStorage, cleared on logout
- **CORS**: Already configured in backend with `cors()` middleware
- **Proxy**: Only active in development (Vite dev server)
- **Production**: Will need different setup (e.g., reverse proxy, different origin)

---
**Last Updated**: 2025-01-28
**Status**: ✅ Frontend-Backend Integration Complete
