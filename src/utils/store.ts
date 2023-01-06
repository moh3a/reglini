import create from "zustand";

interface FinanceStore {
  commission?: number;
  euro?: number;
  usd?: number;
  set_commission: (data: number) => void;
  set_currency: (currency: "EUR" | "USD", data: number) => void;
}

export const useFinance = create<FinanceStore>((set, get) => ({
  usd: undefined,
  euro: undefined,
  commission: undefined,
  set_commission: (data) => set({ commission: data }),
  set_currency: (currency, data) =>
    currency === "EUR" ? set({ euro: data }) : set({ usd: data }),
}));
