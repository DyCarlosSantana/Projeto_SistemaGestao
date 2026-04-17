import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fmtDate, fmtPeriod } from "@/lib/format";
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
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Clock, User, Calendar } from "lucide-react";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const TYPE_COLORS: Record<string, string> = {
  compromisso: "#534AB7",
  entrega: "#e8805a",
  locacao: "#3b9ae1",
  encomenda: "#45b369",
};

export default function AgendaPage() {
  const qc = useQueryClient();
  const hoje = new Date();
  const [viewYear, setViewYear] = useState(hoje.getFullYear());
  const [viewMonth, setViewMonth] = useState(hoje.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(hoje.toISOString().slice(0, 10));

  const mesAtual = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;

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
      return api.salvarEvento({
        titulo: titulo.trim(), tipo, data_inicio: dataInicio, data_fim: dataFim || dataInicio,
        hora_inicio: horaInicio || "00:00", hora_fim: horaFim || "23:59",
        cliente_nome: clienteNome.trim(), descricao: descricao.trim(), status, cor,
      }, editId ?? undefined);
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
    setEditId(null); setTitulo(""); setTipo("compromisso");
    setDataInicio(selectedDay || new Date().toISOString().slice(0, 10));
    setDataFim(""); setHoraInicio("08:00"); setHoraFim("09:00");
    setClienteNome(""); setDescricao(""); setStatus("pendente"); setCor("#534AB7");
  }
  function abrirNovo() { resetForm(); setModalOpen(true); }
  function abrirEditar(ev: any) {
    setEditId(ev.id); setTitulo(ev.titulo || ""); setTipo(ev.tipo || "compromisso");
    setDataInicio(ev.data_inicio || ""); setDataFim(ev.data_fim || "");
    setHoraInicio(ev.hora_inicio || ""); setHoraFim(ev.hora_fim || "");
    setClienteNome(ev.cliente_nome || ""); setDescricao(ev.descricao || "");
    setStatus(ev.status || "pendente"); setCor(ev.cor || "#534AB7");
    setModalOpen(true);
  }

  const rows = agendaQ.data || [];

  // Build calendar data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = firstDay.getDay(); // 0=Sun
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; isToday: boolean }> = [];

    // Previous month padding
    const prevMonthLast = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevMonthLast - i;
      const m = viewMonth === 0 ? 12 : viewMonth;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({ date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, day: d, isCurrentMonth: false, isToday: false });
    }

    // Current month
    const todayStr = hoje.toISOString().slice(0, 10);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ date: dateStr, day: d, isCurrentMonth: true, isToday: dateStr === todayStr });
    }

    // Next month padding (fill to 42 cells = 6 rows)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 11 ? 1 : viewMonth + 2;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({ date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, day: d, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Events indexed by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const ev of rows) {
      const start = ev.data_inicio?.slice(0, 10);
      const end = ev.data_fim?.slice(0, 10) || start;
      if (!start) continue;
      // Index event for each day it spans
      const s = new Date(start);
      const e = new Date(end);
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(ev);
      }
    }
    return map;
  }, [rows]);

  const selectedEvents = selectedDay ? (eventsByDate[selectedDay] || []) : [];

  const goMonth = (dir: -1 | 1) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const goToday = () => {
    setViewYear(hoje.getFullYear());
    setViewMonth(hoje.getMonth());
    setSelectedDay(hoje.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Agenda</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Calendário de compromissos, entregas e prazos
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>

      {/* Calendar + sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        {/* Calendar card */}
        <div className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-display text-lg font-bold text-foreground">
              {MONTH_NAMES[viewMonth]}, {viewYear}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8 px-3" onClick={goToday}>
                Hoje
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((cell, i) => {
              const dayEvents = eventsByDate[cell.date] || [];
              const isSelected = cell.date === selectedDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(cell.date)}
                  className={`relative h-20 sm:h-24 border-b border-r border-border/40 p-1.5 text-left transition-colors hover:bg-muted/30
                    ${!cell.isCurrentMonth ? "bg-muted/10" : ""}
                    ${isSelected ? "bg-primary/5 ring-1 ring-primary/30 ring-inset" : ""}
                  `}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                      ${cell.isToday ? "bg-primary text-primary-foreground" : ""}
                      ${!cell.isCurrentMonth ? "text-muted-foreground/40" : "text-foreground"}
                    `}
                  >
                    {cell.day}
                  </span>

                  {/* Event dots / pills */}
                  <div className="mt-0.5 space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 3).map((ev: any, j: number) => (
                      <div
                        key={ev.id + "-" + j}
                        className="truncate rounded px-1 py-0.5 text-[9px] font-medium text-white leading-tight"
                        style={{ backgroundColor: ev.cor || TYPE_COLORS[ev.tipo] || "#534AB7" }}
                        title={ev.titulo}
                      >
                        {ev.titulo}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[9px] text-muted-foreground font-medium px-1">
                        +{dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-5 py-3 border-t border-border">
            {Object.entries(TYPE_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-muted-foreground capitalize">
                  {key === "locacao" ? "Locação" : key === "encomenda" ? "Encomenda" : key === "entrega" ? "Entrega" : "Compromisso"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — selected day events */}
        <div className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display text-sm font-bold text-foreground">
              {selectedDay
                ? new Date(selectedDay + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
                : "Selecione um dia"}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {selectedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
                <Calendar className="h-10 w-10 mb-2" />
                <span className="text-xs">Nenhum evento neste dia</span>
              </div>
            ) : (
              selectedEvents.map((ev: any) => (
                <div
                  key={ev.id}
                  className="card-lift rounded-xl border border-border p-3 space-y-2"
                  style={{ borderLeftWidth: 3, borderLeftColor: ev.cor || TYPE_COLORS[ev.tipo] || "#534AB7" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-sm font-semibold text-foreground truncate">{ev.titulo}</div>
                      {ev.descricao && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{ev.descricao}</p>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`flex-shrink-0 text-[9px] font-bold ${
                        ev.status === "concluido" ? "bg-success-light text-success" :
                        ev.status === "cancelado" ? "bg-secondary text-muted-foreground" :
                        "bg-primary/10 text-primary"
                      }`}
                    >
                      {ev.status === "pendente" ? "Pendente" : ev.status === "concluido" ? "Concluído" : "Cancelado"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ev.hora_inicio || "--:--"} — {ev.hora_fim || "--:--"}
                    </span>
                    {ev.cliente_nome && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ev.cliente_nome}
                      </span>
                    )}
                  </div>

                  {ev.locacao_id && (
                    <Badge variant="secondary" className="text-[9px] py-0">Locação #{ev.locacao_id}</Badge>
                  )}

                  <div className="flex gap-1 pt-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => abrirEditar(ev)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => { if (confirm("Excluir este evento?")) excluirM.mutate(ev.id); }}
                      disabled={excluirM.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add event for selected day */}
          {selectedDay && (
            <div className="p-3 border-t border-border">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={abrirNovo}>
                <Plus className="h-3 w-3 mr-1.5" /> Adicionar Evento
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            <DialogDescription>Preencha as informações do compromisso ou prazo.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Título do Evento *</label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Entrega de Canecas" autoFocus />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Tipo</label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="compromisso">Compromisso</SelectItem>
                  <SelectItem value="entrega">Entrega / Retirada</SelectItem>
                  <SelectItem value="locacao">Locação</SelectItem>
                  <SelectItem value="encomenda">Encomenda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Cor do Evento</label>
              <div className="flex h-10 items-center justify-between overflow-hidden rounded-md border border-input pl-3">
                <span className="text-sm font-mono text-muted-foreground">{cor}</span>
                <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} className="h-10 w-16 cursor-pointer border-0 bg-transparent p-0" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Data Início</label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Data Fim</label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Hora Início</label>
              <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Hora Fim</label>
              <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Cliente (opcional)</label>
              <Input value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
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
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={salvarM.isPending}>Cancelar</Button>
            <Button onClick={() => salvarM.mutate()} disabled={salvarM.isPending}>
              {salvarM.isPending ? "Salvando…" : editId ? "Salvar" : "Criar Evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
