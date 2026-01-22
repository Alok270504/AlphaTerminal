from __future__ import annotations
import numpy as np

def simulate_market_making(steps=500, sigma=0.01, base_spread=0.02, inventory_limit=50, seed=42):
    rng = np.random.default_rng(seed)
    mid = 100.0
    cash = 0.0
    inv = 0

    points = []
    for t in range(steps):
        # random walk mid
        mid *= (1.0 + sigma * rng.standard_normal())

        # inventory-aware spread: widen when inventory large
        inv_skew = 0.0005 * inv
        spread = base_spread * (1.0 + abs(inv) / max(1, inventory_limit))

        bid = mid * (1.0 - spread/2) - inv_skew
        ask = mid * (1.0 + spread/2) - inv_skew

        # fill probability decreases with spread
        fill_prob = max(0.05, 1.0 - spread * 10.0)

        # external order side: +1 means someone buys from us (we sell at ask), -1 means sells to us (we buy at bid)
        side = 1 if rng.random() < 0.5 else -1

        filled = rng.random() < fill_prob
        if filled:
            if side == 1 and inv > -inventory_limit:   # we sell 1
                cash += ask
                inv -= 1
            elif side == -1 and inv < inventory_limit: # we buy 1
                cash -= bid
                inv += 1

        pnl = cash + inv * mid

        points.append({
            "t": t,
            "mid": float(mid),
            "inventory": int(inv),
            "pnl": float(pnl),
        })

    return {
        "final_pnl": round(points[-1]["pnl"], 6) if points else 0.0,
        "points": points,
    }
