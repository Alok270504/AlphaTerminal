"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PortfolioPage() {
  const [tickers, setTickers] = useState("AAPL,MSFT,GOOG,AMZN");
  const [data, setData] = useState<any>(null);

  const optimize = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/portfolio/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers: tickers.split(",") })
      });
      const json = await res.json();
      const chartData = Object.keys(json.weights).map(k => ({ name: k, value: json.weights[k] }));
      setData({ ...json, chartData });
    } catch (e) { alert("Backend Error"); }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Portfolio Optimization</h1>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex gap-4">
        <input value={tickers} onChange={e => setTickers(e.target.value)} className="flex-1 bg-slate-950 text-white p-2 rounded border border-slate-700" />
        <button onClick={optimize} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-500">Optimize</button>
      </div>
      {data && (
        <div className="grid grid-cols-2 gap-8 h-80">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <p className="text-slate-400">Expected Return: <span className="text-green-400 font-bold">{data.expected_return}%</span></p>
            <p className="text-slate-400">Sharpe Ratio: <span className="text-blue-400 font-bold">{data.sharpe_ratio}</span></p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.chartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {data.chartData.map((entry:any, index:number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
