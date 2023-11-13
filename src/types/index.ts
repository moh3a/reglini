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
  params: Omit<SetMessageParams, "duration">,
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

export interface FinanceStore {
  commission?: number;
  euro?: number;
  usd?: number;
  set_commission: (data: number) => void;
  set_currency: (currency: "EUR" | "USD", data: number) => void;
}

export interface EmailOptions {
  from?: string;
  to?: string;
  subject: string;
  text: string;
}

export interface InstallPWAStore {
  can_install: boolean;
  set_can_install: (data: boolean) => void;
  prompt?: BeforeInstallPromptEvent;
  set_prompt: (event?: BeforeInstallPromptEvent) => void;
}

import type { BuiltInProviderType } from "next-auth/providers";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
export interface AuthProps {
  csrfToken: string;
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

export interface Price {
  min: number;
  max: number;
}

export interface ProductProperty {
  name: string;
  value: string;
}

import type { RAE_ProductVariation } from "~/types/ae/rae";
export interface SelectedVariation extends RAE_ProductVariation {
  quantity?: number;
}

import type { Readable } from "stream";
export interface MulterFile {
  /** Name of the form field associated with this file. */
  fieldname: string;
  /** Name of the file on the uploader's computer. */
  originalname: string;
  /**
   * Value of the `Content-Transfer-Encoding` header for this file.
   * @deprecated since July 2015
   * @see RFC 7578, Section 4.7
   */
  encoding: string;
  /** Value of the `Content-Type` header for this file. */
  mimetype: string;
  /** Size of the file in bytes. */
  size: number;
  /**
   * A readable stream of this file. Only available to the `_handleFile`
   * callback for custom `StorageEngine`s.
   */
  stream: Readable;
  /** `DiskStorage` only: Directory to which this file has been uploaded. */
  destination: string;
  /** `DiskStorage` only: Name of this file within `destination`. */
  filename: string;
  /** `DiskStorage` only: Full path to the uploaded file. */
  path: string;
  /** `MemoryStorage` only: A Buffer containing the entire file. */
  buffer: Buffer;
}

export type ImageUploadApiResponse =
  | { success: true; message: string; url: string }
  | { success: false; message: string };
