"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "Jan", portfolio: 100000, benchmark: 100000 },
  { date: "Feb", portfolio: 105200, benchmark: 102000 },
  { date: "Mar", portfolio: 103800, benchmark: 99500 },
  { date: "Apr", portfolio: 112000, benchmark: 104000 },
  { date: "May", portfolio: 118500, benchmark: 108000 },
  { date: "Jun", portfolio: 115200, benchmark: 106500 },
  { date: "Jul", portfolio: 124800, benchmark: 112000 },
  { date: "Aug", portfolio: 128900, benchmark: 115000 },
  { date: "Sep", portfolio: 126500, benchmark: 113500 },
  { date: "Oct", portfolio: 135200, benchmark: 118000 },
];

export function PerformanceChart() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Performance History</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px" }} />
            <Area type="monotone" dataKey="portfolio" stroke="hsl(187, 100%, 50%)" strokeWidth={2} fill="url(#colorPortfolio)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
