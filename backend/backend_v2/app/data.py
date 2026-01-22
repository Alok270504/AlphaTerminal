import os
import io
import time
import hashlib
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import numpy as np
import pandas as pd
import requests
import yfinance as yf

PERIOD_TO_DAYS = {
    "5d": 7,
    "1mo": 35,
    "3mo": 110,
    "6mo": 220,
    "1y": 380,
    "2y": 760,
    "5y": 1900,
    "10y": 3800,
    "max": 6000,
}

def _period_to_days(period: str) -> int:
    p = (period or "2y").strip().lower()
    if p in PERIOD_TO_DAYS:
        return PERIOD_TO_DAYS[p]
    # e.g. "15d"
    if p.endswith("d") and p[:-1].isdigit():
        return int(p[:-1]) + 5
    if p.endswith("mo") and p[:-2].isdigit():
        return int(p[:-2]) * 31 + 10
    if p.endswith("y") and p[:-1].isdigit():
        return int(p[:-1]) * 365 + 15
    return PERIOD_TO_DAYS["2y"]

def _cache_path(provider: str, tickers: List[str], period: str, interval: str) -> str:
    key = f"{provider}|{','.join(sorted([t.upper() for t in tickers]))}|{period}|{interval}"
    h = hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]
    return os.path.join(".cache", f"prices_{h}.csv.gz")

def _read_cache(path: str, ttl_seconds: int = 6 * 3600) -> Optional[pd.DataFrame]:
    try:
        st = os.stat(path)
        if time.time() - st.st_mtime > ttl_seconds:
            return None
        df = pd.read_csv(path, compression="gzip", parse_dates=["Date"])
        df = df.set_index("Date")
        df.index = pd.to_datetime(df.index, utc=True)
        df = df.sort_index()
        return df
    except Exception:
        return None

def _write_cache(path: str, df: pd.DataFrame) -> None:
    try:
        out = df.copy()
        out.index = pd.to_datetime(out.index, utc=True)
        out = out.sort_index()
        out.reset_index().rename(columns={"index": "Date"}).to_csv(path, index=False, compression="gzip")
    except Exception:
        pass

def _fetch_yfinance(tickers: List[str], period: str, interval: str) -> pd.DataFrame:
    # yfinance sometimes gets blocked; we keep it best-effort.
    tks = [t.upper() for t in tickers]
    df = yf.download(
        tickers=tks,
        period=period,
        interval=interval,
        group_by="column",
        auto_adjust=False,
        threads=False,
        progress=False,
    )

    if df is None or len(df) == 0:
        raise ValueError("No data returned from yfinance")

    close_col = "Adj Close" if "Adj Close" in df.columns else "Close"

    if isinstance(df.columns, pd.MultiIndex):
        # columns like ('Adj Close','AAPL') depending on yfinance version
        if close_col in df.columns.get_level_values(0):
            px = df[close_col].copy()
        else:
            # fallback: try Close
            px = df["Close"].copy()
    else:
        # single ticker: columns are OHLC
        if close_col not in df.columns:
            raise ValueError("yfinance response missing Close/Adj Close")
        px = df[[close_col]].copy()
        px.columns = [tks[0]]

    px.index = pd.to_datetime(px.index, utc=True)
    px = px.sort_index()
    px = px.dropna(how="all")
    if px.empty:
        raise ValueError("No usable prices from yfinance (all NaN)")
    px = px.astype(float)
    return px

def _stooq_symbol(ticker: str) -> str:
    t = ticker.strip().lower()
    if "." in t:
        return t
    # Default to US listings for typical tickers/ETFs
    return f"{t}.us"

def _fetch_stooq_one(ticker: str, start_date: datetime) -> pd.Series:
    sym = _stooq_symbol(ticker)
    url = f"https://stooq.com/q/d/l/?s={sym}&i=d"
    r = requests.get(url, timeout=20)
    if r.status_code != 200:
        raise ValueError(f"Stooq HTTP {r.status_code} for {ticker}")
    text = r.text.strip()
    if not text or "Date,Open,High,Low,Close" not in text:
        raise ValueError(f"Stooq returned unexpected body for {ticker}")
    df = pd.read_csv(io.StringIO(text))
    if df.empty or "Date" not in df.columns or "Close" not in df.columns:
        raise ValueError(f"Stooq missing columns for {ticker}")

    df["Date"] = pd.to_datetime(df["Date"], utc=True, errors="coerce")
    df = df.dropna(subset=["Date"])
    df = df[df["Date"] >= pd.Timestamp(start_date, tz="UTC")]
    df = df.sort_values("Date")
    s = pd.to_numeric(df["Close"], errors="coerce")
    s.index = df["Date"]
    s.name = ticker.upper()
    s = s.dropna()
    if s.empty:
        raise ValueError(f"Stooq returned no rows in range for {ticker}")
    return s

def _fetch_stooq(tickers: List[str], period: str) -> pd.DataFrame:
    days = _period_to_days(period)
    start = datetime.now(timezone.utc) - timedelta(days=days)
    series = []
    for t in tickers:
        series.append(_fetch_stooq_one(t, start))
    df = pd.concat(series, axis=1).sort_index()
    df = df.dropna(how="all")
    if df.empty:
        raise ValueError("No usable prices from Stooq")
    return df.astype(float)

def _mock_prices(tickers: List[str], period: str) -> pd.DataFrame:
    days = _period_to_days(period)
    n = max(60, min(days, 1500))
    idx = pd.date_range(end=pd.Timestamp.utcnow().normalize(), periods=n, freq="B", tz="UTC")
    rng = np.random.default_rng(42)
    out = pd.DataFrame(index=idx)
    for t in tickers:
        rets = rng.normal(loc=0.0003, scale=0.02, size=len(idx))
        prices = 100 * np.exp(np.cumsum(rets))
        out[t.upper()] = prices
    return out

def get_price_df(tickers: List[str], period: str = "2y", interval: str = "1d") -> pd.DataFrame:
    if not tickers:
        raise ValueError("No tickers provided")

    provider = (os.getenv("PRICE_PROVIDER", "auto") or "auto").strip().lower()
    allow_mock = (os.getenv("ALLOW_MOCK_DATA", "1") == "1")

    # Cache (provider-agnostic key to avoid refetch spam)
    cache_key_provider = provider if provider != "auto" else "auto"
    cache_path = _cache_path(cache_key_provider, tickers, period, interval)
    cached = _read_cache(cache_path)
    if cached is not None and not cached.empty:
        return cached

    errors = []

    if provider in ("auto", "yfinance"):
        try:
            df = _fetch_yfinance(tickers, period=period, interval=interval)
            _write_cache(cache_path, df)
            return df
        except Exception as e:
            errors.append(f"yfinance: {e}")

    if provider in ("auto", "stooq"):
        try:
            df = _fetch_stooq(tickers, period=period)
            _write_cache(cache_path, df)
            return df
        except Exception as e:
            errors.append(f"stooq: {e}")

    if allow_mock:
        df = _mock_prices(tickers, period=period)
        _write_cache(cache_path, df)
        return df

    raise ValueError("Price fetch failed. " + " | ".join(errors))
