import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ProdutoRow } from "@/lib/api";
import { brl } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    onError: () => toast.error("Erro ao excluir produto"),
  });

  const rows = useMemo(() => {
    const all = produtosQ.data || [];
    const ql = q.trim().toLowerCase();
    return all.filter((p) => {
      if (ql && !(p.nome || "").toLowerCase().includes(ql) && !((p.categoria || "").toLowerCase().includes(ql))) return false;
      if (estoqueFiltro === "baixo" && p.estoque > 5) return false;
      if (estoqueFiltro === "zerado" && p.estoque !== 0) return false;
      return true;
    });
  }, [produtosQ.data, q, estoqueFiltro]);

  const title = useMemo(() => (editing ? "Editar produto" : "Novo produto"), [editing]);

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Produtos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Controle de estoque e cadastro · {produtosQ.isLoading ? "carregando…" : `${rows.length} item(ns)`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditing(null);
              setForm(emptyProduto());
              setOpen(true);
            }}
          >
            + Novo produto
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative max-w-sm flex-1">
          <Input placeholder="Buscar produto…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={estoqueFiltro || "all"} onValueChange={(v: any) => setEstoqueFiltro(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todo estoque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo estoque</SelectItem>
            <SelectItem value="baixo">Estoque baixo (≤ 5)</SelectItem>
            <SelectItem value="zerado">Estoque zerado</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={() => produtosQ.refetch()} disabled={produtosQ.isFetching}>
          Atualizar
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-2 shadow-subtle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Img</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosQ.isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Carregando…
                </TableCell>
              </TableRow>
            )}
            {produtosQ.isError && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Erro ao carregar. Verifique o backend.
                </TableCell>
              </TableRow>
            )}
            {!produtosQ.isLoading && !produtosQ.isError && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.imagem_url ? (
                    <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center text-muted-foreground"><ImageIcon className="w-4 h-4"/></div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">{p.nome}</TableCell>
                <TableCell className="text-muted-foreground">{p.categoria || "—"}</TableCell>
                <TableCell className="font-medium text-foreground">{brl(p.preco_venda)}</TableCell>
                <TableCell className="text-muted-foreground">{p.estoque}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(p);
                        setForm(p);
                        setOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Excluir este produto?")) deleteM.mutate(p.id);
                      }}
                      disabled={deleteM.isPending}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <form onSubmit={(e) => { e.preventDefault(); saveM.mutate(); }}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Cadastro do produto e controle de estoque.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Nome *</label>
              <Input value={form.nome || ""} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Categoria</label>
              <Input value={form.categoria || ""} onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Preço *</label>
              <Input
                inputMode="decimal"
                value={String(form.preco_venda ?? "")}
                onChange={(e) => setForm((p) => ({ ...p, preco_venda: Number(e.target.value.replace(",", ".")) }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Estoque</label>
              <Input
                inputMode="numeric"
                value={String(form.estoque ?? "")}
                onChange={(e) => setForm((p) => ({ ...p, estoque: Number(e.target.value) }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">URL da Imagem</label>
              <div className="flex gap-3 mt-1">
                {form.imagem_url ? (
                  <img src={form.imagem_url} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground shrink-0"><ImageIcon className="w-5 h-5"/></div>
                )}
                <Input value={form.imagem_url || ""} onChange={(e) => setForm((p) => ({ ...p, imagem_url: e.target.value }))} placeholder="https://..." className="flex-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saveM.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saveM.isPending}>
              {saveM.isPending ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

