import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlphaTerminal",
  description: "Advanced Quant Trading Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-slate-950 text-slate-100 overflow-hidden`}>
        
        {/* SIDEBAR */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold text-blue-500 tracking-tight">ALPHA<span className="text-white">TERMINAL</span></h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">📊 Dashboard</Link>
            
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase">Analysis</div>
            <Link href="/pairs" className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">🔄 Pairs Strategy</Link>
            <Link href="/ml" className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">🤖 ML Predictor</Link>
            
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase">Trading</div>
            <Link href="/portfolio" className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">📈 Portfolio Opt</Link>
            <Link href="/options" className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">🎲 Options Calc</Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-slate-950 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
