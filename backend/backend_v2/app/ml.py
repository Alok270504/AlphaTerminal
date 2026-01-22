from __future__ import annotations
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, confusion_matrix
from .data import get_price_df

def _rsi(series: pd.Series, window=14) -> pd.Series:
    delta = series.diff()
    up = delta.clip(lower=0).rolling(window).mean()
    down = (-delta.clip(upper=0)).rolling(window).mean()
    rs = up / (down + 1e-12)
    return 100 - (100 / (1 + rs))

def _macd(series: pd.Series, fast=12, slow=26, signal=9):
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd = ema_fast - ema_slow
    sig = macd.ewm(span=signal, adjust=False).mean()
    return macd, sig, (macd - sig)

def ml_predict(ticker: str, model_name: str = "random_forest", horizon_days: int = 1, train_years: int = 3) -> dict:
    period = f"{max(2, train_years + 1)}y"
    close = get_price_df([ticker], period=period)[ticker].astype(float)

    df = pd.DataFrame({"close": close})
    df["ret1"] = np.log(df["close"]).diff()
    df["ret2"] = df["ret1"].shift(1)
    df["sma5"] = df["close"].rolling(5).mean()
    df["sma20"] = df["close"].rolling(20).mean()
    df["rsi14"] = _rsi(df["close"], 14)
    macd, sig, hist = _macd(df["close"])
    df["macd"] = macd
    df["macd_signal"] = sig
    df["macd_hist"] = hist

    # target: next horizon_days return up?
    df["future_ret"] = df["ret1"].shift(-horizon_days)
    df["y"] = (df["future_ret"] > 0).astype(int)

    df = df.dropna().copy()

    features = ["ret1", "ret2", "sma5", "sma20", "rsi14", "macd", "macd_signal", "macd_hist"]
    X = df[features].values
    y = df["y"].values

    # time split
    split = int(len(df) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    m = model_name.lower()
    if m in ["svm", "svc"]:
        clf = SVC(kernel="rbf", probability=True)
    elif m in ["neural", "neural_net", "mlp"]:
        clf = MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=500, random_state=42)
    else:
        clf = RandomForestClassifier(n_estimators=300, random_state=42)

    clf.fit(X_train, y_train)
    proba = clf.predict_proba(X_test)[:, 1]
    pred = (proba >= 0.5).astype(int)

    acc = float(accuracy_score(y_test, pred))
    f1 = float(f1_score(y_test, pred))
    auc = float(roc_auc_score(y_test, proba)) if len(set(y_test)) > 1 else None
    cm = confusion_matrix(y_test, pred).tolist()

    # latest
    last_x = X[-1:].copy()
    last_prob = float(clf.predict_proba(last_x)[:, 1][0])
    last_pred = int(last_prob >= 0.5)

    out = {
        "ticker": ticker,
        "model": model_name,
        "horizon_days": horizon_days,
        "accuracy": round(acc, 4),
        "f1": round(f1, 4),
        "auc": round(auc, 4) if auc is not None else None,
        "confusion_matrix": cm,
        "prob_up": round(last_prob, 4),
        "prediction": "UP" if last_pred == 1 else "DOWN",
    }

    if hasattr(clf, "feature_importances_"):
        out["feature_importances"] = {features[i]: float(clf.feature_importances_[i]) for i in range(len(features))}

    return out
