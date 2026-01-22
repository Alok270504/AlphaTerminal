from __future__ import annotations
import numpy as np
import pandas as pd
from arch import arch_model
from .data import get_price_df

def volatility_forecast(ticker: str, period="2y", model="garch") -> dict:
    prices = get_price_df([ticker], period=period)[ticker].astype(float)
    rets = np.log(prices).diff().dropna()  # daily log returns

    # Realized vol series (annualized, %)
    rv = rets.rolling(21).std(ddof=0) * np.sqrt(252) * 100.0
    points = pd.DataFrame({
        "date": rv.index.strftime("%Y-%m-%d"),
        "vol": rv.values
    }).dropna().tail(252).to_dict(orient="records")

    # GARCH forecast (annualized, %)
    r = (rets * 100.0).dropna()  # scale to percent returns for arch stability

    if model.lower() == "egarch":
        am = arch_model(r, mean="Zero", vol="EGARCH", p=1, o=1, q=1, dist="normal")
    else:
        am = arch_model(r, mean="Zero", vol="GARCH", p=1, q=1, dist="normal")

    res = am.fit(disp="off")
    f = res.forecast(horizon=1)
    var1 = float(f.variance.iloc[-1, 0])  # variance of % returns
    sigma_daily = np.sqrt(var1) / 100.0
    sigma_annual_pct = sigma_daily * np.sqrt(252) * 100.0

    return {
        "ticker": ticker,
        "model": model,
        "forecast": round(sigma_annual_pct, 4),
        "points": points,
    }
