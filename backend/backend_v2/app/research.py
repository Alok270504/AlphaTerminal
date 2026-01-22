from __future__ import annotations
import numpy as np
import pandas as pd
from .data import get_price_df
from .pairs import pairs_analyze

DEFAULT_UNIVERSE = ["AAPL", "MSFT", "GOOG", "GOOGL", "AMZN", "META", "NVDA", "TSLA"]

def replicate(paper_id: str, tickers=None) -> dict:
    pid = (paper_id or "").lower().strip()
    universe = tickers or DEFAULT_UNIVERSE

    if pid in ["gatev_2006_pairs_trading", "gatev2006", "pairs_trading_gatev"]:
        # Lightweight “replication-like” demo:
        # pick best pair (min p-value) among universe and run our analyzer
        best = None
        best_p = 1.0

        for i in range(len(universe)):
            for j in range(i+1, len(universe)):
                t1, t2 = universe[i], universe[j]
                try:
                    res = pairs_analyze(t1, t2, period="2y", window=30)
                    p = float(res["pvalue"])
                    if p < best_p:
                        best_p = p
                        best = res
                except Exception:
                    continue

        if not best:
            return {"paper_id": paper_id, "status": "failed", "reason": "Could not evaluate any pairs."}

        return {
            "paper_id": paper_id,
            "status": "ok",
            "universe": universe,
            "selected_pair": [best["ticker1"], best["ticker2"]],
            "cointegration_pvalue": best["pvalue"],
            "hedge_ratio": best["hedge_ratio"],
            "note": "This is a compact replication-style demo: select best cointegrated pair in a small universe and output spread/z-score series.",
            "result": best,
        }

    return {
        "paper_id": paper_id,
        "status": "unknown_paper",
        "supported": ["gatev_2006_pairs_trading"],
    }
