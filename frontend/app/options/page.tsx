"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calculator, TrendingUp } from "lucide-react";

export default function OptionPricing() {
  const [spotPrice, setSpotPrice] = useState("100");
  const [strikePrice, setStrikePrice] = useState("100");
  const [volatility, setVolatility] = useState("20");
  
  const payoffData = [];
  const S = parseFloat(spotPrice) || 100;
  const K = parseFloat(strikePrice) || 100;
  for(let p = S * 0.5; p <= S * 1.5; p += S * 0.05) {
    payoffData.push({ price: p, payoff: Math.max(0, p - K) });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Option Pricing Engine</h1><p className="mt-2 text-muted-foreground">Black-Scholes and Monte Carlo valuation</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="glass-card space-y-6 p-6">
          <h2 className="text-lg font-semibold">Parameters</h2>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Spot Price ($)</Label><Input type="number" value={spotPrice} onChange={(e) => setSpotPrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>Strike Price ($)</Label><Input type="number" value={strikePrice} onChange={(e) => setStrikePrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>Volatility (%)</Label><Input type="number" value={volatility} onChange={(e) => setVolatility(e.target.value)} /></div>
            <Button className="w-full"><Calculator className="mr-2 h-4 w-4" />Calculate</Button>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-3">
          <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><TrendingUp className="h-5 w-5 text-primary" /></div><h2 className="text-lg font-semibold">Call Option Payoff</h2></div>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payoffData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="price" stroke="hsl(215, 20%, 55%)" />
                <YAxis stroke="hsl(215, 20%, 55%)" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 10%)", border: "1px solid hsl(222, 30%, 18%)" }} />
                <Line type="monotone" dataKey="payoff" stroke="hsl(187, 100%, 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
