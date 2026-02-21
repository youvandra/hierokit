import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { Client } from "../Client.js";
import type { HieroConfig } from "../types.js";

type ClientStatus = "idle" | "ready";

type ClientHealth = "unknown" | "ready";

interface HieroClientContextValue {
  client: Client;
  config: HieroConfig;
  status: ClientStatus;
}

const HieroClientContext = createContext<HieroClientContextValue | null>(null);

interface HieroProviderProps {
  config: HieroConfig;
  children: ReactNode;
}

export function HieroProvider(props: HieroProviderProps) {
  const value = useMemo<HieroClientContextValue>(() => {
    const client = new Client(props.config);
    return {
      client,
      config: props.config,
      status: "ready",
    };
  }, [props.config]);

  return (
    <HieroClientContext.Provider value={value}>
      {props.children}
    </HieroClientContext.Provider>
  );
}

export function useHieroContext() {
  const ctx = useContext(HieroClientContext);
  if (!ctx) {
    throw new Error("HieroProvider is required");
  }
  return ctx;
}

export function useHieroClient() {
  return useHieroContext().client;
}

export function useHieroConfig() {
  return useHieroContext().config;
}

export function useNetwork() {
  return useHieroConfig().network;
}

export function useLedgerId() {
  const client = useHieroClient();
  return client.raw.ledgerId;
}

export function useNodeList() {
  const client = useHieroClient();
  const entries = Object.entries(client.raw.network);
  return entries.map(([nodeId, address]) => ({ nodeId, address }));
}

export function useClientStatus(): ClientStatus {
  return useHieroContext().status;
}

export function useClientHealth(): ClientHealth {
  const client = useHieroClient().raw as any;
  if (client._isShutdown) {
    return "unknown";
  }
  return "ready";
}

export function useMirrorNodeUrl() {
  const client = useHieroClient();
  try {
    return client.raw.mirrorRestApiBaseUrl;
  } catch {
    return null;
  }
}

export function useMaxTransactionFee() {
  const client = useHieroClient();
  const fee =
    client.raw.defaultMaxTransactionFee ?? client.raw.maxTransactionFee;
  return fee ?? null;
}

export function useDefaultOperator() {
  const client = useHieroClient();
  return client.raw.getOperator();
}

