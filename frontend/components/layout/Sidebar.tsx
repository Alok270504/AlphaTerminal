"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, GitCompare, PieChart, Brain, Calculator, TrendingUp, Landmark, FileText } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pairs Trading", href: "/pairs", icon: GitCompare },
  { name: "Portfolio Opt", href: "/portfolio", icon: PieChart },
  { name: "ML Trading", href: "/ml", icon: Brain },
  { name: "Option Pricing", href: "/options", icon: Calculator },
  { name: "Volatility", href: "/volatility", icon: TrendingUp },
  { name: "Market Making", href: "/market-making", icon: Landmark },
  { name: "Research", href: "/research", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">QuantLab</h1>
            <p className="text-xs text-muted-foreground">Quantitative Finance</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200", isActive ? "bg-primary/10 text-primary glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}> 
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
