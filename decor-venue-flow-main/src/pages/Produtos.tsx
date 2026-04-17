import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ProdutoRow } from "@/lib/api";
import { brl } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ImageIcon, Edit2, Trash2, Plus, Package, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function emptyProduto(): Partial<ProdutoRow> {
  return { nome: "", categoria: "", preco_venda: 0, estoque: 0, imagem_url: "" };
}

export default function ProdutosPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [estoqueFiltro, setEstoqueFiltro] = useState<"" | "baixo" | "zerado">("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProdutoRow | null>(null);
  const [form, setForm] = useState<Partial<ProdutoRow>>(emptyProduto());

  const produtosQ = useQuery({
    queryKey: ["produtos"],
    queryFn: api.produtos,
  });

  const saveM = useMutation({
    mutationFn: async () => {
      if (!form.nome?.trim()) throw new Error("Nome é obrigatório");
      const preco = Number(form.preco_venda || 0);
      if (!Number.isFinite(preco) || preco <= 0) throw new Error("Preço inválido");
      const estoque = Number(form.estoque || 0);
      const id = editing?.id;
      return api.salvarProduto(
        {
          nome: form.nome.trim(),
          categoria: (form.categoria || "").toString(),
          preco_venda: preco,
          estoque: Number.isFinite(estoque) ? Math.trunc(estoque) : 0,
          imagem_url: form.imagem_url || "",
        },
        id,
      );
    },
    onSuccess: async () => {
      toast.success(editing ? "Produto atualizado!" : "Produto criado!");
      setOpen(false);
      setEditing(null);
      setForm(emptyProduto());
      await qc.invalidateQueries({ queryKey: ["produtos"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao salvar produto"),
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => api.excluirProduto(id),
    onSuccess: async () => {
      toast.success("Produto excluído!");
      await qc.invalidateQueries({ queryKey: ["produtos"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  const rows = useMemo(() => {
    let data = produtosQ.data || [];
    if (q) {
      const lower = q.toLowerCase();
      data = data.filter(
        (p) =>
          p.nome.toLowerCase().includes(lower) ||
          (p.categoria || "").toLowerCase().includes(lower),
      );
    }
    if (estoqueFiltro === "baixo") data = data.filter((p) => p.estoque <= 5 && p.estoque > 0);
    if (estoqueFiltro === "zerado") data = data.filter((p) => p.estoque <= 0);
    return data;
  }, [produtosQ.data, q, estoqueFiltro]);

  const estoqueColor = (n: number) => {
    if (n <= 0) return "text-destructive bg-destructive/10";
    if (n <= 5) return "text-warning bg-warning-light";
    return "text-success bg-success-light";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Produtos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Catálogo de produtos — {rows.length} item(s)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setForm(emptyProduto());
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={estoqueFiltro} onValueChange={(v) => setEstoqueFiltro(v as any)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estoque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="baixo">Estoque Baixo</SelectItem>
            <SelectItem value="zerado">Estoque Zerado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards Grid */}
      {produtosQ.isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Carregando produtos…</div>
      ) : rows.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Package className="mx-auto h-12 w-12 mb-3 opacity-30" />
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((p) => (
            <div
              key={p.id}
              className="card-lift group relative rounded-2xl border border-border bg-card overflow-hidden shadow-subtle"
            >
              {/* Image area */}
              <div className="relative h-40 bg-muted/30 flex items-center justify-center overflow-hidden">
                {p.imagem_url ? (
                  <img
                    src={p.imagem_url}
                    alt={p.nome}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                    <ImageIcon className="h-10 w-10" />
                    <span className="text-[10px] uppercase tracking-wider">Sem imagem</span>
                  </div>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setForm(p);
                        setOpen(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-primary shadow-sm hover:bg-white transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir "${p.nome}"?`)) deleteM.mutate(p.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-destructive shadow-sm hover:bg-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stock badge */}
                {p.estoque <= 5 && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className={`text-[10px] font-bold ${estoqueColor(p.estoque)}`}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {p.estoque <= 0 ? "Sem estoque" : `Estoque: ${p.estoque}`}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {p.nome}
                  </h3>
                </div>

                {p.categoria && (
                  <Badge variant="outline" className="text-[10px]">
                    {p.categoria}
                  </Badge>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="font-display text-lg font-bold text-primary">
                    {brl(p.preco_venda)}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${estoqueColor(p.estoque)}`}>
                    {p.estoque > 5 ? `${p.estoque} un.` : p.estoque <= 0 ? "Esgotado" : `${p.estoque} un.`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveM.mutate();
            }}
          >
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription>Informe os dados do produto.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nome *</label>
                <Input
                  autoFocus
                  value={form.nome || ""}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Categoria</label>
                  <Input
                    value={form.categoria || ""}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    placeholder="Ex: Caneca"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">URL da Imagem</label>
                  <Input
                    value={form.imagem_url || ""}
                    onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Preço de Venda *</label>
                  <Input
                    type="number"
                    step={0.01}
                    value={form.preco_venda || ""}
                    onChange={(e) => setForm({ ...form, preco_venda: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Estoque</label>
                  <Input
                    type="number"
                    value={form.estoque ?? 0}
                    onChange={(e) => setForm({ ...form, estoque: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saveM.isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saveM.isPending}>
                {saveM.isPending ? "Salvando…" : editing ? "Salvar" : "Criar Produto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
