import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_BASE_URL } from "@/lib/api";
import { brl, fmtDate } from "@/lib/format";
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

const STEPS = ["pedido", "producao", "pronto", "entregue"];
const LABELS: Record<string, string> = {
  pedido: "Pedido",
  producao: "Produção",
  pronto: "Pronto p/ Retirada",
  entregue: "Entregue",
  cancelado: "Cancelado",
};
const BADGES: Record<string, string> = {
  pedido: "bg-secondary text-foreground",
  producao: "bg-warning-light text-warning",
  pronto: "bg-info-light text-info",
  entregue: "bg-success-light text-success",
  cancelado: "bg-destructive-light text-destructive",
};

export default function EncomendasPage() {
  const qc = useQueryClient();
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [clienteNome, setClienteNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("pedido");
  const [dataEntrega, setDataEntrega] = useState("");
  const [total, setTotal] = useState<number>(0);
  const [obs, setObs] = useState("");

  const encomendasQ = useQuery({
    queryKey: ["encomendas", busca, statusFiltro],
    queryFn: () => api.encomendas({ q: busca, status: statusFiltro }),
  });

  const dashQ = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.dashboard(),
  });

  const excluirM = useMutation({
    mutationFn: (id: number) => api.excluirEncomenda(id),
    onSuccess: async () => {
      toast.success("Encomenda excluída!");
      await qc.invalidateQueries({ queryKey: ["encomendas"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      await qc.invalidateQueries({ queryKey: ["agenda"] });
    },
    onError: () => toast.error("Erro ao excluir encomenda"),
  });

  const salvarM = useMutation({
    mutationFn: async () => {
      if (!clienteNome.trim()) throw new Error("Informe o cliente");
      if (!descricao.trim()) throw new Error("Informe a descrição");
      return api.salvarEncomenda(
        {
          cliente_nome: clienteNome,
          descricao,
          data_entrega: dataEntrega,
          status,
          total,
          obs,
        },
        editId ?? undefined
      );
    },
    onSuccess: async () => {
      toast.success(editId ? "Encomenda atualizada!" : "Encomenda criada!");
      setModalOpen(false);
      await qc.invalidateQueries({ queryKey: ["encomendas"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      await qc.invalidateQueries({ queryKey: ["agenda"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao salvar encomenda"),
  });

  const alterarStatusM = useMutation({
    mutationFn: ({ id, novoStatus }: { id: number; novoStatus: string }) =>
      api.atualizarStatusEncomenda(id, novoStatus),
    onSuccess: async () => {
      toast.success("Status atualizado!");
      await qc.invalidateQueries({ queryKey: ["encomendas"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      await qc.invalidateQueries({ queryKey: ["agenda"] });
    },
    onError: () => toast.error("Erro ao atualizar status"),
  });

  function resetForm() {
    setEditId(null);
    setClienteNome("");
    setDescricao("");
    setStatus("pedido");
    setDataEntrega("");
    setTotal(0);
    setObs("");
  }

  function abrirNovo() {
    resetForm();
    setModalOpen(true);
  }

  function abrirEditar(e: any) {
    setEditId(e.id);
    setClienteNome(e.cliente_nome || "");
    setDescricao(e.descricao || "");
    setStatus(e.status || "pedido");
    setDataEntrega(e.data_entrega || "");
    setTotal(e.total || 0);
    setObs(e.obs || "");
    setModalOpen(true);
  }

  function avancarStatus(id: number, atual: string) {
    const idx = STEPS.indexOf(atual);
    if (idx >= 0 && idx < STEPS.length - 1) {
      alterarStatusM.mutate({ id, novoStatus: STEPS[idx + 1] });
    }
  }

  const rows = encomendasQ.data || [];
  const pendentesCount = dashQ.data?.encomendas_pendentes ?? 0;
  const atrasadasCount = dashQ.data?.encomendas_atrasadas ?? 0;

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Encomendas</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Gerencie os pedidos personalizados e prazos de entrega
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={abrirNovo}>
            + Nova Encomenda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-subtle">
          <div className="text-xs font-medium text-muted-foreground">Em Andamento</div>
          <div className="mt-1 text-2xl font-bold text-foreground">{pendentesCount}</div>
        </div>
        <div className="rounded-2xl border border-warning/20 bg-warning-light p-4 shadow-subtle">
          <div className="text-xs font-medium text-warning">Atrasadas</div>
          <div className="mt-1 text-2xl font-bold text-warning">{atrasadasCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Buscar por cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Qualquer Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos</SelectItem>
            <SelectItem value="pedido">Pedido</SelectItem>
            <SelectItem value="producao">Produção</SelectItem>
            <SelectItem value="pronto">Pronto p/ Retirada</SelectItem>
            <SelectItem value="entregue">Entregue</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={() => encomendasQ.refetch()} disabled={encomendasQ.isFetching}>
          Filtrar
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-2 shadow-subtle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {encomendasQ.isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Carregando encomendas…
                </TableCell>
              </TableRow>
            )}
            {!encomendasQ.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhuma encomenda encontrada.
                </TableCell>
              </TableRow>
            )}
            {rows.map((enc: any) => {
              const isAtrasado =
                enc.data_entrega &&
                new Date(enc.data_entrega).getTime() < new Date().getTime() &&
                enc.status !== "entregue" && enc.status !== "cancelado";
              return (
                <TableRow key={enc.id}>
                  <TableCell className="text-muted-foreground font-mono text-xs">{enc.numero}</TableCell>
                  <TableCell className="font-medium text-foreground">{enc.cliente_nome}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground" title={enc.descricao}>
                    {enc.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={BADGES[enc.status] || ""}>
                      {LABELS[enc.status] || enc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={isAtrasado ? "font-semibold text-warning" : "text-muted-foreground"}>
                    {fmtDate(enc.data_entrega)}
                    {isAtrasado && " (!)"}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{brl(enc.total)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex justify-end gap-2">
                      {STEPS.includes(enc.status) && enc.status !== "entregue" && (
                        <Button
                          size="sm"
                          onClick={() => avancarStatus(enc.id, enc.status)}
                          disabled={alterarStatusM.isPending}
                        >
                          Avançar Status
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => window.open(`${API_BASE_URL}/encomendas/${enc.id}/pdf`, "_blank")}>
                        Gerar PDF
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => abrirEditar(enc)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Deseja excluir esta encomenda?")) excluirM.mutate(enc.id);
                        }}
                        disabled={excluirM.isPending}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <form onSubmit={(e) => { e.preventDefault(); salvarM.mutate(); }}>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Encomenda" : "Nova Encomenda"}</DialogTitle>
            <DialogDescription>Preencha os dados do pedido personalizado.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Cliente *</label>
              <Input
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                placeholder="Nome do cliente"
                autoFocus
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Descrição do Pedido *</label>
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: 50 unids de Caneca branca personalizada"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Data de Entrega</label>
              <Input type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Total (R$)</label>
              <Input type="number" step={0.01} value={total} onChange={(e) => setTotal(Number(e.target.value))} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Status Atual</label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pedido">Pedido</SelectItem>
                  <SelectItem value="producao">Produção</SelectItem>
                  <SelectItem value="pronto">Pronto p/ Retirada</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Observações / Interno</label>
              <Input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="(opcional)" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={salvarM.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvarM.isPending}>
              {salvarM.isPending ? "Salvando…" : editId ? "Salvar alterações" : "Criar Encomenda"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
