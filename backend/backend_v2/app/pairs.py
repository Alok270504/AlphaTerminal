from __future__ import annotations
import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.tsa.stattools import coint
from .data import get_price_df

def pairs_analyze(ticker1: str, ticker2: str, period="1y", window=30) -> dict:
    prices = get_price_df([ticker1, ticker2], period=period)
    if ticker1 not in prices.columns or ticker2 not in prices.columns:
        raise ValueError("Missing data for one or both tickers")

    p1 = prices[ticker1].astype(float)
    p2 = prices[ticker2].astype(float)

    log1 = np.log(p1)
    log2 = np.log(p2)

    # Hedge ratio via OLS: log1 ~ a + b*log2
    X = sm.add_constant(log2.values)
    model = sm.OLS(log1.values, X).fit()
    hedge_ratio = float(model.params[1])

    spread = log1 - hedge_ratio * log2

    roll_mean = spread.rolling(window).mean()
    roll_std = spread.rolling(window).std(ddof=0)
    z = (spread - roll_mean) / roll_std
    z = z.replace([np.inf, -np.inf], np.nan)

    # Cointegration p-value
    _, pvalue, _ = coint(log1, log2)

    out = pd.DataFrame({
        "date": spread.index.strftime("%Y-%m-%d"),
        "spread": spread.values,
        "z": z.values,
        "price1": p1.values,
        "price2": p2.values,
    }).dropna(subset=["z"])

    points = out.tail(252).to_dict(orient="records")  # keep it light

    last_z = float(out["z"].iloc[-1]) if len(out) else None

    return {
        "ticker1": ticker1,
        "ticker2": ticker2,
        "pvalue": float(pvalue),
        "hedge_ratio": hedge_ratio,
        "last_z": last_z,
        "points": points,
    }
