import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ClientesPage from "@/pages/Clientes";
import ProdutosPage from "@/pages/Produtos";
import PDVPage from "@/pages/PDV";
import LocacoesPage from "@/pages/Locacoes";
import OrcamentosPage from "@/pages/Orcamentos";
import DespesasPage from "@/pages/Despesas";
import CalculadoraPage from "@/pages/Calculadora";
import ItensLocacaoPage from "@/pages/ItensLocacao";
import FluxoDeCaixaPage from "@/pages/FluxoDeCaixa";
import FiadoPage from "@/pages/Fiado";
import AgendaPage from "@/pages/Agenda";
import EncomendasPage from "@/pages/Encomendas";
import ServicosPage from "@/pages/Servicos";
import RelatoriosPage from "@/pages/Relatorios";
import ConfiguracoesPage from "@/pages/Configuracoes";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFound from "./pages/NotFound.tsx";
import Login from "@/pages/Login";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pdv" element={<PDVPage />} />
              <Route path="/locacoes" element={<LocacoesPage />} />
              <Route path="/orcamentos" element={<OrcamentosPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/itens-locacao" element={<ItensLocacaoPage />} />
              <Route path="/calculadora" element={<CalculadoraPage />} />
              <Route path="/despesas" element={<DespesasPage />} />
              <Route path="/fluxo" element={<FluxoDeCaixaPage />} />
              <Route path="/fiado" element={<FiadoPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/encomendas" element={<EncomendasPage />} />
              <Route path="/servicos" element={<ServicosPage />} />
              <Route path="/configuracoes" element={<ProtectedRoute requireAdmin><ConfiguracoesPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
