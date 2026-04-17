import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.erro || "Falha no login");
      }

      login(data.user, data.token);
      toast.success(`Bem-vindo, ${data.user.nome}!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Funcionalidade em desenvolvimento. Contate o administrador para redefinir sua senha.");
  };

  return (
    <div className="login-page flex min-h-screen">
      {/* Left panel — decorative */}
      <div className="login-left-panel relative hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between p-10 overflow-hidden">
        {/* Mesh gradient background */}
        <div className="login-mesh-bg" />

        {/* Glassmorphism overlay */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl font-display text-lg font-bold text-white shadow-lg">
                D
              </div>
              <span className="font-display text-xl font-bold text-white/90">Dycore</span>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="font-display text-4xl font-bold leading-tight text-white">
              Gerencie seu negócio com <span className="text-cyan-200">elegância</span>
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Controle vendas, locações, encomendas e finanças em uma única plataforma intuitiva e poderosa.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>© {new Date().getFullYear()} Dycore SaaS</span>
            <span>·</span>
            <span>Todos os direitos reservados</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 bg-background">
        <div className="login-form-container w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand font-display text-sm font-bold text-primary-foreground shadow-md">
              D
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesse sua conta para continuar gerenciando seu negócio.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-12 pl-10 text-sm rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="senha"
                  type={showPass ? "text" : "password"}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-10 pr-11 text-sm rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-sm font-semibold rounded-xl bg-gradient-brand hover:opacity-90 transition-opacity shadow-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando…
                </>
              ) : (
                "Acessar Sistema"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Acesso restrito a usuários autorizados
          </div>
        </div>
      </div>
    </div>
  );
}
