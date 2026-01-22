"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GitCompare, PieChart, Brain, Calculator, TrendingUp, Landmark, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pairs Trading", href: "/pairs-trading", icon: GitCompare },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "ML Trading", href: "/ml-trading", icon: Brain },
  { name: "Options", href: "/options", icon: Calculator },
  { name: "Volatility", href: "/volatility", icon: TrendingUp },
  { name: "Market Making", href: "/market-making", icon: Landmark },
  { name: "Research", href: "/research", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="h-16 border-b border-border px-6 flex items-center">
        <div className="font-semibold">QuantLab</div>
      </div>
      <nav className="p-4 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <n.icon className="h-5 w-5" />
              {n.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
