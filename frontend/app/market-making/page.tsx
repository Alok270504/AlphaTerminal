"use client";
import { Button } from "@/components/ui/button";
import { Landmark, Clock, Construction } from "lucide-react";

export default function MarketMaking() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
      <div className="glass-card p-12 text-center max-w-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Construction className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Market Making Simulation</h1>
        <p className="mx-auto mt-4 text-muted-foreground">
          Create a simulation of a market-maker with inventory management, bid-ask spread optimization, and risk management.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" /><span>Coming Soon</span>
        </div>
        <Button className="mt-6 w-full" disabled><Landmark className="mr-2 h-4 w-4" />Notify Me When Ready</Button>
      </div>
    </div>
  );
}
