"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function VolatilityPage() {
  const [ticker, setTicker] = useState("SPY");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runGarch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/volatility/forecast?ticker=${ticker}`);
      const json = await res.json();
      
      // Combine history and forecast for charting
      const chartData = json.dates.map((d:string, i:number) => ({
        date: d,
        volatility: json.history[i]
      }));
      
      setData({ ...json, chartData });
    } catch (e) { alert("Backend error"); }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 text-slate-100 bg-slate-950 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-500">GARCH Volatility Lab</h1>
      
      <div className="flex gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-800 max-w-2xl">
        <input 
          value={ticker} 
          onChange={e => setTicker(e.target.value)} 
          className="bg-slate-950 p-3 rounded border border-slate-700 text-white font-mono uppercase"
          placeholder="Enter Ticker (e.g. BTC-USD)" 
        />
        <button 
          onClick={runGarch} 
          className="bg-orange-600 px-6 py-3 rounded font-bold hover:bg-orange-500 text-white transition"
        >
          {loading ? "Fitting Model..." : "Forecast Volatility"}
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
               <div className="text-slate-400 text-sm">Tomorrow's Volatility</div>
               <div className="text-4xl font-mono text-orange-400 font-bold">{data.current_vol}%</div>
             </div>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 col-span-2">
               <div className="text-slate-400 text-sm mb-2">5-Day Forecast Risk Path</div>
               <div className="flex gap-4">
                  {data.forecast.map((v:number, i:number) => (
                    <div key={i} className="bg-slate-800 p-2 rounded text-center min-w-[80px]">
                      <div className="text-xs text-slate-500">Day +{i+1}</div>
                      <div className="font-bold text-orange-200">{v.toFixed(2)}%</div>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-96">
            <div className="text-slate-400 mb-4">Historical Volatility (30-Day Rolling)</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}}
                  formatter={(val: number) => [`${val?.toFixed(2)}%`, "Volatility"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="volatility" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorVol)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
