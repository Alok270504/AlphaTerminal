"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function MarketMakerPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    // Hardcoded parameters for a quick demo
    const res = await fetch(`http://127.0.0.1:8000/api/market_maker/sim?steps=50&spread=0.1&volatility=0.5`);
    const json = await res.json();
    
    // Format for charts
    const chartData = json.steps.map((s:number, i:number) => ({
      step: s,
      pnl: json.pnl[i],
      inventory: json.inventory[i],
      price: json.prices[i]
    }));
    
    setData(chartData);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 text-slate-100 bg-slate-950 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-500">Market Maker Simulation</h1>
      <p className="text-slate-400">Simulate 50 trades where you quote Bid/Ask prices. Watch how inventory risk affects PnL.</p>
      
      <button 
        onClick={runSim} 
        className="bg-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-500 transition text-white"
      >
        {loading ? "Simulating Market..." : "▶ Run Simulation"}
      </button>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Chart 1: Profit & Loss */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80">
            <h3 className="text-slate-300 font-bold mb-4">Cumulative PnL ($)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="step" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                <Line type="monotone" dataKey="pnl" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Inventory Risk */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80">
            <h3 className="text-slate-300 font-bold mb-4">Inventory (Assets Held)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="step" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                <Line type="monotone" dataKey="inventory" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}
