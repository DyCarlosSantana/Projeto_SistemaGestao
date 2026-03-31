import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  BarChart3,
  Users,
  Box,
  PartyPopper,
  Calculator,
  Receipt,
  TrendingUp,
  CreditCard,
  Calendar,
  ClipboardList,
  Wrench,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    items: [
      { title: "Dashboard", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Vendas",
    items: [
      { title: "Caixa / PDV", path: "/pdv", icon: ShoppingCart },
      { title: "Orçamentos", path: "/orcamentos", icon: FileText },
      { title: "Calculadora", path: "/calculadora", icon: Calculator },
    ],
  },
  {
    label: "Locação",
    items: [
      { title: "Locações", path: "/locacoes", icon: Package },
      { title: "Itens p/ Locação", path: "/itens-locacao", icon: PartyPopper },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { title: "Clientes", path: "/clientes", icon: Users },
      { title: "Produtos", path: "/produtos", icon: Box },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { title: "Despesas", path: "/despesas", icon: Receipt },
      { title: "Fluxo de Caixa", path: "/fluxo", icon: TrendingUp },
      { title: "Fiado", path: "/fiado", icon: CreditCard },
    ],
  },
  {
    label: "Operação",
    items: [
      { title: "Agenda", path: "/agenda", icon: Calendar },
      { title: "Encomendas", path: "/encomendas", icon: ClipboardList },
      { title: "Serviços", path: "/servicos", icon: Wrench },
      { title: "Relatórios", path: "/relatorios", icon: BarChart3 },
    ],
  },
  {
    label: "",
    items: [
      { title: "Configurações", path: "/configuracoes", icon: Settings },
    ],
  },
];
