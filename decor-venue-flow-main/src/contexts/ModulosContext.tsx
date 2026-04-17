/**
 * ModulosContext.tsx — Contexto global de módulos e permissões do Dycore
 * =========================================================================
 * Carrega os módulos ativos do tenant e o role do usuário logado,
 * disponibilizando-os para toda a aplicação via hook useModulos().
 *
 * Uso:
 *   const { modulos, role, hasModulo, isAdmin } = useModulos();
 *   if (!hasModulo('locacoes')) return null;
 */

import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ModulosContextType {
  hasModulo: (modulo: string) => boolean;
  isAdmin: boolean;
  isGerente: boolean;
  loading: boolean;
}

const ModulosContext = createContext<ModulosContextType>({
  hasModulo: () => true,
  isAdmin: false,
  isGerente: false,
  loading: false,
});

export function ModulosProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  // Se o usuário estive com permissão '*', libera tudo
  const hasMap: any = {
    "dashboard": "dashboard_view",
    "pdv": "vendas_view",
    "orcamentos": "vendas_view",
    "calculadora": "vendas_view",
    "locacoes": "locacoes_view",
    "itens_locacao": "locacoes_view",
    "clientes": "clientes_view",
    "produtos": "vendas_view",
    "despesas": "despesas_view",
    "fluxo_caixa": "despesas_view",
    "fiado": "vendas_view",
    "agenda": "dashboard_view",
    "encomendas": "encomendas_view",
    "servicos": "vendas_view",
    "relatorios": "dashboard_view",
    "configuracoes": "config_view"
  };

  const hasModulo = (modulo: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    
    // Convert old 'modulo' concept into the new granular RBAC permissions
    const requiredPermission = hasMap[modulo];
    if (!requiredPermission) return true; // fallback open if not mapped

    // If custom permissions array exists, check it
    if (user.permissoes) {
      if (user.permissoes.includes('*')) return true;
      if (user.permissoes.includes(requiredPermission)) return true;
    }

    return false;
  };

  const isAdmin = user?.role === 'admin';
  const isGerente = user?.role === 'admin' || user?.role === 'gerente';

  return (
    <ModulosContext.Provider value={{
      hasModulo,
      isAdmin,
      isGerente,
      loading: false,
    }}>
      {children}
    </ModulosContext.Provider>
  );
}

export const useModulos = () => useContext(ModulosContext);
