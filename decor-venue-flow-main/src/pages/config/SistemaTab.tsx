import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast as showToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Download, Info } from "lucide-react";

export default function SistemaTab() {
  const backupM = useMutation({
    mutationFn: () => api.fazerBackupManual(),
    onSuccess: (res: any) => showToast.success(res.mensagem || "Backup concluído!"),
    onError: () => showToast.error("Erro ao gerar backup"),
  });

  return (
    <div className="space-y-6">
      {/* Backup */}
      <Card>
        <CardHeader><CardTitle>Manutenção e Segurança</CardTitle><CardDescription>Ferramentas de backup e exportação de dados.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/5">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <div><h4 className="font-semibold">Backup Manual</h4><p className="text-sm text-muted-foreground">Gera um snapshot imediato do banco de dados.</p></div>
            </div>
            <Button onClick={() => backupM.mutate()} disabled={backupM.isPending}>{backupM.isPending ? "Processando..." : "Gerar Backup"}</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/5">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div><h4 className="font-semibold">Exportar para Excel</h4><p className="text-sm text-muted-foreground">Baixar registros (Vendas, Locações, Clientes).</p></div>
            </div>
            <Badge variant="secondary">Em breve</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Info do sistema */}
      <Card>
        <CardHeader><CardTitle>Informações do Sistema</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Versão</p><p className="text-sm font-semibold">Dycore v2.0.0 SaaS</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Arquitetura</p><p className="text-sm font-semibold">Multi-Tenant Isolado</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Backend</p><p className="text-sm font-semibold">Flask + SQLite/PostgreSQL</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-xs text-muted-foreground">Frontend</p><p className="text-sm font-semibold">React + TypeScript + Vite</p></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
