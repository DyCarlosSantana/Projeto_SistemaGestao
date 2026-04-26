import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast as showToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TODAS_PERMISSOES = [
  { id: "dashboard_view", label: "Ver Dashboard" },
  { id: "vendas_view", label: "Acessar Caixa/PDV" },
  { id: "vendas_add", label: "Registrar Vendas" },
  { id: "locacoes_view", label: "Acessar Locações" },
  { id: "encomendas_view", label: "Acessar Encomendas" },
  { id: "despesas_view", label: "Acessar Despesas" },
  { id: "clientes_view", label: "Acessar Clientes" },
  { id: "config_view", label: "Acessar Configurações" },
];

export default function CargosTab({ cargos }: { cargos: any[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ id: null, nome: "", descricao: "", permissoes: [] as string[] });

  const saveM = useMutation({
    mutationFn: (data: any) => api.salvarCargo(data, data.id || undefined),
    onSuccess: () => { showToast.success("Cargo salvo!"); setOpen(false); qc.invalidateQueries({ queryKey: ["cargos"] }); },
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => api.excluirCargo(id),
    onSuccess: () => { showToast.success("Cargo removido."); qc.invalidateQueries({ queryKey: ["cargos"] }); },
  });

  const togglePerm = (p: string) => {
    setForm((old: any) => ({
      ...old,
      permissoes: old.permissoes.includes(p) ? old.permissoes.filter((x: string) => x !== p) : [...old.permissoes, p],
    }));
  };

  const openForm = (c: any = null) => {
    setForm(c ? { id: c.id, nome: c.nome, descricao: c.descricao, permissoes: c.permissoes || [] } : { id: null, nome: "", descricao: "", permissoes: [] });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div><CardTitle>Cargos & Hierarquia</CardTitle><CardDescription>Crie matrizes de acessos personalizados.</CardDescription></div>
        <Button size="sm" onClick={() => openForm(null)}>Criar Cargo</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cargos.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum cargo customizado.</p>}
          {cargos.map((c: any) => (
            <div key={c.id} className="flex flex-col p-4 border rounded-xl gap-2 bg-secondary/5 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-sm">{c.nome}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openForm(c)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if (confirm("Remover cargo?")) deleteM.mutate(c.id); }}>Excluir</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{c.descricao || "Sem descrição"}</p>
              <div className="flex flex-wrap gap-1 mt-1">{(c.permissoes || []).map((p: string) => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}</div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{form.id ? "Editar Cargo" : "Criar Cargo"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2"><label className="text-sm font-medium">Nome do Cargo</label><Input placeholder="Ex: Vendedor Sênior" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="grid gap-2"><label className="text-sm font-medium">Descrição</label><Input placeholder="Sobre as funções..." value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
            <div className="mt-2">
              <h4 className="font-medium text-sm mb-3">Permissões de Acesso</h4>
              <div className="grid grid-cols-2 gap-3">
                {TODAS_PERMISSOES.map((p) => (
                  <label key={p.id} className={"flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors " + (form.permissoes.includes(p.id) ? "bg-primary/10 border-primary/50" : "hover:bg-secondary/20")}>
                    <Switch checked={form.permissoes.includes(p.id)} onCheckedChange={() => togglePerm(p.id)} />
                    <span className="text-sm">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => saveM.mutate(form)} disabled={saveM.isPending}>{saveM.isPending ? "Salvando..." : "Salvar Cargo"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
