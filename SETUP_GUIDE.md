# Fraud Detection Dashboard - Real Data Integration

## ✅ Setup Complete!

Your dashboard now uses **REAL DATA** from `transactions_clean.csv` instead of mock data.

## Architecture

```
Frontend (React + TypeScript)  ←→  Backend (Flask Python)  ←→  CSV Data
   Port: 5173                        Port: 5000              transactions_clean.csv
```

## Starting the Application

### Step 1: Start Backend Server (Terminal 1)

Open PowerShell in the project directory:

```powershell
cd f:\Projects\InfosysVirtualInternship-BFSI\fraud-detection-dashboard
.\start-backend.bat
```

**Expected Output:**
```
============================================================
🚀 Fraud Detection Backend Server
============================================================
📊 Dataset: XXXX transactions loaded
🔴 Fraud cases: XXX
🟢 Legitimate: XXXX
📈 Fraud rate: X.XX%
============================================================
🌐 Server running on: http://localhost:5000
============================================================
```

### Step 2: Start Frontend Server (Terminal 2)

Open a **NEW** PowerShell terminal:

```powershell
cd f:\Projects\InfosysVirtualInternship-BFSI\fraud-detection-dashboard
npm run dev
```

**Expected Output:**
```
VITE v7.1.12  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 3: Open Dashboard

Navigate to: **http://localhost:5173/**

## API Endpoints

The backend server provides these endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/transactions` | All transaction data |
| `GET /api/stats/fraud` | Fraud statistics |
| `GET /api/stats/channels` | Channel analysis |
| `GET /api/stats/hourly` | Hourly patterns |
| `GET /api/stats/weekday` | Weekday patterns |
| `GET /api/stats/numerical` | Numerical statistics |
| `GET /api/stats/distributions` | Distribution data |
| `GET /api/stats/correlations` | Feature correlations |
| `GET /api/stats/kyc` | KYC verification stats |

## Testing the Backend

Test if backend is running:

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health"
```

## Files Created

### Backend:
- `backend/server.py` - Flask API server
- `backend/transactions_clean.csv` - Real CSV data
- `backend-env/` - Python virtual environment
- `start-backend.bat` - Backend startup script

### Frontend:
- `src/api/dataService.ts` - API integration layer
- Updated `src/App.tsx` - Uses real API instead of mock data

## Features

✅ **Real Data**: Loads actual transactions from your CSV  
✅ **REST API**: Clean API endpoints for all statistics  
✅ **Error Handling**: Shows helpful messages if backend is down  
✅ **Loading States**: Displays loading spinner while fetching data  
✅ **CORS Enabled**: Frontend and backend communicate properly  

## Troubleshooting

### Backend won't start
- Check Python is installed: `python --version`
- Check packages: `.\backend-env\Scripts\pip list`
- Reinstall: `.\backend-env\Scripts\pip install flask flask-cors pandas numpy`

### Frontend shows "Backend Not Running"
- Ensure backend is running on port 5000
- Check console for errors: Open browser DevTools (F12)
- Test backend: `Invoke-WebRequest -Uri "http://localhost:5000/api/health"`

### Port already in use
- Kill process on port 5000: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force`
- Or change port in `backend/server.py` (line: `app.run(..., port=5000)`)

## Data Source

- **CSV File**: `transactions_clean.csv`
- **Notebook**: `comprehensive-eda.ipynb` (for reference)
- **Processing**: All calculations done in Flask backend

## Next Steps

1. **Start both servers** (backend first, then frontend)
2. **Explore the dashboard** - all 5 tabs now show real data
3. **Compare with notebook** - results should match your EDA analysis

---

**Built with ❤️ using Flask + React + TypeScript**
