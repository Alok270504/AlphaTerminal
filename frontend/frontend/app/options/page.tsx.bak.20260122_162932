"use client";

import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { API_BASE, apiGet, buildUrl } from "@/lib/api";

export default function OptionsPage() {
  const [endpoint, setEndpoint] = useState("/api/options/price");
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [r, setR] = useState(0.05);
  const [sigma, setSigma] = useState(0.2);

  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const url = useMemo(() => buildUrl(endpoint, { S, K, T, r, sigma }), [endpoint, S, K, T, r, sigma]);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const json = await apiGet(endpoint, { S, K, T, r, sigma });
      setResp(json);
    } catch (e: any) {
      setErr(e?.message ?? "Backend error");
    } finally {
      setLoading(false);
    }
  };

  const call = resp?.call ?? resp?.call_price ?? resp?.price ?? resp?.C;
  const put = resp?.put ?? resp?.put_price ?? resp?.P;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold">Option Pricing</h1>
          <p className="text-sm text-muted-foreground">Backend: <span className="font-mono text-foreground/90">{API_BASE}</span></p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            <Field label="Spot (S)" value={S} setValue={setS} />
            <Field label="Strike (K)" value={K} setValue={setK} />
            <Field label="Time (T, years)" value={T} setValue={setT} step={0.05} />
            <Field label="Rate (r)" value={r} setValue={setR} step={0.005} />
            <Field label="Vol (σ)" value={sigma} setValue={setSigma} step={0.01} />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={run} className="h-10 rounded-md bg-primary px-6 font-semibold text-primary-foreground">
              {loading ? "Pricing..." : "Price"}
            </button>
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            <div className="text-xs text-muted-foreground">Endpoint (editable)</div>
            <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono text-sm" />
            <div className="text-xs text-muted-foreground">Request URL</div>
            <div className="rounded-md border border-border bg-background/30 px-3 py-2 font-mono text-xs break-all">{url}</div>
          </div>
        </div>

        {err && <div className="glass-card p-6 border border-destructive/40 text-destructive">{err}</div>}

        {resp && !err && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card p-6">
              <div className="text-sm text-muted-foreground">Call Price</div>
              <div className="mt-1 text-3xl font-bold text-success">{call ?? "—"}</div>
              <div className="mt-4 text-sm text-muted-foreground">Put Price</div>
              <div className="mt-1 text-3xl font-bold text-warning">{put ?? "—"}</div>
            </div>

            <div className="glass-card p-6">
              <div className="text-sm font-semibold mb-2">Raw response</div>
              <pre className="max-h-80 overflow-auto rounded-md border border-border bg-background/30 p-3 text-xs">{JSON.stringify(resp, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function Field({
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
