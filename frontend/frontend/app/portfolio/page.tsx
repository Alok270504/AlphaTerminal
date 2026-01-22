"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function PortfolioPage() {
  const [tickers, setTickers] = useState("NVDA,TSLA,META,AVGO,MSFT");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const optimize = async () => {
    setLoading(true);
    setData(null);
    try {
      const list = tickers.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch(`${API}/api/portfolio/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers: list }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.detail ?? "Backend error");

      const weights = json.weights ?? {};
      const chartData = Object.keys(weights).map((k) => ({ name: k, value: Number(weights[k]) })).filter((x) => x.value > 0.0001);

      setData({ ...json, chartData });
    } catch (e: any) {
      setData({ error: e?.message ?? "Backend error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Portfolio Optimization</h1>

      <div className="glass-card p-6 max-w-4xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={tickers}
            onChange={(e) => setTickers(e.target.value)}
            className="flex-1 h-10 rounded-md border border-input bg-background/40 px-3 py-2 text-sm font-mono"
          />
          <button onClick={optimize} className="h-10 rounded-md bg-primary px-6 text-primary-foreground font-semibold">
            {loading ? "Optimizing..." : "Optimize"}
          </button>
        </div>
        <div className="text-xs text-muted-foreground">POST {API}/api/portfolio/optimize</div>
      </div>

      {data?.error && <div className="mt-6 glass-card p-6 text-red-300 border border-red-900/50">{data.error}</div>}

      {data && !data.error && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="glass-card p-6 space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Expected Return</div>
              <div className="text-2xl font-bold text-green-300">{data.expected_return ?? "—"}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Volatility</div>
              <div className="text-2xl font-bold text-yellow-200">{data.volatility ?? "—"}%</div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="font-semibold mb-2">Weights</div>
              <ul className="space-y-2">
                {Object.entries(data.weights ?? {}).map(([k, v]: any) => (
                  <li key={k} className="flex justify-between">
                    <span className="font-mono text-foreground">{k}</span>
                    <span className="font-mono text-white">{(Number(v) * 100).toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card p-4 lg:col-span-2 h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={150}
                  paddingAngle={4}
                  dataKey="value"
                  label={{ fill: "#ffffff", fontSize: 14, fontWeight: 700 }}
                >
                  {data.chartData.map((_: any, idx: number) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1f2937", borderRadius: "10px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                />
                <Legend wrapperStyle={{ color: "#e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
