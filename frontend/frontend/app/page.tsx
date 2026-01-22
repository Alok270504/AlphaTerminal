"use client";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";

const cards = [
  { href: "/pairs-trading", title: "Pairs Trading" },
  { href: "/portfolio", title: "Portfolio Optimization" },
  { href: "/ml-trading", title: "ML Trading" },
  { href: "/options", title: "Option Pricing" },
  { href: "/volatility", title: "Volatility" },
  { href: "/market-making", title: "Market Making" },
  { href: "/research", title: "Research" },
];

export default function Page() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="glass-card-hover p-6">
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="text-sm text-muted-foreground mt-1">Open →</div>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
