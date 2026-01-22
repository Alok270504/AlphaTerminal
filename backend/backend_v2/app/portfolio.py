from __future__ import annotations
from typing import List
from pypfopt import expected_returns, risk_models
from pypfopt.efficient_frontier import EfficientFrontier
from .data import get_price_df

def optimize_portfolio(tickers: List[str], period="2y", risk_free_rate=0.02) -> dict:
    if not tickers or len(tickers) < 2:
        raise ValueError("Provide at least 2 tickers")

    prices = get_price_df(tickers, period=period)
    if prices.shape[1] < 2:
        raise ValueError("Not enough valid tickers with data")

    mu = expected_returns.mean_historical_return(prices, frequency=252)
    S = risk_models.sample_cov(prices, frequency=252)

    ef = EfficientFrontier(mu, S)
    ef.max_sharpe(risk_free_rate=risk_free_rate)

    weights = ef.clean_weights()
    exp_ret, vol, sharpe = ef.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)

    return {
        "weights": weights,
        "expected_return": round(exp_ret * 100, 4),
        "volatility": round(vol * 100, 4),
        "sharpe": round(sharpe, 4),
    }
