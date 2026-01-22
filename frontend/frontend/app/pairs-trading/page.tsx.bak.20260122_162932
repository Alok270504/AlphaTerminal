"use client";

import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { API_BASE, apiGet, buildUrl } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

type Point = { date: string; spread?: number; z?: number; price1?: number; price2?: number };

function tryBuildSeries(json: any): Point[] | null {
  // 1) json.points: [{date, spread, zscore/z, ...}]
  const pts = json?.points || json?.data || json?.series;
  if (Array.isArray(pts) && pts.length && typeof pts[0] === "object") {
    return pts.map((p: any) => ({
      date: String(p.date ?? p.time ?? p.t ?? ""),
      spread: p.spread ?? p.s,
      z: p.z ?? p.zscore ?? p.z_score,
      price1: p.price1 ?? p.p1,
      price2: p.price2 ?? p.p2,
    })).filter((p: any) => p.date);
  }

  // 2) arrays: dates + spread + zscore
  if (Array.isArray(json?.dates) && (Array.isArray(json?.spread) || Array.isArray(json?.zscore))) {
    const dates = json.dates;
    const spread = json.spread || [];
    const z = json.zscore || json.z || [];
    return dates.map((d: any, i: number) => ({
      date: String(d),
      spread: spread[i],
      z: z[i],
    }));
  }

  // 3) dict: spread_by_date
  const dict = json?.spread_by_date || json?.z_by_date;
  if (dict && typeof dict === "object") {
    const keys = Object.keys(dict).sort();
    return keys.map((k) => ({ date: k, spread: json?.spread_by_date?.[k], z: json?.z_by_date?.[k] }));
  }

  return null;
}

export default function PairsTradingPage() {
  const [ticker1, setTicker1] = useState("GOOG");
  const [ticker2, setTicker2] = useState("GOOGL");
  const [endpoint, setEndpoint] = useState("/api/pairs/analyze");
  const [zThresh, setZThresh] = useState(2);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const requestUrl = useMemo(
    () => buildUrl(endpoint, { ticker1, ticker2 }),
    [endpoint, ticker1, ticker2]
  );

  const series: Point[] | null = useMemo(() => (resp ? tryBuildSeries(resp) : null), [resp]);

  const summary = useMemo(() => {
    if (!resp) return null;
    return {
      pvalue: resp?.pvalue ?? resp?.cointegration_pvalue ?? resp?.p_value,
      hedgeRatio: resp?.hedge_ratio ?? resp?.beta ?? resp?.gamma,
      halfLife: resp?.half_life ?? resp?.halflife,
      lastZ: resp?.last_z ?? resp?.z_last ?? (series?.length ? series[series.length - 1]?.z : undefined),
    };
  }, [resp, series]);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const json = await apiGet(endpoint, { ticker1, ticker2 });
      setResp(json);
    } catch (e: any) {
      setErr(e?.message ?? "Backend error");
    } finally {
      setLoading(false);
    }
  };

  const signal = useMemo(() => {
    const z = summary?.lastZ;
    if (z === undefined || z === null || Number.isNaN(Number(z))) return "—";
    const val = Number(z);
    if (val >= zThresh) return "Short spread (Sell A / Buy B)";
    if (val <= -zThresh) return "Long spread (Buy A / Sell B)";
    return "No trade";
  }, [summary?.lastZ, zThresh]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold">Pairs Trading</h1>
          <p className="text-sm text-muted-foreground">
            Backend: <span className="font-mono text-foreground/90">{API_BASE}</span>
          </p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Ticker A</div>
              <input value={ticker1} onChange={(e) => setTicker1(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Ticker B</div>
              <input value={ticker2} onChange={(e) => setTicker2(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Z threshold</div>
              <input type="number" step="0.1" value={zThresh} onChange={(e) => setZThresh(Number(e.target.value))} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            </div>
            <div className="flex items-end">
              <button onClick={run} className="h-10 w-full rounded-md bg-primary px-4 font-semibold text-primary-foreground">
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            <div className="text-xs text-muted-foreground">Endpoint (editable)</div>
            <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono text-sm" />
            <div className="text-xs text-muted-foreground">Request URL</div>
            <div className="rounded-md border border-border bg-background/30 px-3 py-2 font-mono text-xs break-all">{requestUrl}</div>
          </div>
        </div>

        {err && <div className="glass-card p-6 border border-destructive/40 text-destructive">{err}</div>}

        {resp && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass-card p-6 space-y-3">
              <div className="text-sm font-semibold">Signal</div>
              <div className="text-lg font-bold">{signal}</div>

              <div className="pt-3 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Cointegration p-value</span><span className="font-mono">{summary?.pvalue ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hedge ratio</span><span className="font-mono">{summary?.hedgeRatio ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Half-life</span><span className="font-mono">{summary?.halfLife ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Last Z</span><span className="font-mono">{summary?.lastZ ?? "—"}</span></div>
              </div>

              <details className="pt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground">Raw response (debug)</summary>
                <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-border bg-background/30 p-3 text-xs">{JSON.stringify(resp, null, 2)}</pre>
              </details>
            </div>

            <div className="glass-card p-4 lg:col-span-2 h-[520px]">
              <div className="px-2 pt-2">
                <div className="text-sm font-semibold">Z-Score & Spread</div>
                <div className="text-xs text-muted-foreground">If your backend returns time-series, it will chart automatically.</div>
              </div>

              <div className="mt-2 h-[460px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                    <XAxis dataKey="date" hide />
                    <YAxis yAxisId="left" stroke="hsl(215 20% 55%)" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(215 20% 55%)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1f2937", borderRadius: "10px", color: "#fff", fontSize: "12px" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <ReferenceLine yAxisId="left" y={zThresh} stroke="#f59e0b" strokeDasharray="4 4" />
                    <ReferenceLine yAxisId="left" y={-zThresh} stroke="#f59e0b" strokeDasharray="4 4" />
                    <ReferenceLine yAxisId="left" y={0} stroke="#64748b" strokeDasharray="2 2" />
                    <Line yAxisId="left" type="monotone" dataKey="z" stroke="#22c55e" dot={false} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="spread" stroke="#60a5fa" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {!series && (
                <div className="mt-3 rounded-md border border-border bg-background/30 p-3 text-xs text-muted-foreground">
                  Your backend response doesn’t include a recognizable series yet. That’s okay — the left panel shows raw JSON.
                  If you share your `/api/pairs/analyze` response shape, I’ll map it perfectly.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
