import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast as showToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";

export default function FinanceiroTab() {
  const qc = useQueryClient();
  const categQ = useQuery({ queryKey: ["categorias_despesa"], queryFn: api.categoriasDespesa });
  const formasQ = useQuery({ queryKey: ["formas_pagamento"], queryFn: api.formasPagamento });

  // Categorias state
  const [catOpen, setCatOpen] = useState(false);
  const [catForm, setCatForm] = useState({ nome: "", cor: "#6B7280" });

  const catSaveM = useMutation({
    mutationFn: () => api.criarCategoriaDespesa(catForm),
    onSuccess: () => { showToast.success("Categoria criada!"); setCatOpen(false); setCatForm({ nome: "", cor: "#6B7280" }); qc.invalidateQueries({ queryKey: ["categorias_despesa"] }); },
    onError: () => showToast.error("Erro ao criar categoria"),
  });
  const catDeleteM = useMutation({
    mutationFn: (id: number) => api.excluirCategoriaDespesa(id),
    onSuccess: () => { showToast.success("Categoria removida."); qc.invalidateQueries({ queryKey: ["categorias_despesa"] }); },
  });

  // Formas state
  const [frmOpen, setFrmOpen] = useState(false);
  const [frmForm, setFrmForm] = useState({ nome: "", tipo: "outros" });

  const frmSaveM = useMutation({
    mutationFn: () => api.criarFormaPagamento(frmForm),
    onSuccess: () => { showToast.success("Forma criada!"); setFrmOpen(false); setFrmForm({ nome: "", tipo: "outros" }); qc.invalidateQueries({ queryKey: ["formas_pagamento"] }); },
    onError: (e: any) => showToast.error(e.details?.erro || "Erro"),
  });
  const frmDeleteM = useMutation({
    mutationFn: (id: number) => api.excluirFormaPagamento(id),
    onSuccess: () => { showToast.success("Forma removida."); qc.invalidateQueries({ queryKey: ["formas_pagamento"] }); },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Categorias de Despesa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div><CardTitle className="text-base">Categorias de Despesa</CardTitle><CardDescription>Organize seus gastos por categoria.</CardDescription></div>
          <Button size="sm" variant="outline" onClick={() => setCatOpen(true)}><Plus className="h-4 w-4 mr-1" />Nova</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(categQ.data || []).map((c: any) => (
              <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: c.cor }} />
                  <span className="text-sm font-medium">{c.nome}</span>
                  {c.padrao === 1 && <Badge variant="secondary" className="text-[9px]">Padrão</Badge>}
                </div>
                {c.padrao !== 1 && (
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Remover?")) catDeleteM.mutate(c.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formas de Pagamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div><CardTitle className="text-base">Formas de Pagamento</CardTitle><CardDescription>Configure as formas aceitas.</CardDescription></div>
          <Button size="sm" variant="outline" onClick={() => setFrmOpen(true)}><Plus className="h-4 w-4 mr-1" />Nova</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(formasQ.data || []).map((f: any) => (
              <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{f.nome}</span>
                  <Badge variant="outline" className="text-[9px] capitalize">{f.tipo}</Badge>
                  {f.padrao === 1 && <Badge variant="secondary" className="text-[9px]">Padrão</Badge>}
                </div>
                {f.padrao !== 1 && (
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Remover?")) frmDeleteM.mutate(f.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog categoria */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Categoria de Despesa</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nome da categoria" value={catForm.nome} onChange={(e) => setCatForm({ ...catForm, nome: e.target.value })} />
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Cor:</label>
              <input type="color" value={catForm.cor} onChange={(e) => setCatForm({ ...catForm, cor: e.target.value })} className="h-10 w-14 rounded border cursor-pointer" />
            </div>
          </div>
          <DialogFooter><Button onClick={() => catSaveM.mutate()} disabled={catSaveM.isPending || !catForm.nome}>{catSaveM.isPending ? "Criando..." : "Criar"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog forma */}
      <Dialog open={frmOpen} onOpenChange={setFrmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Forma de Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nome (ex: PIX QR Code)" value={frmForm.nome} onChange={(e) => setFrmForm({ ...frmForm, nome: e.target.value })} />
            <div className="grid gap-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">Tipo</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={frmForm.tipo} onChange={(e) => setFrmForm({ ...frmForm, tipo: e.target.value })}>
                <option value="dinheiro">Dinheiro</option><option value="pix">PIX</option><option value="debito">Débito</option>
                <option value="credito">Crédito</option><option value="boleto">Boleto</option><option value="transferencia">Transferência</option>
                <option value="fiado">Fiado</option><option value="outros">Outros</option>
              </select>
            </div>
          </div>
          <DialogFooter><Button onClick={() => frmSaveM.mutate()} disabled={frmSaveM.isPending || !frmForm.nome}>{frmSaveM.isPending ? "Criando..." : "Criar"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
