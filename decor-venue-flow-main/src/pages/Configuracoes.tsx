import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, UserPlus, Trash, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConfiguracoesPage() {
  const qc = useQueryClient();

  // --- Perfil da Empresa ---
  const [formConfig, setFormConfig] = useState<any>({
    empresa_nome: "",
    empresa_cnpj: "",
    empresa_telefone: "",
    empresa_whatsapp: "",
    empresa_email: "",
    empresa_instagram: "",
    empresa_endereco: "",
    empresa_site: "",
    logo_path: "",
  });

  const configQ = useQuery({ queryKey: ["configuracoes"], queryFn: () => api.configuracoes() });

  useEffect(() => {
    if (configQ.data) setFormConfig((prev: any) => ({ ...prev, ...configQ.data }));
  }, [configQ.data]);

  const salvarConfigM = useMutation({
    mutationFn: () => api.salvarConfiguracoes(formConfig),
    onSuccess: async () => {
      toast.success("Configurações salvas com sucesso!");
      await qc.invalidateQueries({ queryKey: ["configuracoes"] });
    },
    onError: () => toast.error("Erro ao salvar configurações"),
  });

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  // --- Usuários e Segurança ---
  const usersQ = useQuery({ queryKey: ["usuarios"], queryFn: () => api.usuarios() });

  const [modalUserOpen, setModalUserOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [formUser, setFormUser] = useState({ nome: "", email: "", role: "operador", senha: "" });

  const abrirNovoUsuario = () => {
    setEditUserId(null);
    setFormUser({ nome: "", email: "", role: "operador", senha: "" });
    setModalUserOpen(true);
  };

  const abrirEditarUsuario = (u: any) => {
    setEditUserId(u.id);
    setFormUser({ nome: u.nome, email: u.email, role: u.role, senha: "" });
    setModalUserOpen(true);
  };

  const salvarUserM = useMutation({
    mutationFn: async () => {
      if (!formUser.nome || !formUser.email) throw new Error("Preencha nome e e-mail");
      if (!editUserId && !formUser.senha) throw new Error("A senha é obrigatória para novos usuários");
      return api.salvarUsuario(formUser, editUserId ?? undefined);
    },
    onSuccess: async () => {
      toast.success(editUserId ? "Usuário salvo!" : "Novo usuário criado!");
      setModalUserOpen(false);
      await qc.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao salvar usuário"),
  });

  const excluirUserM = useMutation({
    mutationFn: (id: number) => api.excluirUsuario(id),
    onSuccess: async () => {
      toast.success("Usuário excluído ou desativado!");
      await qc.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao excluir usuário"),
  });

  return (
    <div className="max-w-[800px] space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Configurações Gerais</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gerencie o Perfil da Empresa e Operadores de Sistema.
        </p>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="perfil">Perfil da Empresa</TabsTrigger>
          <TabsTrigger value="seguranca">Acessos & Operadores</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          <div className="rounded-2xl border border-border bg-card shadow-subtle flex flex-col">
            {configQ.isLoading ? (
              <div className="p-10 text-center text-muted-foreground">Carregando...</div>
            ) : (
              <div className="p-6 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">Nome da Empresa</label>
                  <Input name="empresa_nome" value={formConfig.empresa_nome} onChange={handleConfigChange} placeholder="Ex: DripArt Comunicação Visual" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">CNPJ / CPF</label>
                  <Input name="empresa_cnpj" value={formConfig.empresa_cnpj} onChange={handleConfigChange} placeholder="Ex: 00.000.000/0001-00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">E-mail</label>
                  <Input type="email" name="empresa_email" value={formConfig.empresa_email} onChange={handleConfigChange} placeholder="contato@empresa.com.br" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">Endereço Completo</label>
                  <Input name="empresa_endereco" value={formConfig.empresa_endereco || ""} onChange={handleConfigChange} placeholder="Rua, Número, Bairro, Cidade - UF" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Telefone Principal</label>
                  <Input name="empresa_telefone" value={formConfig.empresa_telefone || ""} onChange={handleConfigChange} placeholder="(00) 0000-0000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">WhatsApp</label>
                  <Input name="empresa_whatsapp" value={formConfig.empresa_whatsapp || ""} onChange={handleConfigChange} placeholder="(00) 90000-0000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Instagram (sem o @)</label>
                  <Input name="empresa_instagram" value={formConfig.empresa_instagram || ""} onChange={handleConfigChange} placeholder="Nome de usuário no IG" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Site</label>
                  <Input name="empresa_site" value={formConfig.empresa_site || ""} onChange={handleConfigChange} placeholder="https://www.seusite.com.br" />
                </div>
                <div className="sm:col-span-2 border-t border-border pt-4 mt-2">
                  <label className="text-sm font-medium text-foreground mb-1 block">URL da Logo (Para PDFs)</label>
                  <div className="flex items-center gap-4 mt-2">
                    {formConfig.logo_path ? (
                      <img src={formConfig.logo_path} alt="Logo Preview" className="h-16 w-16 rounded-md object-contain border border-border bg-white" />
                    ) : (
                      <div className="h-16 w-16 rounded-md border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground bg-muted/50">Sem Logo</div>
                    )}
                    <Input name="logo_path" value={formConfig.logo_path || ""} onChange={handleConfigChange} placeholder="https://link-para-sua-logo.png" className="flex-1" />
                  </div>
                </div>
              </div>
            )}
            <div className="border-t border-border bg-muted/20 px-6 py-4 rounded-b-2xl flex justify-end">
              <Button onClick={() => salvarConfigM.mutate()} disabled={salvarConfigM.isPending || configQ.isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {salvarConfigM.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seguranca" className="mt-6">
          <div className="rounded-2xl border border-border bg-card shadow-subtle flex flex-col p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Usuários Cadastrados</h3>
                <p className="text-xs text-muted-foreground">Adicione operadores ao sistema.</p>
              </div>
              <Button onClick={abrirNovoUsuario} size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email / Login</TableHead>
                  <TableHead>Nível de Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQ.isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : (
                  (usersQ.data || []).map((u: any) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium text-foreground">{u.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 flex items-center justify-center rounded-full text-xs font-medium w-fit ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                          {u.role === 'admin' ? 'Administrador' : 'Operador'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2 justify-end">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => abrirEditarUsuario(u)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if(confirm("Excluir este acesso?")) excluirUserM.mutate(u.id); }} disabled={excluirUserM.isPending}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={modalUserOpen} onOpenChange={setModalUserOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editUserId ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {editUserId ? "Altere nome, acesso ou redefina a senha deste usuário." : "Preencha as informações para liberar acesso a um operador."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Nome Completo</label>
              <Input
                value={formUser.nome}
                onChange={(e) => setFormUser(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">E-mail (Login)</label>
              <Input
                type="email"
                value={formUser.email}
                onChange={(e) => setFormUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="joao@dripart.com.br"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Tipo de Acesso</label>
              <Select value={formUser.role} onValueChange={(v) => setFormUser(prev => ({ ...prev, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="operador">Operador (Restrito)</SelectItem>
                  <SelectItem value="admin">Administrador (Total)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                {editUserId ? "Nova Senha (deixe em branco para manter a atual)" : "Senha (obrigatória para novo registro)"}
              </label>
              <Input
                type="password"
                value={formUser.senha}
                onChange={(e) => setFormUser(prev => ({ ...prev, senha: e.target.value }))}
                placeholder="••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalUserOpen(false)} disabled={salvarUserM.isPending}>
              Cancelar
            </Button>
            <Button onClick={() => salvarUserM.mutate()} disabled={salvarUserM.isPending}>
              {salvarUserM.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
