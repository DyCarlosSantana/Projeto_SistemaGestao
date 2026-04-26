import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast as showToast } from "@/components/ui/sonner";

const PIX_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
  { value: "aleatoria", label: "Chave Aleatória" },
];

export default function EmpresaTab({ config, onSave, isLoading }: any) {
  const [local, setLocal] = useState({
    empresa_nome: "", empresa_email: "", empresa_telefone: "", empresa_cnpj: "",
    empresa_endereco: "", empresa_whatsapp: "", empresa_instagram: "", empresa_site: "",
    pix_tipo: "cpf", pix_chave: "", moeda: "BRL",
    horario_abertura: "08:00", horario_fechamento: "18:00",
    orcamento_validade_dias: "7",
  });

  useEffect(() => {
    setLocal((prev) => ({
      ...prev,
      empresa_nome: config.empresa_nome || "",
      empresa_email: config.empresa_email || "",
      empresa_telefone: config.empresa_telefone || "",
      empresa_cnpj: config.empresa_cnpj || "",
      empresa_endereco: config.empresa_endereco || "",
      empresa_whatsapp: config.empresa_whatsapp || "",
      empresa_instagram: config.empresa_instagram || "",
      empresa_site: config.empresa_site || "",
      pix_tipo: config.pix_tipo || "cpf",
      pix_chave: config.pix_chave || "",
      moeda: config.moeda || "BRL",
      horario_abertura: config.horario_abertura || "08:00",
      horario_fechamento: config.horario_fechamento || "18:00",
      orcamento_validade_dias: config.orcamento_validade_dias || "7",
    }));
  }, [config]);

  const h = (e: any) => { const { name, value } = e.target; setLocal((p) => ({ ...p, [name]: value })); };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
        <CardDescription>Dados usados em orçamentos, contratos, PDFs e notas fiscais.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {/* Logo */}
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm font-medium">Logomarca</label>
          <div className="flex items-center gap-4">
            {config.empresa_logo && (
              <img src={config.empresa_logo} alt="Logo" className="h-16 w-16 object-contain border rounded p-1 bg-white" />
            )}
            <Input type="file" accept="image/*" onChange={async (e) => {
              if (e.target.files?.[0]) {
                const tid = showToast.loading("Enviando logo...");
                api.uploadLogo(e.target.files[0])
                  .then(() => { showToast.success("Logo atualizada!", { id: tid }); window.location.reload(); })
                  .catch(() => showToast.error("Erro ao enviar logo", { id: tid }));
              }
            }} />
          </div>
        </div>

        <div className="grid gap-2"><label className="text-sm font-medium">Nome Fantasia</label><Input name="empresa_nome" value={local.empresa_nome} onChange={h} /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">CNPJ / CPF</label><Input name="empresa_cnpj" value={local.empresa_cnpj} onChange={h} /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">Email de Contato</label><Input name="empresa_email" type="email" value={local.empresa_email} onChange={h} /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">Telefone</label><Input name="empresa_telefone" value={local.empresa_telefone} onChange={h} /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">WhatsApp</label><Input name="empresa_whatsapp" value={local.empresa_whatsapp} onChange={h} placeholder="(11) 99999-9999" /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">Instagram</label><Input name="empresa_instagram" value={local.empresa_instagram} onChange={h} placeholder="@seuinstagram" /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">Site</label><Input name="empresa_site" value={local.empresa_site} onChange={h} placeholder="https://" /></div>
        <div className="grid gap-2 sm:col-span-2"><label className="text-sm font-medium">Endereço Completo</label><Input name="empresa_endereco" value={local.empresa_endereco} onChange={h} /></div>

        {/* PIX */}
        <div className="sm:col-span-2 border rounded-lg p-4 bg-secondary/5">
          <h4 className="font-semibold text-sm mb-3">Chave PIX (para PDFs e comprovantes)</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">Tipo</label>
              <select name="pix_tipo" value={local.pix_tipo} onChange={h} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {PIX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">Chave</label>
              <Input name="pix_chave" value={local.pix_chave} onChange={h} placeholder="Insira sua chave PIX" />
            </div>
          </div>
        </div>

        {/* Horário */}
        <div className="grid gap-2"><label className="text-sm font-medium">Abertura</label><Input type="time" name="horario_abertura" value={local.horario_abertura} onChange={h} /></div>
        <div className="grid gap-2"><label className="text-sm font-medium">Fechamento</label><Input type="time" name="horario_fechamento" value={local.horario_fechamento} onChange={h} /></div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={() => onSave(local)} disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar Alterações"}</Button>
      </CardFooter>
    </Card>
  );
}
