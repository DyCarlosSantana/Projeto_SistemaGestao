import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar transition-all duration-300 flex-shrink-0",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-brand font-display text-sm font-bold text-primary-foreground">
          D
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display text-[15px] font-bold text-sidebar-accent-foreground">DripArt</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navigation.map((section, si) => (
          <div key={si}>
            {section.label && !collapsed && (
              <div className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
                {section.label}
              </div>
            )}
            {section.label && collapsed && si > 0 && (
              <div className="mx-auto my-3 h-px w-5 bg-sidebar-border" />
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                        isActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                      )}
                    />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
