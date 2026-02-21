import { useRef } from "react";
import {
  AccountId,
  Hbar,
  TokenId,
  TransferTransaction,
  AccountBalanceQuery,
  type TransactionReceipt,
} from "@hashgraph/sdk";
import { useHieroClient } from "./core.js";
import {
  useTransactionFlow,
  type TransactionFlow,
  type TransactionFlowOptions,
  type FlowHandle,
} from "./flows.js";

export interface TransferHbarArgs {
  to: string | AccountId;
  amount: number | Hbar;
  memo?: string;
}

export interface TransferTokenArgs {
  tokenId: string | TokenId;
  from?: string | AccountId;
  to: string | AccountId;
  amount: number;
}

export interface BatchTransferItem {
  to: string | AccountId;
  amount: number | Hbar;
}

export interface BatchTransferArgs {
  items: BatchTransferItem[];
  memo?: string;
}

export interface MultiTokenTransferItem {
  tokenId: string | TokenId;
  from?: string | AccountId;
  to: string | AccountId;
  amount: number;
}

export interface MultiTokenTransferArgs {
  items: MultiTokenTransferItem[];
  memo?: string;
}

export interface ScheduledTransferArgs extends TransferHbarArgs {}

export interface AllowanceArgs {
  owner: string | AccountId;
  spender: string | AccountId;
  amount: number | Hbar;
}

export interface TokenAllowanceArgs {
  tokenId: string | TokenId;
  owner: string | AccountId;
  spender: string | AccountId;
  amount: number;
}

export interface UseTransferResult<TReceipt = TransactionReceipt> {
  flow: FlowHandle<TReceipt>;
  execute: (args: any) => Promise<void>;
}

export function useTransferHbar(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<TransferHbarArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing transfer HBAR args");
    }
    const handle = await client.transferHbar(args.to, args.amount, args.memo);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: TransferHbarArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useTransferToken(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<TransferTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing transfer token args");
    }

    const tokenId =
      typeof args.tokenId === "string"
        ? TokenId.fromString(args.tokenId)
        : args.tokenId;

    const from =
      args.from ??
      client.raw.operatorAccountId ??
      (() => {
        throw new Error("Missing from account and no operator configured");
      })();

    const tx = new TransferTransaction().addTokenTransfer(
      tokenId,
      from,
      -args.amount
    ).addTokenTransfer(tokenId, args.to, args.amount);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: TransferTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useBatchTransfer(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<BatchTransferArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing batch transfer args");
    }

    if (!client.raw.operatorAccountId) {
      throw new Error("Operator account is required for batch transfers");
    }

    const tx = new TransferTransaction();
    let totalTinybars = 0;

    for (const item of args.items) {
      const amount =
        item.amount instanceof Hbar
          ? item.amount.toTinybars().toInt()
          : item.amount;
      tx.addHbarTransfer(item.to, new Hbar(amount));
      totalTinybars += amount;
    }

    tx.addHbarTransfer(
      client.raw.operatorAccountId,
      new Hbar(-totalTinybars)
    );

    if (args.memo) {
      tx.setTransactionMemo(args.memo);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: BatchTransferArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useMultiTokenTransfer(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<MultiTokenTransferArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing multi token transfer args");
    }

    const tx = new TransferTransaction();

    for (const item of args.items) {
      const tokenId =
        typeof item.tokenId === "string"
          ? TokenId.fromString(item.tokenId)
          : item.tokenId;

      const from =
        item.from ??
        client.raw.operatorAccountId ??
        (() => {
          throw new Error("Missing from account and no operator configured");
        })();

      tx.addTokenTransfer(tokenId, from, -item.amount).addTokenTransfer(
        tokenId,
        item.to,
        item.amount
      );
    }

    if (args.memo) {
      tx.setTransactionMemo(args.memo);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: MultiTokenTransferArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useScheduledTransfer(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<ScheduledTransferArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing scheduled transfer args");
    }

    const handle = await client.transferHbar(args.to, args.amount, args.memo);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: ScheduledTransferArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useApproveAllowance(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<AllowanceArgs | TokenAllowanceArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing allowance args");
    }

    const sdk = client.raw as any;
    const tx = new sdk.AccountAllowanceApproveTransaction();

    if ("tokenId" in args) {
      const tokenId =
        typeof args.tokenId === "string"
          ? TokenId.fromString(args.tokenId)
          : args.tokenId;
      tx.approveTokenAllowance(tokenId, args.owner, args.spender, args.amount);
    } else {
      tx.approveHbarAllowance(args.owner, args.spender, args.amount);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: AllowanceArgs | TokenAllowanceArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useRevokeAllowance(
  options: TransactionFlowOptions = {}
): UseTransferResult<TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<TokenAllowanceArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing revoke allowance args");
    }

    const sdk = client.raw as any;
    const tx = new sdk.AccountAllowanceDeleteTransaction();

    const tokenId =
      typeof args.tokenId === "string"
        ? TokenId.fromString(args.tokenId)
        : args.tokenId;

    tx.deleteAllTokenNftAllowances(tokenId, args.owner);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: TokenAllowanceArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export interface AllowanceStatusArgs {
  owner: string | AccountId;
}

export interface AllowanceStatus {
  hbarAllowances: unknown[];
  tokenAllowances: unknown[];
  nftAllowances: unknown[];
}

export function useAllowanceStatus(
  _args: AllowanceStatusArgs | null
): {
  data: AllowanceStatus | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  return {
    data: null,
    status: "idle",
    error: null,
    refresh: () => {},
  };
}

export interface EstimateTransferFeeArgs {
  accountId?: string | AccountId;
}

export function useEstimateTransferFee(
  args: EstimateTransferFeeArgs | null
): {
  data: Hbar | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  const client = useHieroClient();
  const accountId =
    args?.accountId ??
    client.raw.operatorAccountId ??
    null;

  const resultRef = useRef<{
    data: Hbar | null;
    status: "idle" | "loading" | "success" | "error";
    error: unknown | null;
  }>({
    data: null,
    status: "idle",
    error: null,
  });

  if (!accountId) {
    return {
      data: null,
      status: "idle",
      error: null,
      refresh: () => {},
    };
  }

  const refresh = () => {
    resultRef.current.status = "loading";
    const query = new AccountBalanceQuery().setAccountId(accountId);
    query
      .getCost(client.raw)
      .then((cost) => {
        resultRef.current.data = cost;
        resultRef.current.status = "success";
      })
      .catch((err) => {
        resultRef.current.error = err;
        resultRef.current.status = "error";
      });
  };

  return {
    data: resultRef.current.data,
    status: resultRef.current.status,
    error: resultRef.current.error,
    refresh,
  };
}

export interface TransferPreviewArgs extends TransferHbarArgs {}

export function useTransferPreview(
  _args: TransferPreviewArgs | null
): {
  data: null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  return {
    data: null,
    status: "idle",
    error: null,
    refresh: () => {},
  };
}

export interface TransferFlowStatusArgs {
  flowId: string;
}

export function useTransferFlowStatus(
  _args: TransferFlowStatusArgs | null
): {
  data: FlowHandle<TransactionReceipt> | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  return {
    data: null,
    status: "idle",
    error: null,
    refresh: () => {},
  };
}

export interface TransferHistoryArgs {
  accountId: string | AccountId;
}

export function useTransferHistory(
  _args: TransferHistoryArgs | null
): {
  data: unknown[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  return {
    data: null,
    status: "idle",
    error: null,
    refresh: () => {},
  };
}
