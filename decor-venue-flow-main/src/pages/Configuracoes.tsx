import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast as showToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ConfiguracoesPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("perfil");

  // --- Queries ---
  const configQ = useQuery({ queryKey: ["configuracoes"], queryFn: api.configuracoes });
  const usuariosQ = useQuery({ queryKey: ["usuarios"], queryFn: api.usuarios });
  const cargosQ = useQuery({ queryKey: ["cargos"], queryFn: api.cargos });
  const modulosQ = useQuery({ queryKey: ["modulos"], queryFn: api.modulos });

  // --- Mutations ---
  const saveConfigM = useMutation({
    mutationFn: (data: any) => api.salvarConfiguracoes(data),
    onSuccess: () => {
      showToast.success("Configurações salvas!");
      qc.invalidateQueries({ queryKey: ["configuracoes"] });
    },
    onError: () => showToast.error("Erro ao salvar configurações"),
  });

  const toggleModuloM = useMutation({
    mutationFn: ({ modulo, ativo }: { modulo: string; ativo: boolean }) =>
      api.toggleModulo(modulo, ativo),
    onSuccess: () => {
      showToast.success("Módulo atualizado!");
      qc.invalidateQueries({ queryKey: ["modulos"] });
      // Invalida 'me/modulos' se existir para atualizar sidebar
      qc.invalidateQueries({ queryKey: ["me", "modulos"] });
    },
  });

  const backupM = useMutation({
    mutationFn: () => api.fazerBackupManual(),
    onSuccess: (res: any) => showToast.success(res.mensagem || "Backup concluído!"),
    onError: () => showToast.error("Erro ao gerar backup"),
  });

  // --- Render Sections ---

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua empresa, usuários e preferências globais.</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="avancado">Avançado</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* TAP: PERFIL */}
          <TabsContent value="perfil">
            <PerfilEmpresaTab config={configQ.data || {}} onSave={(d) => saveConfigM.mutate(d)} isLoading={saveConfigM.isPending} />
          </TabsContent>

          {/* TAP: USUARIOS & RBAC */}
          <TabsContent value="usuarios">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsuariosList usuarios={usuariosQ.data || []} cargos={cargosQ.data || []} onRefresh={() => usuariosQ.refetch()} />
              <CargosList cargos={cargosQ.data || []} onRefresh={() => cargosQ.refetch()} />
            </div>
          </TabsContent>

          {/* TAP: MODULOS */}
          <TabsContent value="modulos">
            <ModulosManager modulos={modulosQ.data || []} onToggle={(m, a) => toggleModuloM.mutate({ modulo: m, ativo: a })} />
          </TabsContent>

          {/* TAP: AVANCADO (Backup, etc) */}
          <TabsContent value="avancado">
            <Card>
              <CardHeader>
                <CardTitle>Manutenção e Segurança</CardTitle>
                <CardDescription>Ferramentas de backup e exportação de dados.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                  <div>
                    <h4 className="font-semibold">Backup Manual</h4>
                    <p className="text-sm text-muted-foreground">Gera um snapshot imediato do banco de dados.</p>
                  </div>
                  <Button onClick={() => backupM.mutate()} disabled={backupM.isPending}>
                    {backupM.isPending ? "Processando..." : "Gerar Backup Agora"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed">
                  <div>
                    <h4 className="font-semibold">Exportar para Excel</h4>
                    <p className="text-sm text-muted-foreground">Baixar todos os registros (Vendas, Locações, Clientes).</p>
                  </div>
                  <Badge variant="secondary">Em breve</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// --- Sub-Components ---

function PerfilEmpresaTab({ config, onSave, isLoading }: any) {
  const [local, setLocal] = useState({
    empresa_nome: config.empresa_nome || "",
    empresa_email: config.empresa_email || "",
    empresa_telefone: config.empresa_telefone || "",
    empresa_cnpj: config.empresa_cnpj || "",
    empresa_endereco: config.empresa_endereco || "",
    orcamento_validade_dias: config.orcamento_validade_dias || "7",
  });

  useEffect(() => {
    setLocal({
      empresa_nome: config.empresa_nome || "",
      empresa_email: config.empresa_email || "",
      empresa_telefone: config.empresa_telefone || "",
      empresa_cnpj: config.empresa_cnpj || "",
      empresa_endereco: config.empresa_endereco || "",
      orcamento_validade_dias: config.orcamento_validade_dias || "7",
    });
  }, [config]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
        <CardDescription>Estes dados serão usados em orçamentos, contratos e notas.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm font-medium">Logomarca (Exportação/PDFs)</label>
          <div className="flex items-center gap-4">
            {config.empresa_logo ? (
              <img src={`http://localhost:5000${config.empresa_logo}`} alt="Logo" className="h-16 w-16 object-contain border rounded p-1 bg-white" />
            ) : null}
            <Input type="file" accept="image/*" onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const toastId = showToast.loading("Enviando logo...");
                api.uploadLogo(e.target.files[0]).then(() => {
                  showToast.success("Logo atualizada!", { id: toastId });
                  window.location.reload();
                }).catch(() => showToast.error("Erro ao enviar logo", { id: toastId }));
              }
            }} />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nome Fantasia</label>
          <Input name="empresa_nome" value={local.empresa_nome} onChange={handleChange} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">CNPJ / CPF</label>
          <Input name="empresa_cnpj" value={local.empresa_cnpj} onChange={handleChange} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Email de Contato</label>
          <Input name="empresa_email" value={local.empresa_email} onChange={handleChange} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Telefone / WhatsApp</label>
          <Input name="empresa_telefone" value={local.empresa_telefone} onChange={handleChange} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm font-medium">Endereço Completo</label>
          <Input name="empresa_endereco" value={local.empresa_endereco} onChange={handleChange} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Validade Padrão Orçamentos (dias)</label>
          <Input type="number" name="orcamento_validade_dias" value={local.orcamento_validade_dias} onChange={handleChange} />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={() => onSave(local)} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function UsuariosList({ usuarios, cargos, onRefresh }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ nome: '', email: '', role: 'operador', senha: '', cargo_id: '' });
  const qc = useQueryClient();

  const saveM = useMutation({
    mutationFn: (data: any) => api.salvarUsuario(data),
    onSuccess: () => {
      showToast.success("Usuário criado!");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["usuarios"] });
    }
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => api.excluirUsuario(id),
    onSuccess: () => {
      showToast.success("Usuário removido.");
      qc.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (e: any) => showToast.error(e.details?.erro || "Erro ao remover usuário")
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Gerencie quem acessa o sistema.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>Novo Usuário</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="font-medium">{u.nome}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {u.cargo_id && cargos.find((c: any) => c.id === u.cargo_id) 
                      ? cargos.find((c: any) => c.id === u.cargo_id).nome 
                      : u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if(confirm("Remover usuario?")) deleteM.mutate(u.id) }}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Convidar Usuário</DialogTitle></DialogHeader>
          <div className="space-y-4">
             <Input placeholder="Nome completo" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
             <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
             <div className="grid gap-2">
               <label className="text-xs font-medium uppercase text-muted-foreground">Nivel do Sistema (Role)</label>
               <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                       value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                 <option value="operador">Operador Base</option>
                 <option value="admin">Administrador (Total)</option>
               </select>
             </div>
             <div className="grid gap-2">
               <label className="text-xs font-medium uppercase text-muted-foreground">Cargo Customizado (Permissões granulares)</label>
               <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                       value={form.cargo_id || ""} onChange={e => setForm({...form, cargo_id: e.target.value ? Number(e.target.value) : ""})}>
                 <option value="">Nenhum (Usa Nivel do Sistema)</option>
                 {cargos.map((c: any) => (
                   <option key={c.id} value={c.id}>{c.nome}</option>
                 ))}
               </select>
             </div>
             <Input placeholder="Senha (padrão 123456)" type="password" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
          </div>
          <DialogFooter>
             <Button onClick={() => saveM.mutate(form)}>Criar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function CargosList({ cargos, onRefresh }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ id: null, nome: '', descricao: '', permissoes: [] });
  const qc = useQueryClient();

  const todasPermissoes = [
    { id: "dashboard_view", label: "Ver Dashboard" },
    { id: "vendas_view", label: "Acessar Caixa/PDV" },
    { id: "vendas_add", label: "Registrar Vendas" },
    { id: "locacoes_view", label: "Acessar Locações" },
    { id: "encomendas_view", label: "Acessar Encomendas" },
    { id: "despesas_view", label: "Acessar Despesas" },
    { id: "clientes_view", label: "Acessar Clientes" },
    { id: "config_view", label: "Acessar Configurações" }
  ];

  const saveM = useMutation({
    mutationFn: (data: any) => api.salvarCargo(data, data.id || undefined),
    onSuccess: () => {
      showToast.success("Cargo salvo!");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["cargos"] });
      onRefresh();
    }
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => api.excluirCargo(id),
    onSuccess: () => {
      showToast.success("Cargo removido.");
      qc.invalidateQueries({ queryKey: ["cargos"] });
    }
  });

  const togglePermissao = (p: string) => {
    setForm((old: any) => {
      const perms = old.permissoes.includes(p) 
        ? old.permissoes.filter((x: string) => x !== p)
        : [...old.permissoes, p];
      return { ...old, permissoes: perms };
    });
  };

  const openForm = (c: any = null) => {
    if (c) setForm({ id: c.id, nome: c.nome, descricao: c.descricao, permissoes: c.permissoes || [] });
    else setForm({ id: null, nome: '', descricao: '', permissoes: [] });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Cargos & Hierarquia</CardTitle>
          <CardDescription>Crie matrizes de acessos personalizados.</CardDescription>
        </div>
        <Button size="sm" onClick={() => openForm(null)}>Criar Cargo</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cargos.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum cargo customizado.</p>}
          {cargos.map((c: any) => (
            <div key={c.id} className="flex flex-col p-3 border rounded-lg gap-2 bg-secondary/5">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-sm">{c.nome}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openForm(c)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { if(confirm("Remover este cargo? Os usuarios dele perderão os acessos.")) deleteM.mutate(c.id); }}>Excluir</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{c.descricao || "Sem descrição"}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(c.permissoes || []).map((p: string) => (
                   <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{form.id ? "Editar Cargo" : "Criar Cargo"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
               <label className="text-sm font-medium">Nome do Cargo</label>
               <Input placeholder="Ex: Vendedor Sênior" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            </div>
            <div className="grid gap-2">
               <label className="text-sm font-medium">Descrição (Opcional)</label>
               <Input placeholder="Sobre as funções..." value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
            </div>
            
            <div className="mt-2">
               <h4 className="font-medium text-sm mb-3">Permissões de Acesso</h4>
               <div className="grid grid-cols-2 gap-3">
                 {todasPermissoes.map(p => (
                   <label key={p.id} className={"flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors " + (form.permissoes.includes(p.id) ? "bg-primary/10 border-primary/50" : "hover:bg-secondary/20")}>
                     <Switch checked={form.permissoes.includes(p.id)} onCheckedChange={() => togglePermissao(p.id)} />
                     <span className="text-sm">{p.label}</span>
                   </label>
                 ))}
               </div>
            </div>
          </div>
          <DialogFooter>
             <Button onClick={() => saveM.mutate(form)} disabled={saveM.isPending}>
               {saveM.isPending ? "Salvando..." : "Salvar Cargo"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ModulosManager({ modulos, onToggle }: any) {
  // Lista de módulos base para caso o backend retorne vazio (onboarding)
  const defaultModulos = [
    { modulo: "vendas", label: "Vendas & PDV", desc: "Caixa, orçamentos e pedidos." },
    { modulo: "locacoes", label: "Locações", desc: "Gestão de inventário para aluguel e kits." },
    { modulo: "encomendas", label: "Encomendas", desc: "Controle de produção e prazos personalizados." },
    { modulo: "produtos", label: "Estoque", desc: "Catálogo de itens e controle de quantidades." },
    { modulo: "despesas", label: "Financeiro/Despesas", desc: "Controle de custos e contas a pagar." },
    { modulo: "agenda", label: "Agenda Global", desc: "Calendário de compromissos e entregas." },
  ];

  const getAtivo = (slug: string) => {
    const found = modulos.find((m: any) => m.modulo === slug);
    return found ? found.ativo === 1 : true; // Por padrão ativo
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Módulos do Sistema</CardTitle>
        <CardDescription>Ative ou desative funcionalidades conforme sua necessidade.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {defaultModulos.map((m) => (
          <div key={m.modulo} className="flex flex-col justify-between p-4 border rounded-xl gap-4 hover:bg-secondary/10 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold">{m.label}</h4>
                <Switch 
                  checked={getAtivo(m.modulo)} 
                  onCheckedChange={(checked) => onToggle(m.modulo, checked)} 
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
