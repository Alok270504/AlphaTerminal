"use client";
import { useState } from "react";

export default function PairsPage() {
  const [ticker1, setTicker1] = useState("GOOG");
  const [ticker2, setTicker2] = useState("GOOGL");
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/pairs/analyze?ticker1=${ticker1}&ticker2=${ticker2}`);
      const data = await res.json();
      setResult(data);
    } catch (e) { alert("Backend Error"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Pairs Trading Strategy</h1>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex gap-4">
        <input value={ticker1} onChange={e => setTicker1(e.target.value)} className="bg-slate-950 text-white p-2 rounded border border-slate-700" />
        <input value={ticker2} onChange={e => setTicker2(e.target.value)} className="bg-slate-950 text-white p-2 rounded border border-slate-700" />
        <button onClick={analyze} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-500">Analyze Cointegration</button>
      </div>
      {result && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-300">Results</h3>
          <p className="mt-2 text-slate-400">P-Value: <span className="text-white font-mono">{result.p_value?.toFixed(4)}</span></p>
          <p className="text-slate-400">Cointegrated: <span className={result.is_cointegrated ? "text-green-400" : "text-red-400"}>{result.is_cointegrated ? "YES" : "NO"}</span></p>
        </div>
      )}
    </div>
  );
}
