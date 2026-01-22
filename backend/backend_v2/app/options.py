from __future__ import annotations
import math
from dataclasses import dataclass
from scipy.stats import norm

@dataclass
class BlackScholesResult:
    call: float
    put: float
    d1: float
    d2: float

def black_scholes(S: float, K: float, T: float, r: float, sigma: float) -> BlackScholesResult:
    if T <= 0 or sigma <= 0 or S <= 0 or K <= 0:
        raise ValueError("Invalid inputs: require S,K,T,sigma > 0")
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    call = S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)
    put = K * math.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    return BlackScholesResult(call=call, put=put, d1=d1, d2=d2)
