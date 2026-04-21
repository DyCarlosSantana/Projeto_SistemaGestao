import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navigation, type NavGroup } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useModulos } from "@/contexts/ModulosContext";
import { useQuery } from "@tanstack/react-query";
import { api, API_BASE_URL } from "@/lib/api";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasModulo, isAdmin, isGerente } = useModulos();

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number } | null>(null);
  const flyoutTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: config } = useQuery({
    queryKey: ["config_empresa"],
    queryFn: () => (api as any).getEmpresaInfo?.() ?? Promise.resolve(null),
  });

  const empNome = config?.empresa_nome || "Dycore";
  const logoUrl = config?.logo_path || "/logo.png";

  /** Verifica se um grupo / filho deve ser exibido */
  const shouldShow = (item: { modulo?: string | null; minRole?: "admin" | "gerente" }) => {
    if (item.modulo && !hasModulo(item.modulo)) return false;
    if (item.minRole === "admin" && !isAdmin) return false;
    if (item.minRole === "gerente" && !isGerente) return false;
    return true;
  };

  /** Verifica se uma rota é ativa */
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  /** Verifica se algum filho do grupo está ativo */
  const isGroupActive = (group: NavGroup) => {
    if (group.path) return isActive(group.path);
    return group.children?.some((c) => isActive(c.path)) ?? false;
  };

  const handleGroupEnter = (label: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyoutPos({ top: rect.top });
    setHoveredGroup(label);
  };

  const handleGroupLeave = () => {
    flyoutTimeout.current = setTimeout(() => setHoveredGroup(null), 180);
  };

  const handleFlyoutEnter = () => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
  };

  const handleFlyoutLeave = () => {
    flyoutTimeout.current = setTimeout(() => setHoveredGroup(null), 120);
  };

  // Cleanup timeouts
  useEffect(() => () => { if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current); }, []);

  // Close flyout on route change
  useEffect(() => setHoveredGroup(null), [location.pathname]);

  const visibleGroups = navigation.filter(shouldShow);

  const getLogoSrc = (path: string) => {
    if (path.startsWith('data:') || path.startsWith('/')) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <>
      {/* Sidebar rail — always 68px */}
      <aside
        ref={sidebarRef}
        className="sidebar-rail relative z-40 flex h-screen w-[68px] flex-col items-center bg-sidebar border-r border-sidebar-border flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex h-16 w-full items-center justify-center">
          <img
            src={getLogoSrc(logoUrl)}
            alt="Logo"
            className="h-9 w-9 rounded-xl object-contain shadow-sm"
            onError={(e) => {
              // Fallback se a imagem falhar
              (e.target as any).style.display = 'none';
              (e.target as any).nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand font-display text-sm font-bold text-primary-foreground shadow-md">
            {empNome.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex flex-1 flex-col items-center gap-1 pt-2 overflow-y-auto overflow-x-hidden sidebar-scroll">
          {visibleGroups.map((group) => {
            const active = isGroupActive(group);
            const isHovered = hoveredGroup === group.label;

            return (
              <button
                key={group.label}
                onMouseEnter={(e) => {
                  if (group.children && group.children.length > 0) {
                    handleGroupEnter(group.label, e);
                  }
                }}
                onMouseLeave={handleGroupLeave}
                onClick={() => {
                  if (group.path) {
                    navigate(group.path);
                    setHoveredGroup(null);
                  } else if (group.children?.[0]) {
                    navigate(group.children[0].path);
                    setHoveredGroup(null);
                  }
                }}
                className={cn(
                  "sidebar-icon-btn group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  isHovered && !active && "bg-sidebar-accent/60 text-sidebar-accent-foreground"
                )}
                title={group.label}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary" />
                )}
                <group.icon className="h-[20px] w-[20px]" />
              </button>
            );
          })}
        </nav>

        {/* Bottom spacer */}
        <div className="h-4" />
      </aside>

      {/* Flyout popover */}
      {hoveredGroup && flyoutPos && (() => {
        const group = visibleGroups.find((g) => g.label === hoveredGroup);
        if (!group?.children) return null;
        const visibleChildren = group.children.filter(shouldShow);
        if (visibleChildren.length === 0) return null;

        return (
          <div
            className="fixed z-50 ml-[68px] animate-in fade-in-0 slide-in-from-left-2 duration-150"
            style={{ top: flyoutPos.top }}
            onMouseEnter={handleFlyoutEnter}
            onMouseLeave={handleFlyoutLeave}
          >
            <div className="min-w-[200px] rounded-xl border border-border bg-card p-2 shadow-xl backdrop-blur-sm">
              <div className="mb-1.5 px-3 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </div>
              {visibleChildren.map((child) => {
                const childActive = isActive(child.path);
                return (
                  <button
                    key={child.path}
                    onClick={() => {
                      navigate(child.path);
                      setHoveredGroup(null);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      childActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {childActive && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                    {child.title}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}
    </>
  );
}
