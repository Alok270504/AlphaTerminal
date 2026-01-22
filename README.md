# AlphaTerminal

A full-stack quant research playground with a **Next.js + Tailwind UI** and a **FastAPI backend**.

Explore common quant workflows like **pairs trading**, **portfolio optimization**, **volatility forecasting (GARCH/EGARCH)**, **options pricing**, **ML-style forecasting**, and a **market-making simulator**.

---

## Features
- **Pairs Trading**: spread / z-score style analysis + basic signals  
- **Portfolio Optimization**: allocations using PyPortfolioOpt  
- **Options Pricing**: Black–Scholes pricing endpoint  
- **Volatility**: GARCH / EGARCH forecasting (arch)  
- **ML Trading**: simple predictive endpoint (scikit-learn)  
- **Market Making**: simulator endpoint  
- **Research**: replicate-style comparisons across tickers  

---

## Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- TypeScript

### Backend
- FastAPI + Uvicorn
- numpy, pandas, scipy
- statsmodels, arch
- scikit-learn
- PyPortfolioOpt
- yfinance

---

## Repo Structure
```text
AlphaTerminal/
  backend/
  frontend/
Local Development
1) Frontend
bash
Copy code
cd frontend
npm install
npm run dev
App runs at:

http://localhost:3000

2) Backend
bash
Copy code
cd backend/backend_v2
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
API runs at:

http://127.0.0.1:8000

Environment & Config
Frontend should call the backend at:

http://127.0.0.1:8000 (or whatever host/port you run)

Add environment variables in:

backend/backend_v2/.env (optional)

frontend/.env.local (optional)

Example (frontend):

bash
Copy code
# frontend/.env.local
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
Common Gotchas
Don’t commit build artifacts
Make sure these are ignored:

node_modules/

.next/

.venv/

yfinance can fail / return empty data
This can happen due to:

network / captive portal

rate limiting

invalid ticker symbols

provider returning temporary HTML or an empty payload

If you see JSONDecodeError from yfinance, try:

switching networks

waiting a bit / retrying

testing a different ticker (e.g. AAPL, MSFT)

adding a fallback data source (future improvement)

API Overview (High Level)
Endpoints are exposed under /api/* (varies by module). Examples:

/api/pairs/analyze

/api/portfolio/optimize

/api/options/price

/api/volatility/forecast

/api/ml/predict

/api/market-making/simulate

/api/research/replicate

See backend/backend_v2/app/main.py for the exact routes.

Roadmap Ideas
Cache market data (Redis) to reduce provider calls

Add a second data provider fallback (Polygon, Stooq, Alpha Vantage, etc.)

Persist experiments + results (SQLite/Postgres)

Add auth + multi-user workspaces

Deploy: Frontend (Vercel) + Backend (Render/Fly/Railway)

License
MIT (or choose your preferred license)

makefile
Copy code
::contentReference[oaicite:0]{index=0}
