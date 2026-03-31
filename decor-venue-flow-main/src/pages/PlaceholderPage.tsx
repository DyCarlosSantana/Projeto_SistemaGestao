import { useLocation } from "react-router-dom";
import { navigation } from "@/lib/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Page-specific mock content
const pageContent: Record<string, { description: string; stats?: { label: string; value: string }[]; actions?: string[] }> = {
  "/pdv": {
    description: "Registre vendas rapidamente com interface de caixa simplificada.",
    stats: [{ label: "Vendas hoje", value: "5" }, { label: "Total", value: "R$ 980,00" }, { label: "Ticket médio", value: "R$ 196,00" }],
    actions: ["Nova Venda", "Fechar Caixa", "Sangria"],
  },
  "/locacoes": {
    description: "Gerencie locações de itens decorativos para festas e eventos.",
    stats: [{ label: "Ativas", value: "8" }, { label: "Vencendo", value: "2" }, { label: "Atrasadas", value: "1" }],
    actions: ["Nova Locação", "Devoluções", "Itens Disponíveis"],
  },
  "/orcamentos": {
    description: "Crie e acompanhe orçamentos para seus clientes.",
    stats: [{ label: "Abertos", value: "3" }, { label: "Aprovados", value: "12" }, { label: "Taxa", value: "80%" }],
    actions: ["Novo Orçamento", "Modelos", "Exportar"],
  },
  "/relatorios": {
    description: "Relatórios detalhados sobre desempenho do negócio.",
    stats: [{ label: "Receita", value: "R$ 13.4k" }, { label: "Margem", value: "71%" }, { label: "Crescimento", value: "+12%" }],
    actions: ["Gerar Relatório", "Exportar PDF", "Comparar Períodos"],
  },
  "/clientes": {
    description: "Cadastro e gerenciamento de clientes.",
    stats: [{ label: "Total", value: "147" }, { label: "Ativos", value: "89" }, { label: "Novos (mês)", value: "12" }],
    actions: ["Novo Cliente", "Importar", "Exportar"],
  },
  "/produtos": {
    description: "Controle de estoque e cadastro de produtos.",
    stats: [{ label: "Produtos", value: "234" }, { label: "Baixo estoque", value: "8" }, { label: "Categorias", value: "15" }],
    actions: ["Novo Produto", "Ajustar Estoque", "Categorias"],
  },
  "/itens-locacao": {
    description: "Cadastre e controle itens disponíveis para locação.",
    stats: [{ label: "Itens", value: "56" }, { label: "Disponíveis", value: "42" }, { label: "Em uso", value: "14" }],
    actions: ["Novo Item", "Manutenção", "Inventário"],
  },
  "/calculadora": {
    description: "Calcule custos de impressão e serviços gráficos.",
    stats: [{ label: "Cálculos hoje", value: "8" }, { label: "Médio", value: "R$ 125,00" }],
    actions: ["Novo Cálculo", "Tabela de Preços", "Histórico"],
  },
  "/despesas": {
    description: "Registre e categorize as despesas do negócio.",
    stats: [{ label: "Mês atual", value: "R$ 3.9k" }, { label: "Pendentes", value: "4" }, { label: "Categorias", value: "8" }],
    actions: ["Nova Despesa", "Recorrentes", "Por Categoria"],
  },
  "/fluxo": {
    description: "Visualize entradas e saídas financeiras ao longo do tempo.",
    stats: [{ label: "Saldo", value: "R$ 9.5k" }, { label: "Entradas", value: "R$ 13.4k" }, { label: "Saídas", value: "R$ 3.9k" }],
    actions: ["Visão Mensal", "Projeção", "Exportar"],
  },
  "/fiado": {
    description: "Controle de vendas e locações a prazo (fiado).",
    stats: [{ label: "Em aberto", value: "R$ 2.350" }, { label: "Clientes", value: "7" }, { label: "Vencidos", value: "3" }],
    actions: ["Registrar Pgto", "Cobranças", "Relatório"],
  },
  "/agenda": {
    description: "Calendário de eventos, entregas e devoluções.",
    stats: [{ label: "Hoje", value: "3" }, { label: "Semana", value: "12" }, { label: "Pendentes", value: "2" }],
    actions: ["Novo Evento", "Visão Semanal", "Sincronizar"],
  },
  "/encomendas": {
    description: "Acompanhe encomendas de clientes em produção.",
    stats: [{ label: "Ativas", value: "4" }, { label: "Atrasadas", value: "1" }, { label: "Concluídas (mês)", value: "9" }],
    actions: ["Nova Encomenda", "Em Produção", "Histórico"],
  },
  "/servicos": {
    description: "Gerencie serviços gráficos e de acabamento.",
    stats: [{ label: "Em andamento", value: "6" }, { label: "Aguardando", value: "3" }, { label: "Concluídos", value: "15" }],
    actions: ["Novo Serviço", "Fila", "Tabela de Preços"],
  },
  "/configuracoes": {
    description: "Configurações gerais do sistema DripArt.",
    actions: ["Dados da Loja", "Usuários", "Impressão", "Backup"],
  },
};

export default function PlaceholderPage() {
  const location = useLocation();
  const allItems = navigation.flatMap((s) => s.items);
  const current = allItems.find((i) => i.path === location.pathname);
  const Icon = current?.icon;
  const content = pageContent[location.pathname];

  return (
    <div className="max-w-[1200px] space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{current?.title || "Página"}</h1>
            {content && <p className="mt-0.5 text-sm text-muted-foreground">{content.description}</p>}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {content?.stats && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {content.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Actions */}
      {content?.actions && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {content.actions.map((a, i) => (
            <button
              key={a}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                i === 0
                  ? "bg-gradient-brand text-primary-foreground hover:opacity-90"
                  : "border border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {a}
            </button>
          ))}
        </motion.div>
      )}

      {/* Empty state placeholder */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-20">
          {Icon && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Icon className="h-7 w-7 text-muted-foreground" />
            </div>
          )}
          <p className="text-sm font-medium text-muted-foreground">
            Conteúdo em desenvolvimento
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Esta seção será implementada em breve
          </p>
        </div>
      </motion.div>
    </div>
  );
}
