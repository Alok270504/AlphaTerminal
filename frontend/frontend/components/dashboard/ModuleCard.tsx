import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status: "active" | "beta" | "coming-soon";
  delay?: number;
}

export function ModuleCard({ title, description, href, icon: Icon, status, delay = 0 }: ModuleCardProps) {
  return (
    <Link href={href} className="glass-card-hover group block p-6 opacity-0 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-primary/10 p-3 transition-all duration-300 group-hover:glow">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", status === "active" && "bg-success/10 text-success", status === "beta" && "bg-warning/10 text-warning", status === "coming-soon" && "bg-muted text-muted-foreground")}>
          {status === "active" ? "Active" : status === "beta" ? "Beta" : "Coming Soon"}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
