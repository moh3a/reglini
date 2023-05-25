import create from "zustand";
import { FinanceStore, InstallPWAStore } from "@reglini-types/index";

export const useFinance = create<FinanceStore>((set, get) => ({
  usd: undefined,
  euro: undefined,
  commission: undefined,
  set_commission: (data) => set({ commission: data }),
  set_currency: (currency, data) =>
    currency === "EUR" ? set({ euro: data }) : set({ usd: data }),
}));

export const useInstallPWA = create<InstallPWAStore>((set, get) => ({
  can_install: false,
  set_can_install: (data) => set({ can_install: data }),
  prompt: undefined,
  set_prompt: (event) => set({ prompt: event }),
}));
