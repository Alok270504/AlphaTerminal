"use client";

import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { API_BASE, apiPost, buildUrl } from "@/lib/api";

export default function MLTradingPage() {
  const [endpoint, setEndpoint] = useState("/api/ml/predict"); // edit if your backend differs
  const [ticker, setTicker] = useState("AAPL");
  const [model, setModel] = useState<"random_forest" | "svm" | "neural_net">("random_forest");
  const [horizon, setHorizon] = useState(1);
  const [trainYears, setTrainYears] = useState(3);

  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const url = useMemo(() => buildUrl(endpoint), [endpoint]);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      // Send a reasonable default payload. If your backend expects a different schema,
      // edit fields or just change the endpoint path above.
      const payload = {
        ticker,
        model,
        horizon_days: horizon,
        train_years: trainYears,
      };
      const json = await apiPost(endpoint, payload);
      setResp(json);
    } catch (e: any) {
      setErr(e?.message ?? "Backend error");
    } finally {
      setLoading(false);
    }
  };

  const headline =
    resp?.prediction ??
    resp?.direction ??
    resp?.signal ??
    (typeof resp?.prob_up === "number" ? `P(up) = ${(resp.prob_up * 100).toFixed(1)}%` : null) ??
    null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold">ML Trading</h1>
          <p className="text-sm text-muted-foreground">Backend: <span className="font-mono text-foreground/90">{API_BASE}</span></p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Ticker</div>
              <input value={ticker} onChange={(e) => setTicker(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Model</div>
              <select value={model} onChange={(e) => setModel(e.target.value as any)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3">
                <option value="random_forest">Random Forest</option>
                <option value="svm">SVM</option>
                <option value="neural_net">Neural Net</option>
              </select>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Horizon (days)</div>
              <input type="number" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Train window (years)</div>
              <input type="number" value={trainYears} onChange={(e) => setTrainYears(Number(e.target.value))} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            </div>
          </div>

          <button onClick={run} className="h-10 rounded-md bg-primary px-6 font-semibold text-primary-foreground">
            {loading ? "Running..." : "Run prediction"}
          </button>

          <div className="pt-2 border-t border-border space-y-2">
            <div className="text-xs text-muted-foreground">Endpoint (editable)</div>
            <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono text-sm" />
            <div className="text-xs text-muted-foreground">POST URL</div>
            <div className="rounded-md border border-border bg-background/30 px-3 py-2 font-mono text-xs break-all">{url}</div>
          </div>
        </div>

        {err && (
          <div className="glass-card p-6 border border-destructive/40 text-destructive">
            {err}
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: if your ML endpoint path/schema differs, change the endpoint field above.
            </div>
          </div>
        )}

        {resp && !err && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card p-6">
              <div className="text-sm text-muted-foreground">Result</div>
              <div className="mt-2 text-2xl font-bold">{headline ?? "Received response"}</div>

              <div className="mt-4 text-sm text-muted-foreground">Common fields</div>
              <div className="mt-2 space-y-2 text-sm">
                {"accuracy" in resp && <Row k="Accuracy" v={resp.accuracy} />}
                {"f1" in resp && <Row k="F1" v={resp.f1} />}
                {"auc" in resp && <Row k="AUC" v={resp.auc} />}
                {"prob_up" in resp && <Row k="P(up)" v={`${(Number(resp.prob_up) * 100).toFixed(2)}%`} />}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="text-sm font-semibold mb-2">Raw response</div>
              <pre className="max-h-96 overflow-auto rounded-md border border-border bg-background/30 p-3 text-xs">{JSON.stringify(resp, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono">{String(v)}</span>
    </div>
  );
}
