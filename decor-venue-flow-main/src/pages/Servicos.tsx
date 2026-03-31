import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { brl } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Trash2 } from "lucide-react";

export default function ServicosPage() {
  const qc = useQueryClient();
  const [busca, setBusca] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipoPreco, setTipoPreco] = useState("fixo");
  const [preco, setPreco] = useState<number>(0);

  const servicosQ = useQuery({
    queryKey: ["servicos", busca],
    queryFn: () => api.servicos({ q: busca }),
  });

  const excluirM = useMutation({
    mutationFn: (id: number) => api.excluirServico(id),
    onSuccess: async () => {
      toast.success("Serviço inativado!");
      await qc.invalidateQueries({ queryKey: ["servicos"] });
    },
    onError: () => toast.error("Erro ao inativar serviço"),
  });

  const salvarM = useMutation({
    mutationFn: async () => {
      if (!nome.trim()) throw new Error("Informe o nome do serviço");
      return api.salvarServico(
        {
          nome,
          descricao,
          categoria,
          tipo_preco: tipoPreco,
          preco,
        },
        editId ?? undefined
      );
    },
    onSuccess: async () => {
      toast.success(editId ? "Serviço atualizado!" : "Serviço cadastrado!");
      setModalOpen(false);
      await qc.invalidateQueries({ queryKey: ["servicos"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao salvar serviço"),
  });

  function resetForm() {
    setEditId(null);
    setNome("");
    setDescricao("");
    setCategoria("");
    setTipoPreco("fixo");
    setPreco(0);
  }

  function abrirNovo() {
    resetForm();
    setModalOpen(true);
  }

  function abrirEditar(s: any) {
    setEditId(s.id);
    setNome(s.nome || "");
    setDescricao(s.descricao || "");
    setCategoria(s.categoria || "");
    setTipoPreco(s.tipo_preco || "fixo");
    setPreco(s.preco || 0);
    setModalOpen(true);
  }

  const rows = servicosQ.data || [];

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Catálogo de Serviços</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Gerencie os serviços prestados, como instalação, arte digital e artes finais.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Novo Serviço
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Buscar serviço por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="secondary" onClick={() => servicosQ.refetch()} disabled={servicosQ.isFetching}>
          Buscar
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo de Cobrança</TableHead>
              <TableHead>Preço Base</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicosQ.isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Carregando serviços…
                </TableCell>
              </TableRow>
            )}
            {!servicosQ.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhum serviço cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
            {rows.map((s: any) => (
              <TableRow key={s.id} className="group">
                <TableCell>
                  <div className="font-medium text-foreground">{s.nome}</div>
                  {s.descricao && <div className="text-xs text-muted-foreground max-w-sm truncate">{s.descricao}</div>}
                </TableCell>
                <TableCell>
                  {s.categoria ? (
                    <Badge variant="outline">{s.categoria}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={s.tipo_preco === "fixo" ? "secondary" : "outline"} className="capitalize">
                    {s.tipo_preco === "fixo" ? "Preço Fixo" : "Variável/Hora"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {s.preco > 0 ? brl(s.preco) : <span className="text-muted-foreground text-sm">A Combinar</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => abrirEditar(s)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        if (confirm(`Deseja inativar o serviço ${s.nome}?`)) excluirM.mutate(s.id);
                      }}
                      disabled={excluirM.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={(e) => { e.preventDefault(); salvarM.mutate(); }}>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
            <DialogDescription>Cadastre as informações deste serviço prestado pela DripArt.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nome do Serviço *</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Criação de Arte para Banner"
                autoFocus
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground">Categoria</label>
              <Input
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: Instalação, Arte Digital, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tipo de Cobrança</label>
                <Select value={tipoPreco} onValueChange={setTipoPreco}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixo">Preço Fixo</SelectItem>
                    <SelectItem value="variavel">Orçamento Variável</SelectItem>
                    <SelectItem value="hora">Por Hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Preço (R$)</label>
                <Input
                  type="number"
                  step={0.01}
                  value={preco}
                  onChange={(e) => setPreco(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Descrição / Notas Internas</label>
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes ou observações (opcional)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={salvarM.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvarM.isPending}>
              {salvarM.isPending ? "Salvando…" : editId ? "Salvar alterações" : "Cadastrar Serviço"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
