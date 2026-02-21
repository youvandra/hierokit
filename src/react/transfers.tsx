import { useMemo, useRef } from "react";
import {
  AccountId,
  Hbar,
  TokenId,
  TransferTransaction,
  AccountBalanceQuery,
  type TransactionReceipt,
} from "@hiero-ledger/sdk";
import { useHieroClient } from "./core.js";
import { useMirrorRest } from "./mirror.js";
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

export interface MirrorLinks {
  next: string | null;
}

export interface MirrorTransfer {
  account: string;
  amount: number;
  is_approval: boolean;
}

export interface MirrorTokenTransfer {
  token_id: string;
  account: string;
  amount: number;
  is_approval: boolean;
}

export interface MirrorTransaction {
  transaction_id: string;
  consensus_timestamp: string;
  name: string;
  result: string;
  transfers: MirrorTransfer[];
  token_transfers: MirrorTokenTransfer[];
  [key: string]: unknown;
}

export interface MirrorTransactionList {
  transactions: MirrorTransaction[];
  links: MirrorLinks;
}

export interface MirrorCryptoAllowance {
  owner: string;
  spender: string;
  amount: string;
  [key: string]: unknown;
}

export interface MirrorTokenAllowance {
  owner: string;
  spender: string;
  token_id: string;
  amount: string;
  [key: string]: unknown;
}

export interface MirrorNftAllowance {
  owner: string;
  spender: string;
  token_id: string;
  [key: string]: unknown;
}

export interface MirrorAllowanceList<TAllowance> {
  allowances: TAllowance[];
  links: MirrorLinks;
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
  args: AllowanceStatusArgs | null
): {
  data: AllowanceStatus | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  const ownerId =
    args === null
      ? null
      : typeof args.owner === "string"
      ? args.owner
      : args.owner.toString();

  const crypto = useMirrorRest<MirrorAllowanceList<MirrorCryptoAllowance>>(
    ownerId ? `api/v1/accounts/${ownerId}/allowances/crypto` : "api/v1/accounts",
    {
      enabled: !!ownerId,
    }
  );

  const tokens = useMirrorRest<MirrorAllowanceList<MirrorTokenAllowance>>(
    ownerId ? `api/v1/accounts/${ownerId}/allowances/tokens` : "api/v1/accounts",
    {
      enabled: !!ownerId,
    }
  );

  const nfts = useMirrorRest<MirrorAllowanceList<MirrorNftAllowance>>(
    ownerId ? `api/v1/accounts/${ownerId}/allowances/nfts` : "api/v1/accounts",
    {
      enabled: !!ownerId,
    }
  );

  const data = useMemo<AllowanceStatus | null>(() => {
    if (!ownerId) return null;
    if (!crypto.data && !tokens.data && !nfts.data) return null;
    return {
      hbarAllowances: crypto.data?.allowances ?? [],
      tokenAllowances: tokens.data?.allowances ?? [],
      nftAllowances: nfts.data?.allowances ?? [],
    };
  }, [ownerId, crypto.data, tokens.data, nfts.data]);

  const status: "idle" | "loading" | "success" | "error" = useMemo(() => {
    if (!ownerId) return "idle";
    const statuses = [crypto.status, tokens.status, nfts.status];
    if (statuses.includes("loading")) return "loading";
    if (statuses.includes("error")) return "error";
    if (statuses.includes("success")) return "success";
    return "idle";
  }, [ownerId, crypto.status, tokens.status, nfts.status]);

  const error =
    crypto.error ?? tokens.error ?? nfts.error ?? null;

  return {
    data,
    status,
    error,
    refresh: () => {
      crypto.refresh();
      tokens.refresh();
      nfts.refresh();
    },
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
  args: TransferPreviewArgs | null
): {
  data: Hbar | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  const accountId =
    args === null
      ? null
      : typeof args.to === "string"
      ? args.to
      : args.to.toString();

  return useEstimateTransferFee(
    accountId ? { accountId } : null
  );
}

export interface TransferFlowStatusArgs {
  flowId: string;
}

export function useTransferFlowStatus(
  args: TransferFlowStatusArgs | null
): {
  data: MirrorTransaction[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  const flowId = args?.flowId ?? null;

  const { data, status, error, refresh } = useMirrorRest<MirrorTransactionList>("api/v1/transactions", {
    enabled: !!flowId,
    query: flowId ? { transactionId: flowId } : undefined,
  });

  const mapped = useMemo<MirrorTransaction[] | null>(() => {
    if (!flowId || !data) return null;
    return data.transactions ?? [];
  }, [data, flowId]);

  return {
    data: mapped,
    status: flowId ? status : "idle",
    error: flowId ? error : null,
    refresh,
  };
}

export interface TransferHistoryArgs {
  accountId: string | AccountId;
}

export function useTransferHistory(
  args: TransferHistoryArgs | null
): {
  data: MirrorTransaction[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
} {
  const accountId =
    args === null
      ? null
      : typeof args.accountId === "string"
      ? args.accountId
      : args.accountId.toString();

  const { data, status, error, refresh } = useMirrorRest<MirrorTransactionList>("api/v1/transactions", {
    enabled: !!accountId,
    query: accountId ? { "account.id": accountId } : undefined,
  });

  const mapped = useMemo<MirrorTransaction[] | null>(() => {
    if (!accountId || !data) return null;
    return data.transactions ?? [];
  }, [data, accountId]);

  return {
    data: mapped,
    status: accountId ? status : "idle",
    error: accountId ? error : null,
    refresh,
  };
}
