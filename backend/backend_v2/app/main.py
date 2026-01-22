from __future__ import annotations
import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from .pairs import pairs_analyze
from .portfolio import optimize_portfolio
from .options import black_scholes
from .volatility import volatility_forecast
from .ml import ml_predict
from .market_making import simulate_market_making
from .research import replicate as research_replicate

load_dotenv()

app = FastAPI(title="AlphaTerminal Backend v2", version="0.1.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "AlphaTerminal Backend v2"}

# ---------- Pairs ----------
@app.get("/api/pairs/analyze")
def api_pairs_analyze(
    ticker1: str = Query(...),
    ticker2: str = Query(...),
    period: str = Query("1y"),
    window: int = Query(30, ge=5, le=200),
):
    return pairs_analyze(ticker1.upper(), ticker2.upper(), period=period, window=window)

# ---------- Portfolio ----------
class PortfolioReq(BaseModel):
    tickers: list[str] = Field(..., min_length=2)
    period: str = "2y"
    risk_free_rate: float = 0.02

@app.post("/api/portfolio/optimize")
def api_portfolio_optimize(req: PortfolioReq):
    tks = [t.strip().upper() for t in req.tickers if t.strip()]
    return optimize_portfolio(tks, period=req.period, risk_free_rate=req.risk_free_rate)

# ---------- Options ----------
@app.get("/api/options/price")
def api_options_price(
    S: float = Query(..., gt=0),
    K: float = Query(..., gt=0),
    T: float = Query(..., gt=0),
    r: float = Query(...),
    sigma: float = Query(..., gt=0),
):
    res = black_scholes(S, K, T, r, sigma)
    return {"call": round(res.call, 6), "put": round(res.put, 6), "d1": round(res.d1, 6), "d2": round(res.d2, 6)}

# ---------- Volatility ----------
@app.get("/api/volatility/forecast")
def api_vol_forecast(
    ticker: str = Query(...),
    period: str = Query("2y"),
    model: str = Query("garch"),
):
    return volatility_forecast(ticker.upper(), period=period, model=model)

# ---------- ML ----------
class MLReq(BaseModel):
    ticker: str
    model: str = "random_forest"
    horizon_days: int = 1
    train_years: int = 3

@app.post("/api/ml/predict")
def api_ml_predict(req: MLReq):
    return ml_predict(req.ticker.upper(), req.model, req.horizon_days, req.train_years)

# ---------- Market Making ----------
class MMSimReq(BaseModel):
    steps: int = 500
    sigma: float = 0.01
    base_spread: float = 0.02
    inventory_limit: int = 50
    seed: int = 42

@app.post("/api/market-making/simulate")
def api_mm_simulate(req: MMSimReq):
    return simulate_market_making(
        steps=req.steps,
        sigma=req.sigma,
        base_spread=req.base_spread,
        inventory_limit=req.inventory_limit,
        seed=req.seed,
    )

# ---------- Research ----------
class ResearchReq(BaseModel):
    paper_id: str
    tickers: list[str] | None = None

@app.post("/api/research/replicate")
def api_research(req: ResearchReq):
    tks = [t.strip().upper() for t in (req.tickers or []) if t.strip()] or None
    return research_replicate(req.paper_id, tickers=tks)


# __VALUE_ERROR_HANDLER_INSTALLED__
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def _value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"error": str(exc)})
