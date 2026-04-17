import { AppSidebar } from "./AppSidebar";
import { Search, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-6">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-1 hidden sm:flex">
              <span className="text-sm font-semibold truncate max-w-[120px]">{user?.nome}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{user?.role}</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
              {user?.nome?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="h-4 w-[1px] bg-border mx-1" />
            <button
              onClick={logout}
              title="Sair do Sistema"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
