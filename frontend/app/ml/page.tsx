"use client";
import { useState } from "react";

export default function MLPage() {
  const [ticker, setTicker] = useState("SPY");
  const [result, setResult] = useState<any>(null);

  const train = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ml/train?ticker=${ticker}`);
      const data = await res.json();
      setResult(data);
    } catch (e) { alert("Backend Error"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">ML Price Predictor</h1>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex gap-4">
        <input value={ticker} onChange={e => setTicker(e.target.value)} className="bg-slate-950 text-white p-2 rounded border border-slate-700" />
        <button onClick={train} className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-500">Train Model</button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-6">
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
             <p className="text-slate-400">Prediction</p>
             <p className="text-4xl font-bold text-white mt-2">{result.prediction}</p>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
             <p className="text-slate-400">Accuracy</p>
             <p className="text-4xl font-bold text-blue-400 mt-2">{result.accuracy}%</p>
           </div>
        </div>
      )}
    </div>
  );
}
