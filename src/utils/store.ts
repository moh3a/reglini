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

interface InstallPWAStore {
  can_install: boolean;
  set_can_install: (data: boolean) => void;
  prompt: any;
  set_prompt: (event: any) => void;
}

export const useInstallPWA = create<InstallPWAStore>((set, get) => ({
  can_install: false,
  set_can_install: (data) => set({ can_install: data }),
  prompt: undefined,
  set_prompt: (event) => set({ prompt: event }),
}));

import { useEffect } from "react";
export const useEventListener = (
  target: EventTarget | undefined,
  event: string,
  listener: EventListenerOrEventListenerObject,
  trigger = true
): void => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = target || window;
      t.addEventListener(event, listener);
      trigger && t.dispatchEvent(new Event(event));
      return () => t.removeEventListener(event, listener);
    }
  });
};
