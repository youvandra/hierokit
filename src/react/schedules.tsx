import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScheduleCreateTransaction,
  ScheduleSignTransaction,
  ScheduleDeleteTransaction,
  ScheduleInfoQuery,
  ScheduleId,
  AccountId,
  Transaction,
  type TransactionReceipt,
} from "@hashgraph/sdk";
import { useHieroClient } from "./core.js";
import {
  useTransactionFlow,
  type TransactionFlow,
  type TransactionFlowOptions,
  type FlowHandle,
  type UseFlowActionResult,
} from "./flows.js";

type QueryStatus = "idle" | "loading" | "success" | "error";

interface QueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: unknown | null;
  refresh: () => void;
}

export interface UseScheduleInfoArgs {
  scheduleId?: string | ScheduleId | null;
}

export interface UseCreateScheduleArgs {
  transaction: Transaction;
  memo?: string;
  adminKey?: Uint8Array;
  payerAccountId?: string | AccountId;
  expirationTime?: Date | null;
  waitForExpiry?: boolean;
}

export interface UseScheduleIdArgs {
  scheduleId: string | ScheduleId;
}

function toScheduleId(id: string | ScheduleId): ScheduleId {
  return typeof id === "string" ? ScheduleId.fromString(id) : id;
}

function toAccountId(id: string | AccountId): AccountId {
  return typeof id === "string" ? AccountId.fromString(id) : id;
}

export function useScheduleInfo(
  args: UseScheduleInfoArgs
): QueryResult<Awaited<ReturnType<ScheduleInfoQuery["execute"]>>> {
  const client = useHieroClient();
  const scheduleId = useMemo(() => {
    if (!args.scheduleId) return null;
    return typeof args.scheduleId === "string"
      ? ScheduleId.fromString(args.scheduleId)
      : args.scheduleId;
  }, [args.scheduleId]);

  const [data, setData] = useState<
    Awaited<ReturnType<ScheduleInfoQuery["execute"]>> | null
  >(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!scheduleId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new ScheduleInfoQuery().setScheduleId(scheduleId);

    query
      .execute(client.raw)
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
  }, [client, scheduleId, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

export function useCreateSchedule(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseCreateScheduleArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseCreateScheduleArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing create schedule args");
    }

    const tx = new ScheduleCreateTransaction().setScheduledTransaction(
      args.transaction
    );

    if (args.memo) {
      tx.setScheduleMemo(args.memo);
    }

    if (args.payerAccountId) {
      tx.setPayerAccountId(toAccountId(args.payerAccountId));
    }

    if (typeof args.waitForExpiry === "boolean") {
      tx.setWaitForExpiry(args.waitForExpiry);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseCreateScheduleArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useSignSchedule(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseScheduleIdArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseScheduleIdArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing sign schedule args");
    }

    const scheduleId = toScheduleId(args.scheduleId);

    const tx = new ScheduleSignTransaction().setScheduleId(scheduleId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseScheduleIdArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useDeleteSchedule(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseScheduleIdArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseScheduleIdArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing delete schedule args");
    }

    const scheduleId = toScheduleId(args.scheduleId);

    const tx = new ScheduleDeleteTransaction().setScheduleId(scheduleId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseScheduleIdArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}
