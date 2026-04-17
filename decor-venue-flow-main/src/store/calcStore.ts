import { create } from "zustand";

export type CalcItem = {
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  tipo: "produto" | "servico" | "diverso" | "locacao_item" | "locacao_kit";
};

type CalcStore = {
  itemsToAdd: CalcItem[];
  addToCart: (item: CalcItem) => void;
  clearCart: () => void;
};

export const useCalcStore = create<CalcStore>((set) => ({
  itemsToAdd: [],
  addToCart: (item) =>
    set((state) => ({
      itemsToAdd: [...state.itemsToAdd, item],
    })),
  clearCart: () => set({ itemsToAdd: [] }),
}));
