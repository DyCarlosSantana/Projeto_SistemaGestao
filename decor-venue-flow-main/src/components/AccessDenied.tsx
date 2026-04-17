import { AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function AccessDenied({ fallbackText = "Painel" }: { fallbackText?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warning/10 ring-8 ring-warning/5 mb-6">
        <ShieldAlert className="h-12 w-12 text-warning" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Acesso Negado</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        No momento você não tem a permissão necessária para acessar esta funcionalidade.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-card p-4 shadow-sm w-full max-w-sm">
        <p className="text-sm font-medium mb-3">Entre com um login que possua permissões adequadas ou contate um administrador.</p>
        <Button className="w-full" onClick={() => navigate("/")}>
          Voltar para Home
        </Button>
      </div>
    </div>
  );
}
