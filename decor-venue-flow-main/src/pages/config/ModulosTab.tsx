import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, ClipboardList, Box, Receipt, Calendar, Calculator, Wrench } from "lucide-react";

const MODULOS = [
  { modulo: "vendas", label: "Vendas & PDV", desc: "Caixa, orçamentos e pedidos.", icon: ShoppingCart },
  { modulo: "locacoes", label: "Locações", desc: "Gestão de inventário para aluguel e kits.", icon: Package },
  { modulo: "encomendas", label: "Encomendas", desc: "Controle de produção e prazos.", icon: ClipboardList },
  { modulo: "produtos", label: "Estoque", desc: "Catálogo e controle de quantidades.", icon: Box },
  { modulo: "despesas", label: "Financeiro", desc: "Controle de custos e contas.", icon: Receipt },
  { modulo: "agenda", label: "Agenda", desc: "Calendário de compromissos.", icon: Calendar },
  { modulo: "calculadora", label: "Calculadora", desc: "Cálculos de impressão e materiais.", icon: Calculator },
  { modulo: "servicos", label: "Serviços", desc: "Catálogo de serviços oferecidos.", icon: Wrench },
];

export default function ModulosTab({ modulos, onToggle }: { modulos: any[]; onToggle: (m: string, a: boolean) => void }) {
  const getAtivo = (slug: string) => {
    const found = modulos.find((m: any) => m.modulo === slug);
    return found ? found.ativo === 1 : true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Módulos do Sistema</CardTitle>
        <CardDescription>Ative ou desative funcionalidades conforme sua necessidade. Módulos desativados ficam ocultos no menu.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULOS.map((m) => {
          const ativo = getAtivo(m.modulo);
          return (
            <div key={m.modulo} className={`flex flex-col justify-between p-4 border rounded-xl gap-3 transition-all ${ativo ? "hover:bg-secondary/10 border-border" : "opacity-50 border-dashed"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{m.label}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                  </div>
                </div>
                <Switch checked={ativo} onCheckedChange={(checked) => onToggle(m.modulo, checked)} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
