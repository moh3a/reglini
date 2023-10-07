interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<unknown>): void;
}

interface PushSubscriptionChangeEvent extends ExtendableEvent {
  readonly newSubscription?: PushSubscription;
  readonly oldSubscription?: PushSubscription;
}

// Client API

declare class Client {
  frameType: ClientFrameType;
  id: string;
  url: string;
  focused: boolean;
  focus(): void;
  postMessage(message: unknown): void;
}

interface Clients {
  claim(): Promise<unknown>;
  get(id: string): Promise<Client>;
  matchAll(options?: ClientMatchOptions): Promise<Array<Client>>;
  openWindow(url: string): Promise<void>;
}

interface ClientMatchOptions {
  includeUncontrolled?: boolean;
  type?: ClientMatchTypes;
}

interface WindowClient {
  focused: boolean;
  visibilityState: WindowClientState;
  focus(): Promise<WindowClient>;
  navigate(url: string): Promise<WindowClient>;
}

type ClientFrameType = "auxiliary" | "top-level" | "nested" | "none";
type ClientMatchTypes = "window" | "worker" | "sharedworker" | "all";
type WindowClientState = "hidden" | "visible" | "prerender" | "unloaded";

// Fetch API

interface FetchEvent extends ExtendableEvent {
  clientId: string | null;
  request: Request;
  respondWith(response: Promise<Response> | Response): Promise<Response>;
}

interface InstallEvent extends ExtendableEvent {
  activeWorker: ServiceWorker;
}

type ActivateEvent = ExtendableEvent;

// Notification API

interface NotificationEvent extends ExtendableEvent {
  action: string;
  notification: Notification;
}

// Push API

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface PushMessageData {
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  json(): unknown;
  text(): string;
}

// Sync API

interface SyncEvent extends ExtendableEvent {
  lastChance: boolean;
  tag: string;
}

interface CustomObject extends Record<string, unknown> {
  url: string;
}

interface ExtendableMessageEvent extends ExtendableEvent {
  data: { action: string };
  source: Client | CustomObject;
}

// Before Install Prompt API

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<Record<string, unknown>>;
  prompt: () => void;
}

// ServiceWorkerGlobalScope

interface ServiceWorkerGlobalScope {
  __WB_DISABLE_DEV_LOGS: boolean;
  caches: CacheStorage;
  clients: Clients;
  registration: ServiceWorkerRegistration;

  addEventListener(
    event: "activate",
    fn: (event?: ExtendableEvent) => unknown,
  ): void;
  addEventListener(
    event: "appinstalled",
    fn: (event?: unknown) => unknown,
  ): void;
  addEventListener(
    event: "message",
    fn: (event?: ExtendableMessageEvent) => unknown,
  ): void;
  addEventListener(event: "fetch", fn: (event?: FetchEvent) => unknown): void;
  addEventListener(
    event: "install",
    fn: (event?: ExtendableEvent) => unknown,
  ): void;
  addEventListener(event: "push", fn: (event?: PushEvent) => unknown): void;
  addEventListener(
    event: "notificationclick",
    fn: (event?: NotificationEvent) => unknown,
  ): void;
  addEventListener(event: "sync", fn: (event?: SyncEvent) => unknown): void;

  fetch(request: Request | string): Promise<Response>;
  skipWaiting(): Promise<void>;
}
