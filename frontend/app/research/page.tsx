"use client";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const papers = [
  { title: "Betting Against Beta", authors: "Frazzini & Pedersen (2014)", journal: "JFE", status: "in-progress", difficulty: "hard", stars: 5 },
  { title: "Momentum Strategies", authors: "Jegadeesh & Titman (1993)", journal: "JoF", status: "replicated", difficulty: "easy", stars: 4 },
];

export default function Research() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div><h1 className="text-3xl font-bold">Research Replication</h1><p className="mt-2 text-muted-foreground">Replicate influential quantitative finance papers</p></div>

      <div className="space-y-4">
        {papers.map((paper) => (
          <div key={paper.title} className="glass-card-hover p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><FileText className="h-5 w-5 text-primary" /></div><div><h3 className="font-semibold">{paper.title}</h3><p className="text-sm text-muted-foreground">{paper.authors} • {paper.journal}</p></div></div>
                <div className="mt-4 flex items-center gap-4">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", paper.status === "replicated" ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>{paper.status}</span>
                  <div className="flex items-center gap-1">{Array.from({ length: paper.stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10"><ExternalLink className="mr-2 h-4 w-4" />View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
