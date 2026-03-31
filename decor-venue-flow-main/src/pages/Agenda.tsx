import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fmtDate } from "@/lib/format";
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

export default function AgendaPage() {
  const qc = useQueryClient();
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(
    `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`
  );

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("compromisso");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");
  const [clienteNome, setClienteNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("pendente");
  const [cor, setCor] = useState("#534AB7");

  const agendaQ = useQuery({
    queryKey: ["agenda", mesAtual],
    queryFn: () => api.agenda({ mes: mesAtual }),
  });

  const excluirM = useMutation({
    mutationFn: (id: number) => api.excluirEvento(id),
    onSuccess: async () => {
      toast.success("Evento excluído!");
      await qc.invalidateQueries({ queryKey: ["agenda"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("Erro ao excluir evento"),
  });

  const salvarM = useMutation({
    mutationFn: async () => {
      if (!titulo.trim()) throw new Error("Informe o título do evento");
      if (!dataInicio) throw new Error("A data de início é obrigatória");

      const payload = {
        titulo: titulo.trim(),
        tipo,
        data_inicio: dataInicio,
        data_fim: dataFim || dataInicio,
        hora_inicio: horaInicio || "00:00",
        hora_fim: horaFim || "23:59",
        cliente_nome: clienteNome.trim(),
        descricao: descricao.trim(),
        status,
        cor,
      };
      return api.salvarEvento(payload, editId ?? undefined);
    },
    onSuccess: async () => {
      toast.success(editId ? "Evento atualizado!" : "Evento criado!");
      setModalOpen(false);
      await qc.invalidateQueries({ queryKey: ["agenda"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao salvar evento"),
  });

  function resetForm() {
    setEditId(null);
    setTitulo("");
    setTipo("compromisso");
    setDataInicio(new Date().toISOString().slice(0, 10));
    setDataFim("");
    setHoraInicio("08:00");
    setHoraFim("09:00");
    setClienteNome("");
    setDescricao("");
    setStatus("pendente");
    setCor("#534AB7");
  }

  function abrirNovo() {
    resetForm();
    setModalOpen(true);
  }

  function abrirEditar(ev: any) {
    setEditId(ev.id);
    setTitulo(ev.titulo || "");
    setTipo(ev.tipo || "compromisso");
    setDataInicio(ev.data_inicio || "");
    setDataFim(ev.data_fim || "");
    setHoraInicio(ev.hora_inicio || "");
    setHoraFim(ev.hora_fim || "");
    setClienteNome(ev.cliente_nome || "");
    setDescricao(ev.descricao || "");
    setStatus(ev.status || "pendente");
    setCor(ev.cor || "#534AB7");
    setModalOpen(true);
  }

  const rows = agendaQ.data || [];

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Agenda</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Gerencie seus compromissos, entregas e locações do mês
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={abrirNovo}>
            + Novo Evento
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Mês:</label>
          <Input
            type="month"
            value={mesAtual}
            onChange={(e) => setMesAtual(e.target.value)}
            className="w-auto"
          />
        </div>
        <Button variant="secondary" onClick={() => agendaQ.refetch()} disabled={agendaQ.isFetching}>
          Atualizar
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-2 shadow-subtle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cor</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agendaQ.isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Carregando agenda…
                </TableCell>
              </TableRow>
            )}
            {!agendaQ.isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhum evento registrado neste mês.
                </TableCell>
              </TableRow>
            )}
            {rows.map((ev: any) => (
              <TableRow key={ev.id}>
                <TableCell>
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: ev.cor || "#534AB7" }} />
                </TableCell>
                <TableCell className="font-medium">
                  {fmtDate(ev.data_inicio)} {ev.data_fim && ev.data_fim !== ev.data_inicio && `até ${fmtDate(ev.data_fim)}`}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {ev.hora_inicio || "--:--"} às {ev.hora_fim || "--:--"}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {ev.titulo} {ev.locacao_id && <Badge variant="secondary" className="ml-2 text-xs">Locação #{ev.locacao_id}</Badge>}
                </TableCell>
                <TableCell className="text-muted-foreground">{ev.cliente_nome || "—"}</TableCell>
                <TableCell>
                  <Badge variant={ev.status === "cancelado" ? "secondary" : ev.status === "concluido" ? "outline" : "default"} className={ev.status === "concluido" ? "border-success text-success" : ""}>
                    {ev.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => abrirEditar(ev)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Deseja realmente excluir este evento?")) excluirM.mutate(ev.id);
                      }}
                      disabled={excluirM.isPending}
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            <DialogDescription>Preencha as informações do compromisso ou prazo.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Título do Evento *</label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Entrega de Canecas"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Tipo</label>
              <Select value={tipo} onValueChange={(v) => setTipo(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compromisso">Compromisso Genérico</SelectItem>
                  <SelectItem value="entrega">Entrega / Retirada</SelectItem>
                  <SelectItem value="locacao">Locação</SelectItem>
                  <SelectItem value="encomenda">Prazo de Encomenda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Cor do Evento</label>
              <div className="flex h-10 items-center justify-between overflow-hidden rounded-md border border-input pl-3">
                <span className="text-sm font-mono text-muted-foreground">{cor}</span>
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="h-10 w-16 cursor-pointer border-0 bg-transparent p-0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Data Início</label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Data Fim</label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} placeholder="(opcional)" />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Hora Início</label>
              <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Hora Fim</label>
              <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
            </div>

            <div className="sm:col-span-1">
              <label className="text-xs font-medium text-muted-foreground">Cliente Atrelado (opcional)</label>
              <Input value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} placeholder="Nome do cliente" />
            </div>

            <div className="sm:col-span-1">
              <label className="text-xs font-medium text-muted-foreground">Status do Evento</label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente / Agendado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Descrição / Notas</label>
              <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Anotações adicionais" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={salvarM.isPending}>
              Cancelar
            </Button>
            <Button onClick={() => salvarM.mutate()} disabled={salvarM.isPending}>
              {salvarM.isPending ? "Salvando…" : editId ? "Salvar alterações" : "Criar evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
