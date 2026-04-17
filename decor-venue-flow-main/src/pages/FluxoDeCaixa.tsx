import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { brl, fmtDate } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function FluxoDeCaixaPage() {
  const hoje = new Date();
  const iniPadrao = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().slice(0, 10);
  const fimPadrao = hoje.toISOString().slice(0, 10);

  const [ini, setIni] = useState(iniPadrao);
  const [fim, setFim] = useState(fimPadrao);
  const [data, setData] = useState<any>(null);

  const gerarM = useMutation({
    mutationFn: () => api.fluxoCaixa({ data_ini: ini, data_fim: fim }),
    onSuccess: (d: any) => setData(d),
    onError: () => toast.error("Erro ao carregar fluxo de caixa"),
  });

  const saldoCor = (data?.saldo ?? 0) >= 0 ? "text-cyan" : "text-coral";
  const tipoLabels: Record<string, string> = useMemo(
    () => ({
      impressao: "Impressão",
      produto: "Produto",
      servico: "Serviço",
      locacao: "Locação",
      outro: "Outros",
      encomenda: "Encomenda",
      orcamento: "Orçamento",
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Fluxo de caixa</h1>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">De</label>
              <Input type="date" value={ini} onChange={(e) => setIni(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Até</label>
              <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </div>
          </div>
          <Button onClick={() => gerarM.mutate()} disabled={gerarM.isPending}>
            {gerarM.isPending ? "Gerando…" : "Gerar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Total entradas</div>
          <div className="mt-1 text-2xl font-display font-bold text-cyan">{data ? brl(data.total_entradas || 0) : "—"}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Total saídas</div>
          <div className="mt-1 text-2xl font-display font-bold text-coral">{data ? brl(data.total_saidas || 0) : "—"}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">Saldo</div>
          <div className={`mt-1 text-2xl font-display font-bold ${saldoCor}`}>{data ? brl(data.saldo || 0) : "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="px-2 py-2 text-sm font-semibold text-cyan">Entradas</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.entradas?.length ? (
                data.entradas.map((e: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground">{fmtDate(e.data)}</TableCell>
                    <TableCell className="text-muted-foreground">{e.descricao || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary text-muted-foreground">
                        {tipoLabels[e.categoria] || e.categoria || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-cyan">{brl(e.valor || 0)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    {data ? "Sem entradas no período." : "Clique em Gerar para ver o fluxo."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="px-2 py-2 text-sm font-semibold text-coral">Saídas</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.saidas?.length ? (
                data.saidas.map((s: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground">{fmtDate(s.data)}</TableCell>
                    <TableCell className="text-muted-foreground">{s.descricao}</TableCell>
                    <TableCell className="text-muted-foreground">{s.categoria || "—"}</TableCell>
                    <TableCell className="text-right font-medium text-coral">{brl(s.valor || 0)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    {data ? "Sem saídas no período." : "Clique em Gerar para ver o fluxo."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

