import { useEffect, useMemo, useRef, useState } from "react";
import {
  TopicCreateTransaction,
  TopicInfoQuery,
  TopicDeleteTransaction,
  TopicUpdateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  type TransactionReceipt,
} from "@hiero-ledger/sdk";
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

export interface UseCreateTopicArgs {
  memo?: string;
  adminKey?: Uint8Array;
  submitKey?: Uint8Array;
  autoRenewAccountId?: string | AccountId;
}

export interface UseUpdateTopicArgs {
  topicId: string | TopicId;
  memo?: string;
}

export interface UseDeleteTopicArgs {
  topicId: string | TopicId;
}

export interface UseSubmitMessageArgs {
  topicId: string | TopicId;
  message: string | Uint8Array;
}

function toTopicId(id: string | TopicId): TopicId {
  return typeof id === "string" ? TopicId.fromString(id) : id;
}

function toAccountId(id: string | AccountId): AccountId {
  return typeof id === "string" ? AccountId.fromString(id) : id;
}

export function useTopicInfo(
  topicIdInput?: string | TopicId | null
): QueryResult<Awaited<ReturnType<TopicInfoQuery["execute"]>>> {
  const client = useHieroClient();
  const topicId = useMemo(() => {
    if (!topicIdInput) return null;
    return typeof topicIdInput === "string"
      ? TopicId.fromString(topicIdInput)
      : topicIdInput;
  }, [topicIdInput]);

  const [data, setData] = useState<
    Awaited<ReturnType<TopicInfoQuery["execute"]>> | null
  >(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!topicId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new TopicInfoQuery().setTopicId(topicId);

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
  }, [client, topicId, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

export function useCreateTopic(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseCreateTopicArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseCreateTopicArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing create topic args");
    }

    const tx = new TopicCreateTransaction();

    if (args.memo) {
      tx.setTopicMemo(args.memo);
    }

    if (args.autoRenewAccountId) {
      tx.setAutoRenewAccountId(toAccountId(args.autoRenewAccountId));
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseCreateTopicArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useUpdateTopic(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseUpdateTopicArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseUpdateTopicArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing update topic args");
    }

    const topicId = toTopicId(args.topicId);

    const tx = new TopicUpdateTransaction().setTopicId(topicId);

    if (args.memo) {
      tx.setTopicMemo(args.memo);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseUpdateTopicArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useDeleteTopic(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseDeleteTopicArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseDeleteTopicArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing delete topic args");
    }

    const topicId = toTopicId(args.topicId);

    const tx = new TopicDeleteTransaction().setTopicId(topicId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseDeleteTopicArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useSubmitMessage(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseSubmitMessageArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseSubmitMessageArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing submit message args");
    }

    const topicId = toTopicId(args.topicId);

    const tx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(args.message);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseSubmitMessageArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}
