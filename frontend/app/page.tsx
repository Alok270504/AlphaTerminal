export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Market Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-slate-400 text-sm font-bold uppercase">Portfolio Value</h3>
          <p className="text-3xl font-mono font-bold text-green-400 mt-2">,592.00</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-slate-400 text-sm font-bold uppercase">Active Strategies</h3>
          <p className="text-3xl font-mono font-bold text-blue-400 mt-2">3 Running</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-slate-400 text-sm font-bold uppercase">Sharpe Ratio</h3>
          <p className="text-3xl font-mono font-bold text-purple-400 mt-2">1.85</p>
        </div>
      </div>
      <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 text-center text-slate-500">
        Select a module from the sidebar to begin analysis.
      </div>
    </div>
  );
}
