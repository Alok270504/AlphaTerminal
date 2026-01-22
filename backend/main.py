from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import numpy as np
import statsmodels.tsa.stattools as ts
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models, expected_returns
from scipy.stats import norm

app = FastAPI(title="AlphaTerminal Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPER: Safe Data Fetch ---
def get_price_data(tickers, period="1y"):
    df = yf.download(tickers, period=period, auto_adjust=False)
    # Handle multi-level columns or single ticker issues
    if 'Adj Close' in df.columns: return df['Adj Close']
    elif 'Close' in df.columns: return df['Close']
    else: return df

# --- 1. PAIRS TRADING ---
@app.get("/api/pairs/analyze")
def pairs_trading(ticker1: str, ticker2: str):
    try:
        data = get_price_data([ticker1, ticker2]).dropna()
        if ticker1 not in data.columns or ticker2 not in data.columns:
            raise HTTPException(404, "Tickers not found")
        score, pvalue, _ = ts.coint(data[ticker1], data[ticker2])
        return {"p_value": pvalue, "is_cointegrated": bool(pvalue < 0.05)}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, str(e))

# --- 2. ML PREDICTION (Random Forest) ---
@app.get("/api/ml/train")
def ml_model(ticker: str):
    try:
        df = yf.Ticker(ticker).history(period="2y")
        if df.empty: raise HTTPException(404, "Ticker not found")
        
        df['Returns'] = df['Close'].pct_change()
        df['SMA'] = df['Close'].rolling(window=10).mean()
        df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
        df = df.dropna()
        
        X = df[['Returns', 'SMA']]
        y = df['Target']
        
        if len(X) < 10: raise HTTPException(400, "Not enough data")
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        model = RandomForestClassifier(n_estimators=100)
        model.fit(X_train, y_train)
        
        acc = accuracy_score(y_test, model.predict(X_test))
        pred = model.predict(X.iloc[[-1]])[0]
        
        return {"accuracy": round(acc * 100, 2), "prediction": "UP" if pred == 1 else "DOWN"}
    except Exception as e:
        raise HTTPException(500, str(e))

# --- 3. PORTFOLIO OPTIMIZATION ---
class PortfolioRequest(BaseModel): tickers: list[str]
@app.post("/api/portfolio/optimize")
def optimize_portfolio(req: PortfolioRequest):
    try:
        df = get_price_data(req.tickers).dropna()
        if df.empty: raise HTTPException(500, "No data")
        
        mu = expected_returns.mean_historical_return(df)
        S = risk_models.sample_cov(df)
        ef = EfficientFrontier(mu, S)
        weights = ef.max_sharpe()
        cleaned = ef.clean_weights()
        perf = ef.portfolio_performance()
        
        return {
            "weights": cleaned,
            "expected_return": round(perf[0] * 100, 2),
            "sharpe_ratio": round(perf[2], 2)
        }
    except Exception as e:
        raise HTTPException(500, str(e))
