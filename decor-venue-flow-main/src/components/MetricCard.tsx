import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  subtitleColor?: "success" | "warning" | "coral" | "muted";
  icon: LucideIcon;
  gradient?: string;
}

export function MetricCard({ label, value, subtitle, subtitleColor = "muted", icon: Icon, gradient }: MetricCardProps) {
  const subtitleColors = {
    success: "text-success",
    warning: "text-warning",
    coral: "text-coral",
    muted: "text-muted-foreground",
  };

  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-all duration-200 hover:shadow-card hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className={cn("mt-1 text-[11px] font-medium", subtitleColors[subtitleColor])}>{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          gradient || "bg-secondary"
        )}>
          <Icon className={cn("h-5 w-5", gradient ? "text-primary-foreground" : "text-muted-foreground")} />
        </div>
      </div>
    </div>
  );
}
