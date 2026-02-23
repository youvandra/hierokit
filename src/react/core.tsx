import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Client } from "../Client.js";
import type { HieroConfig } from "../types.js";
import { AddressBookQuery, type NodeAddressBook } from "@hiero-ledger/sdk";

function assertBrowserSafeUsage() {
  const isNodeLike =
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!(process as any).versions?.node;

  if (!isNodeLike && typeof window !== "undefined") {
    throw new Error(
      "HieroProvider cannot be used in a browser-only bundle with the Node-based Hiero SDK. Run HieroKit on the server and pass data to the client instead."
    );
  }
}

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
    assertBrowserSafeUsage();
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

export function useDefaultOperator(): unknown {
  const client = useHieroClient();
  return client.raw.getOperator();
}

type QueryStatus = "idle" | "loading" | "success" | "error";

interface QueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: unknown | null;
  refresh: () => void;
}

export function useNetworkAddressBook(): QueryResult<NodeAddressBook> {
  const client = useHieroClient();
  const [data, setData] = useState<NodeAddressBook | null>(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new AddressBookQuery();

    query
      .execute(client.raw as any)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [client, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}
