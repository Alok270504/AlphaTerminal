"use client";

import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { API_BASE, apiPost, buildUrl } from "@/lib/api";

export default function ResearchPage() {
  const [endpoint, setEndpoint] = useState("/api/research/replicate"); // edit if backend differs
  const [paperId, setPaperId] = useState("gatev_2006_pairs_trading");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const url = useMemo(() => buildUrl(endpoint), [endpoint]);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const json = await apiPost(endpoint, { paper_id: paperId });
      setResp(json);
    } catch (e: any) {
      setErr(e?.message ?? "Backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-3xl font-bold">Paper Replication</h1>
          <p className="text-sm text-muted-foreground">Backend: <span className="font-mono text-foreground/90">{API_BASE}</span></p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Paper ID</div>
            <input value={paperId} onChange={(e) => setPaperId(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background/40 px-3 font-mono" />
            <div className="mt-2 text-xs text-muted-foreground">
              Example: gatev_2006_pairs_trading (change to whatever your backend supports)
            </div>
          </div>

          <button onClick={run} className="h-10 rounded-md bg-primary px-6 font-semibold text-primary-foreground">
            {loading ? "Running..." : "Run replication"}
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
          <div className="glass-card p-6">
            <div className="text-sm font-semibold mb-2">Result</div>
            <pre className="max-h-[520px] overflow-auto rounded-md border border-border bg-background/30 p-3 text-xs">{JSON.stringify(resp, null, 2)}</pre>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
