# AlphaTerminal

A full-stack quant research playground with a **Next.js + Tailwind** UI and a **FastAPI** backend.

Explore common quant workflows like:
- **Pairs trading** (spread / z-score analysis + basic signals)
- **Portfolio optimization** (PyPortfolioOpt)
- **Volatility forecasting** (GARCH / EGARCH via `arch`)
- **Options pricing** (Black–Scholes)
- **ML-style forecasting** (simple predictive endpoint via scikit-learn)
- **Market-making simulator**
- **Research / replicate-style comparisons** across tickers

---

## Features

- **Pairs Trading**
  - Spread / z-score style analysis
  - Basic signal generation

- **Portfolio Optimization**
  - Allocation suggestions using **PyPortfolioOpt**

- **Options Pricing**
  - Black–Scholes pricing endpoint

- **Volatility**
  - GARCH / EGARCH forecasting using **arch**

- **ML Trading**
  - Simple predictive endpoint using **scikit-learn**

- **Market Making**
  - Simulator endpoint

- **Research**
  - Replicate-style comparisons across tickers

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
