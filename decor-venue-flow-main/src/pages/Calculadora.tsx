import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { brl } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MaterialRow = {
  id: number;
  nome: string;
  tipo?: "m2" | "unidade" | string;
  preco_m2?: number;
  preco_unidade?: number;
  custo_material?: number;
  margem_lucro?: number;
  custo_material_unidade?: number;
};

type AcabamentoRow = {
  id: number;
  nome: string;
  preco_unitario?: number;
  preco_unitario_total?: number;
  preco?: number;
  [k: string]: any;
};

type CalcResult = {
  total?: number;
  descricao?: string;
  acabamentos?: Array<{ nome: string; valor: number }>;
  preco_base?: number;
  custo_total?: number;
  lucro_estimado?: number;
  margem_pct?: number;
};

export default function CalculadoraPage() {
  const qc = useQueryClient();

  const materiaisQ = useQuery({ queryKey: ["materiais"], queryFn: api.materiais });
  const acabamentosQ = useQuery({ queryKey: ["acabamentos"], queryFn: api.acabamentos });

  // --- State: calculadora ---
  const [materialId, setMaterialId] = useState<number | "">("");
  const [largura, setLargura] = useState<number>(1);
  const [altura, setAltura] = useState<number>(1);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [acbIds, setAcbIds] = useState<number[]>([]);

  const selectedMaterial = useMemo(() => {
    const all = materiaisQ.data || [];
    return all.find((m: any) => m.id === materialId) || null;
  }, [materiaisQ.data, materialId]);

  const materialTipo = selectedMaterial?.tipo || "m2";

  const [calc, setCalc] = useState<CalcResult | null>(null);
  const [calcBusy, setCalcBusy] = useState(false);

  const calcularM = useMutation({
    mutationFn: async () => {
      if (!materialId) throw new Error("Selecione um material");
      const payload = {
        largura,
        altura,
        material_id: Number(materialId),
        quantidade,
        acabamentos: acbIds,
      };
      return api.calcularImpressao(payload);
    },
    onSuccess: (d: CalcResult) => setCalc(d),
    onError: () => toast.error("Erro ao calcular impressão"),
    onSettled: () => setCalcBusy(false),
  });

  useEffect(() => {
    const t = setTimeout(() => {
      if (!materialId) return;
      setCalcBusy(true);
      calcularM.mutate();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, largura, altura, quantidade, acbIds]);

  // --- CRUD materiais ---
  const [qMateriais, setQMateriais] = useState("");
  const filteredMateriais = useMemo(() => {
    const all = materiaisQ.data || [];
    const ql = qMateriais.trim().toLowerCase();
    if (!ql) return all;
    return all.filter((m: any) => (m.nome || "").toLowerCase().includes(ql) || (m.categoria || "").toLowerCase().includes(ql));
  }, [materiaisQ.data, qMateriais]);

  const [qAcabamentos, setQAcabamentos] = useState("");
  const filteredAcabamentos = useMemo(() => {
    const all = acabamentosQ.data || [];
    const ql = qAcabamentos.trim().toLowerCase();
    if (!ql) return all;
    return all.filter((a: any) => (a.nome || "").toLowerCase().includes(ql));
  }, [acabamentosQ.data, qAcabamentos]);

  const [modalMatOpen, setModalMatOpen] = useState(false);
  const [editMatId, setEditMatId] = useState<number | null>(null);

  const [matNome, setMatNome] = useState("");
  const [matTipo, setMatTipo] = useState<"m2" | "unidade">("m2");
  const [matPrecoM2, setMatPrecoM2] = useState<number>(0);
  const [matCustoM2, setMatCustoM2] = useState<number>(0);
  const [matPrecoUnid, setMatPrecoUnid] = useState<number>(0);
  const [matCustoUnid, setMatCustoUnid] = useState<number>(0);
  const [matMargem, setMatMargem] = useState<number>(50);
  const [margemTouched, setMargemTouched] = useState(false);

  useEffect(() => {
    if (margemTouched) return;
    const venda = matTipo === "unidade" ? matPrecoUnid : matPrecoM2;
    const custo = matTipo === "unidade" ? matCustoUnid : matCustoM2;
    if (venda > 0) {
      const margem = ((venda - custo) / venda) * 100;
      if (Number.isFinite(margem)) setMatMargem(Number(margem.toFixed(1)));
    }
  }, [matTipo, matPrecoM2, matPrecoUnid, matCustoM2, matCustoUnid, margemTouched]);

  function resetMaterialForm() {
    setEditMatId(null);
    setMatNome("");
    setMatTipo("m2");
    setMatPrecoM2(0);
    setMatCustoM2(0);
    setMatPrecoUnid(0);
    setMatCustoUnid(0);
    setMatMargem(50);
    setMargemTouched(false);
  }

  function abrirNovoMaterial() {
    resetMaterialForm();
    setModalMatOpen(true);
  }

  function abrirEditarMaterial(m: any) {
    setEditMatId(m.id);
    setMatNome(m.nome || "");
    setMatTipo((m.tipo === "unidade" ? "unidade" : "m2") as any);
    setMatPrecoM2(Number(m.preco_m2 || 0));
    setMatCustoM2(Number(m.custo_material || 0));
    setMatPrecoUnid(Number(m.preco_unidade || 0));
    setMatCustoUnid(Number(m.custo_material || 0));
    setMatMargem(Number(m.margem_lucro || 50));
    setMargemTouched(false);
    setModalMatOpen(true);
  }

  const salvarMaterialM = useMutation({
    mutationFn: async () => {
      if (!matNome.trim()) throw new Error("Informe o nome");
      const payload = {
        nome: matNome.trim(),
        tipo: matTipo,
        preco_m2: matTipo === "m2" ? matPrecoM2 : 0,
        custo_material: matTipo === "m2" ? matCustoM2 : matCustoUnid,
        preco_unidade: matTipo === "unidade" ? matPrecoUnid : 0,
        margem_lucro: matMargem,
      };
      return api.salvarMaterial(payload, editMatId ?? undefined);
    },
    onSuccess: async () => {
      toast.success(editMatId ? "Material atualizado!" : "Material criado!");
      setModalMatOpen(false);
      await qc.invalidateQueries({ queryKey: ["materiais"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao salvar material"),
  });

  const excluirMaterialM = useMutation({
    mutationFn: (id: number) => api.excluirMaterial(id),
    onSuccess: async () => {
      toast.success("Material excluído!");
      await qc.invalidateQueries({ queryKey: ["materiais"] });
    },
    onError: () => toast.error("Erro ao excluir material"),
  });

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Calculadora</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Simule impressão e gerencie materiais cadastrados.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={abrirNovoMaterial}>
            + Novo material
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Configurar impressão</div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Material</label>
              <Select
                value={materialId ? String(materialId) : "none"}
                onValueChange={(v) => {
                  const val = v === "none" ? "" : Number(v);
                  setMaterialId(val);
                  if (!val) setAcbIds([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um material..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione…</SelectItem>
                  {(materiaisQ.data || [])
                    .filter((m: any) => (m.tipo || "m2") === "m2")
                    .map((m: any) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.nome} - R$ {m.preco_m2}/m2
                      </SelectItem>
                    ))}
                  {(materiaisQ.data || [])
                    .filter((m: any) => (m.tipo || "m2") === "unidade")
                    .map((m: any) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.nome} - R$ {m.preco_unidade}/un
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {materialTipo === "m2" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Largura (m)</label>
                  <Input type="number" step={0.01} value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Altura (m)</label>
                  <Input type="number" step={0.01} value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground">Quantidade</label>
              <Input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Acabamentos</label>
              <div className="mt-2 flex flex-col gap-2">
                {(acabamentosQ.data || []).map((a: any) => {
                  const checked = acbIds.includes(a.id);
                  const add = Number(a.preco_unitario || a.preco_unitario_total || a.preco || 0);
                  return (
                    <label key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/70 px-4 py-2">
                      <div className="text-sm font-medium text-foreground truncate">{a.nome}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">+ {brl(add)}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setAcbIds((prev) => [...prev, a.id]);
                            else setAcbIds((prev) => prev.filter((x) => x !== a.id));
                          }}
                        />
                      </div>
                    </label>
                  );
                })}
                {!acabamentosQ.isLoading && (acabamentosQ.data || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">Nenhum acabamento cadastrado</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium text-muted-foreground">Valor ao cliente</div>
            <div className="mt-2 text-3xl font-display font-bold text-foreground">
              {calc?.total != null ? brl(calc.total) : brl(0)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{calc?.descricao || "Selecione material e configure acima"}</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm font-semibold">Detalhamento de custo</div>
            <div className="mt-3 text-sm text-muted-foreground">
              {calc ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span>Preço base</span>
                    <span className="font-semibold text-foreground">{brl(calc.preco_base || 0)}</span>
                  </div>
                  {(calc.acabamentos || []).length > 0 && (
                    <div className="space-y-2">
                      {(calc.acabamentos || []).map((a, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                          <span>{a.nome}</span>
                          <span className="font-semibold text-foreground">{brl(a.valor || 0)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <span>Custo estimado</span>
                    <span className="font-semibold text-coral">{brl(calc.custo_total || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Lucro estimado</span>
                    <span className="font-semibold text-success">
                      {brl(calc.lucro_estimado || 0)} {calc.margem_pct != null ? `(${calc.margem_pct}%)` : ""}
                    </span>
                  </div>
                </div>
              ) : (
                <div>—</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              onClick={() => toast("Integração com PDV/Orçamento ainda não implementada no React.")}
              disabled={!calc}
            >
              Adicionar à venda
            </Button>
            <Button variant="secondary" onClick={() => toast("Integração com PDV/Orçamento ainda não implementada no React.")} disabled={!calc}>
              Adicionar ao orçamento
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="text-sm font-semibold">Materiais cadastrados</div>
          <div className="relative max-w-sm flex-1">
            <Input placeholder="Buscar material..." value={qMateriais} onChange={(e) => setQMateriais(e.target.value)} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço venda</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Margem</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(materiaisQ.isLoading ? [] : filteredMateriais).map((m: any) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium text-foreground">{m.nome}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                    {m.tipo === "unidade" ? "Por unidade" : "Por m2"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {m.tipo === "unidade" ? brl(m.preco_unidade || 0) + "/un" : brl(m.preco_m2 || 0) + "/m2"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {brl(m.custo_material || 0) + (m.tipo === "unidade" ? "/un" : "/m2")}
                </TableCell>
                <TableCell className="text-muted-foreground">{m.margem_lucro || 0}%</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => abrirEditarMaterial(m)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Excluir este material?")) excluirMaterialM.mutate(m.id);
                      }}
                      disabled={excluirMaterialM.isPending}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!materiaisQ.isLoading && filteredMateriais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Nenhum material encontrado
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalMatOpen} onOpenChange={(o) => setModalMatOpen(o)}>
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>{editMatId ? "Editar material" : "Novo material"}</DialogTitle>
            <DialogDescription>Configure o tipo, preço, custo e margem.</DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); salvarMaterialM.mutate(); }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Nome *</label>
              <Input value={matNome} onChange={(e) => setMatNome(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Tipo</label>
              <Select value={matTipo} onValueChange={(v: any) => { setMargemTouched(false); setMatTipo(v as any); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m2">Por m2</SelectItem>
                  <SelectItem value="unidade">Por unidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {matTipo === "m2" ? (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Preço m2</label>
                  <Input type="number" step={0.01} value={matPrecoM2} onChange={(e) => { setMatPrecoM2(Number(e.target.value)); setMargemTouched(false); }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Custo</label>
                  <Input type="number" step={0.01} value={matCustoM2} onChange={(e) => { setMatCustoM2(Number(e.target.value)); setMargemTouched(false); }} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Preço unidade</label>
                  <Input type="number" step={0.01} value={matPrecoUnid} onChange={(e) => { setMatPrecoUnid(Number(e.target.value)); setMargemTouched(false); }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Custo</label>
                  <Input type="number" step={0.01} value={matCustoUnid} onChange={(e) => { setMatCustoUnid(Number(e.target.value)); setMargemTouched(false); }} />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Margem (%)</label>
              <Input
                type="number"
                step={0.1}
                value={matMargem}
                onChange={(e) => {
                  setMatMargem(Number(e.target.value));
                  setMargemTouched(true);
                }}
              />
            </div>
          </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setModalMatOpen(false)} disabled={salvarMaterialM.isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvarMaterialM.isPending}>
                {salvarMaterialM.isPending ? "Salvando…" : editMatId ? "Salvar alterações" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

