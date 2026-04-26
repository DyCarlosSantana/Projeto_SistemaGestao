import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast as showToast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmpresaTab from "@/pages/config/EmpresaTab";
import UsuariosTab from "@/pages/config/UsuariosTab";
import CargosTab from "@/pages/config/CargosTab";
import ModulosTab from "@/pages/config/ModulosTab";
import FinanceiroTab from "@/pages/config/FinanceiroTab";
import SistemaTab from "@/pages/config/SistemaTab";

export default function ConfiguracoesPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("empresa");

  const configQ = useQuery({ queryKey: ["configuracoes"], queryFn: api.configuracoes });
  const usuariosQ = useQuery({ queryKey: ["usuarios"], queryFn: api.usuarios });
  const cargosQ = useQuery({ queryKey: ["cargos"], queryFn: api.cargos });
  const modulosQ = useQuery({ queryKey: ["modulos"], queryFn: api.modulos });

  const saveConfigM = useMutation({
    mutationFn: (data: any) => api.salvarConfiguracoes(data),
    onSuccess: () => { showToast.success("Configurações salvas!"); qc.invalidateQueries({ queryKey: ["configuracoes"] }); },
    onError: () => showToast.error("Erro ao salvar configurações"),
  });

  const toggleModuloM = useMutation({
    mutationFn: ({ modulo, ativo }: { modulo: string; ativo: boolean }) => api.toggleModulo(modulo, ativo),
    onSuccess: () => { showToast.success("Módulo atualizado!"); qc.invalidateQueries({ queryKey: ["modulos"] }); qc.invalidateQueries({ queryKey: ["me", "modulos"] }); },
  });

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua empresa, usuários, módulos e preferências.</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="cargos">Cargos</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="empresa">
            <EmpresaTab config={configQ.data || {}} onSave={(d: any) => saveConfigM.mutate(d)} isLoading={saveConfigM.isPending} />
          </TabsContent>
          <TabsContent value="usuarios">
            <UsuariosTab usuarios={usuariosQ.data || []} cargos={cargosQ.data || []} />
          </TabsContent>
          <TabsContent value="cargos">
            <CargosTab cargos={cargosQ.data || []} />
          </TabsContent>
          <TabsContent value="modulos">
            <ModulosTab modulos={modulosQ.data || []} onToggle={(m, a) => toggleModuloM.mutate({ modulo: m, ativo: a })} />
          </TabsContent>
          <TabsContent value="financeiro">
            <FinanceiroTab />
          </TabsContent>
          <TabsContent value="sistema">
            <SistemaTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
