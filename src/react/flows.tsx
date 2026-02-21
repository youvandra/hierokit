import { useCallback, useId, useMemo, useState } from "react";
import type { TransactionReceipt } from "@hashgraph/sdk";
import { useHieroClient } from "./core.js";
import type { Client } from "../Client.js";

export type FlowStatus =
  | "idle"
  | "preparing"
  | "submitting"
  | "success"
  | "error"
  | "cancelled"
  | "timeout";

export interface FlowHandle<TReceipt = TransactionReceipt> {
  id: string;
  status: FlowStatus;
  receipt: TReceipt | null;
  error: unknown | null;
  start: () => Promise<void>;
  retry: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
  timeoutMs: number | null;
}

export interface TransactionFlowOptions {
  autoStart?: boolean;
  timeoutMs?: number;
}

export type TransactionFlow<TReceipt = TransactionReceipt> = (
  client: Client
) => Promise<TReceipt>;

export function useTransactionFlow<TReceipt = TransactionReceipt>(
  flow: TransactionFlow<TReceipt> | null,
  options: TransactionFlowOptions = {}
): FlowHandle<TReceipt> {
  const client = useHieroClient();
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [receipt, setReceipt] = useState<TReceipt | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [timeoutMs] = useState<number | null>(
    options.timeoutMs != null ? options.timeoutMs : null
  );
  const [cancelled, setCancelled] = useState(false);
  const id = useId();

  const start = useCallback(async () => {
    if (!flow) {
      return;
    }

    setCancelled(false);
    setStatus("preparing");
    setError(null);
    setReceipt(null);

    let timedOut = false;
    let timer: NodeJS.Timeout | null = null;

    if (timeoutMs && timeoutMs > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        setStatus("timeout");
      }, timeoutMs);
    }

    try {
      setStatus("submitting");
      const result = await flow(client);

      if (!timedOut && !cancelled) {
        setReceipt(result);
        setStatus("success");
      }
    } catch (err) {
      if (!timedOut && !cancelled) {
        setError(err);
        setStatus("error");
      }
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }, [client, flow, timeoutMs, cancelled]);

  const retry = useCallback(async () => {
    await start();
  }, [start]);

  const cancel = useCallback(() => {
    setCancelled(true);
    setStatus((current) => {
      if (current === "success" || current === "error") {
        return current;
      }
      return "cancelled";
    });
  }, []);

  const reset = useCallback(() => {
    setCancelled(false);
    setStatus("idle");
    setReceipt(null);
    setError(null);
  }, []);

  useMemo(() => {
    if (options.autoStart) {
      start();
    }
  }, [options.autoStart, start]);

  return useMemo(
    () => ({
      id,
      status,
      receipt,
      error,
      start,
      retry,
      cancel,
      reset,
      timeoutMs,
    }),
    [id, status, receipt, error, start, retry, cancel, reset, timeoutMs]
  );
}

export function useCreateFlow<TReceipt = TransactionReceipt>(
  intent: TransactionFlow<TReceipt>,
  options: TransactionFlowOptions = {}
) {
  return useTransactionFlow(intent, { ...options, autoStart: false });
}

export function useFlowStatus<TReceipt>(handle: FlowHandle<TReceipt>) {
  return handle.status;
}

export function useFlowReceipt<TReceipt>(handle: FlowHandle<TReceipt>) {
  return handle.receipt;
}

export function useFlowError<TReceipt>(handle: FlowHandle<TReceipt>) {
  return handle.error;
}

export function useRetryFlow<TReceipt>(handle: FlowHandle<TReceipt>) {
  return handle.retry;
}

export function useCancelFlow<TReceipt>(handle: FlowHandle<TReceipt>) {
  return handle.cancel;
}

export function useFlowTimeout<TReceipt>(handle: FlowHandle<TReceipt>) {
  return handle.timeoutMs;
}

