"use client";

import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { API_BASE, apiPost, buildUrl } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MarketMakingPage() {
  const [endpoint, setEndpoint] = useState("/api/market-making/simulate"); // edit if backend differs
  const [steps, setSteps] = useState(500);
  const [sigma, setSigma] = useState(0.01);
  const [baseSpread, setBaseSpread] = useState(0.02);
  const [invLimit, setInvLimit] = useState(50);

  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const url = useMemo(() => buildUrl(endpoint), [endpoint]);

  const series = useMemo(() => {
    const pts = resp?.points || resp?.data || resp?.series;
    if (Array.isArray(pts)) {
      return pts.map((p: any, i: number) => ({
        t: p.t ?? p.step ?? i,
        pnl: p.pnl ?? p.PnL ?? p.profit,
        inv: p.inventory ?? p.inv,
        mid: p.mid ?? p.price,
      }));
    }
    if (Array.isArray(resp?.pnl)) {
      return resp.pnl.map((v: any, i: number) => ({ t: i, pnl: v, inv: resp?.inv?.[i], mid: resp?.mid?.[i] }));
    }
    return null;
  }, [resp]);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const payload = { steps, sigma, base_spread: baseSpread, inventory_limit: invLimit };
      const json = await apiPost(endpoint, payload);
      setResp(json);
    } catch (e: any) {
      setErr(e?.message ?? "Backend error");
    } finally {
      setLoading(false);
    }
  };

  const finalPnl =
    resp?.final_pnl ??
    resp?.pnl_final ??
    (series?.length ? series[series.length - 1]?.pnl : null);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold">Market Making Simulation</h1>
          <p className="text-sm text-muted-foreground">Backend: <span className="font-mono text-foreground/90">{API_BASE}</span></p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <NumField label="Steps" value={steps} setValue={setSteps} />
            <NumField label="Sigma (vol)" value={sigma} setValue={setSigma} step={0.001} />
            <NumField label="Base spread" value={baseSpread} setValue={setBaseSpread} step={0.001} />
            <NumField label="Inventory limit" value={invLimit} setValue={setInvLimit} />
          </div>

          <button onClick={run} className="h-10 rounded-md bg-primary px-6 font-semibold text-primary-foreground">
            {loading ? "Simulating..." : "Run simulation"}
          </button>

          <div className="pt-2 border-t border-border space-y-2">
            <div className="text-xs text-muted-foreground">Endpoint (editable)</div>
            <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono text-sm" />
            <div className="text-xs text-muted-foreground">POST URL</div>
            <div className="rounded-md border border-border bg-background/30 px-3 py-2 font-mono text-xs break-all">{url}</div>
          </div>
        </div>

        {err && <div className="glass-card p-6 border border-destructive/40 text-destructive">{err}</div>}

        {resp && !err && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass-card p-6 space-y-3">
              <div className="text-sm font-semibold">Result</div>
              <div className="text-3xl font-bold text-success">{finalPnl ?? "—"}</div>
              <div className="text-xs text-muted-foreground">Final PnL (best-effort parsed)</div>

              <details className="pt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground">Raw response</summary>
                <pre className="mt-2 max-h-80 overflow-auto rounded-md border border-border bg-background/30 p-3 text-xs">{JSON.stringify(resp, null, 2)}</pre>
              </details>
            </div>

            <div className="glass-card p-4 lg:col-span-2 h-[520px]">
              <div className="px-2 pt-2">
                <div className="text-sm font-semibold">PnL over time</div>
                <div className="text-xs text-muted-foreground">Charts if backend returns points/data/series.</div>
              </div>

              <div className="mt-2 h-[460px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                    <XAxis dataKey="t" />
                    <YAxis stroke="hsl(215 20% 55%)" />
                    <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1f2937", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="pnl" stroke="#22c55e" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="inv" stroke="#60a5fa" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {!series && (
                <div className="mt-3 rounded-md border border-border bg-background/30 p-3 text-xs text-muted-foreground">
                  No time-series detected. If you paste your simulate response JSON shape, I’ll map it cleanly.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function NumField({
  label,
  value,
  setValue,
  step = 1,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono"
      />
    </div>
  );
}
