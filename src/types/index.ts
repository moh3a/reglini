export type Result<T, E extends Error = Error> =
  | { success: true; result: T }
  | { success: false; error: E };

export type MessageType = "error" | "warning" | "success";

export interface SetMessageParams {
  type: MessageType;
  text: string;
  duration: number;
}

export type SetMessageType = (
  params: Omit<SetMessageParams, "duration">
) => void;
export type SetTimedMessageType = (params: SetMessageParams) => void;

export interface IMessage {
  type?: MessageType;
  text?: string;
}

export interface MessageStore extends IMessage {
  setTimedMessage: SetTimedMessageType;
  setMessage: SetMessageType;
  resetMessage: () => void;
}

export interface ISession {
  expires: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    type?: "oauth" | "credentials" | null;
    provider?: "google" | "facebook" | null;
    access_token?: string | null;
  };
}

export interface EmailOptions {
  from?: string;
  to?: string;
  subject: string;
  text: string;
}

export interface FinanceStore {
  commission?: number;
  euro?: number;
  usd?: number;
  set_commission: (data: number) => void;
  set_currency: (currency: "EUR" | "USD", data: number) => void;
}

export interface InstallPWAStore {
  can_install: boolean;
  set_can_install: (data: boolean) => void;
  prompt: any;
  set_prompt: (event: any) => void;
}

export interface Price {
  min: number;
  max: number;
}

export interface ProductProperty {
  name: string;
  value: string;
}

import type { ZAE_ProductVariation } from "~/types/zapiex";
export interface SelectedVariation extends ZAE_ProductVariation {
  quantity?: number;
}
