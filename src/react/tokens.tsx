import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccountId,
  TokenId,
  NftId,
  TokenInfoQuery,
  TokenNftInfoQuery,
  TokenCreateTransaction,
  TokenUpdateTransaction,
  TokenMintTransaction,
  TokenBurnTransaction,
  TokenAssociateTransaction,
  TokenDissociateTransaction,
  TokenGrantKycTransaction,
  TokenRevokeKycTransaction,
  TokenFreezeTransaction,
  TokenUnfreezeTransaction,
  TokenPauseTransaction,
  TokenUnpauseTransaction,
  type TransactionReceipt,
} from "@hashgraph/sdk";
import { useHieroClient } from "./core.js";
import {
  useTransactionFlow,
  type TransactionFlow,
  type TransactionFlowOptions,
  type FlowHandle,
} from "./flows.js";

type QueryStatus = "idle" | "loading" | "success" | "error";

interface QueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: unknown | null;
  refresh: () => void;
}

export interface UseFlowActionResult<TArgs, TReceipt = TransactionReceipt> {
  flow: FlowHandle<TReceipt>;
  execute: (args: TArgs) => Promise<void>;
}

export interface UseCreateFungibleTokenArgs {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  treasuryAccountId?: string | AccountId;
  memo?: string;
}

export interface UseUpdateTokenArgs {
  tokenId: string | TokenId;
  name?: string;
  symbol?: string;
  memo?: string;
}

export interface UseMintFungibleTokenArgs {
  tokenId: string | TokenId;
  amount: number;
}

export interface UseBurnFungibleTokenArgs {
  tokenId: string | TokenId;
  amount: number;
}

export interface UseMintNftArgs {
  tokenId: string | TokenId;
  metadata: (Uint8Array | string)[];
}

export interface UseBurnNftArgs {
  tokenId: string | TokenId;
  serials: number[];
}

export interface UseAssociateTokenArgs {
  accountId?: string | AccountId;
  tokenIds: (string | TokenId)[];
}

export interface UseDissociateTokenArgs {
  accountId?: string | AccountId;
  tokenIds: (string | TokenId)[];
}

export interface UseTokenAccountArgs {
  tokenId: string | TokenId;
  accountId: string | AccountId;
}

export interface UseTokenPauseArgs {
  tokenId: string | TokenId;
}

function useTokenId(input: string | TokenId): TokenId {
  return typeof input === "string" ? TokenId.fromString(input) : input;
}

function useAccountIdOrOperator(
  explicit?: string | AccountId
): AccountId | null {
  const client = useHieroClient();

  return useMemo(() => {
    if (explicit) {
      return typeof explicit === "string"
        ? AccountId.fromString(explicit)
        : explicit;
    }

    const operatorId = client.raw.operatorAccountId;
    if (!operatorId) {
      return null;
    }
    return operatorId;
  }, [client, explicit]);
}

function useTokenInfoQuery(
  tokenIdInput?: string | TokenId | null
): QueryResult<Awaited<ReturnType<TokenInfoQuery["execute"]>>> {
  const client = useHieroClient();
  const tokenId = useMemo(() => {
    if (!tokenIdInput) return null;
    return typeof tokenIdInput === "string"
      ? TokenId.fromString(tokenIdInput)
      : tokenIdInput;
  }, [tokenIdInput]);
  const [data, setData] = useState<
    Awaited<ReturnType<TokenInfoQuery["execute"]>> | null
  >(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!tokenId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new TokenInfoQuery().setTokenId(tokenId);

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
  }, [client, tokenId, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

function useTokenNftInfoQuery(
  args: { nftId?: string | NftId; tokenId?: string | TokenId } | null
): QueryResult<Awaited<ReturnType<TokenNftInfoQuery["execute"]>>> {
  const client = useHieroClient();
  const [data, setData] = useState<
    Awaited<ReturnType<TokenNftInfoQuery["execute"]>> | null
  >(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!args) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    const { nftId, tokenId } = args;

    if (!nftId && !tokenId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new TokenNftInfoQuery(
      nftId
        ? {
            nftId:
              typeof nftId === "string" ? NftId.fromString(nftId) : nftId,
          }
        : tokenId
        ? {
            tokenId:
              typeof tokenId === "string"
                ? TokenId.fromString(tokenId)
                : tokenId,
          }
        : {}
    );

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
  }, [client, args, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

export function useTokenInfo(tokenId?: string | TokenId | null) {
  return useTokenInfoQuery(tokenId);
}

export function useTokenSupply(tokenId?: string | TokenId | null) {
  const { data, status, error, refresh } = useTokenInfoQuery(tokenId);

  const supply = useMemo(() => {
    if (!data) return null;
    return data.totalSupply ?? null;
  }, [data]);

  return { data: supply, status, error, refresh };
}

export function useTokenMetadata(tokenId?: string | TokenId | null) {
  const { data, status, error, refresh } = useTokenInfoQuery(tokenId);

  const metadata = useMemo(() => {
    if (!data) return null;
    return {
      name: data.name ?? null,
      symbol: data.symbol ?? null,
      memo: data.tokenMemo ?? null,
      decimals: data.decimals ?? null,
    };
  }, [data]);

  return { data: metadata, status, error, refresh };
}

export function useTokenNfts(
  tokenId?: string | TokenId | null
): QueryResult<Awaited<ReturnType<TokenNftInfoQuery["execute"]>>> {
  const args = tokenId ? { tokenId } : null;
  return useTokenNftInfoQuery(args);
}

export function useNftInfo(
  nftId?: string | NftId | null
): QueryResult<Awaited<ReturnType<TokenNftInfoQuery["execute"]>>> {
  const args = nftId ? { nftId } : null;
  return useTokenNftInfoQuery(args);
}

export function useCreateFungibleToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseCreateFungibleTokenArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseCreateFungibleTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing create token args");
    }

    const treasury =
      args.treasuryAccountId ??
      client.raw.operatorAccountId ??
      null;

    if (!treasury) {
      throw new Error("Treasury account is required to create a token");
    }

    const tx = new TokenCreateTransaction()
      .setTokenName(args.name)
      .setTokenSymbol(args.symbol)
      .setDecimals(args.decimals)
      .setInitialSupply(args.initialSupply)
      .setTreasuryAccountId(treasury);

    if (args.memo) {
      tx.setTokenMemo(args.memo);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseCreateFungibleTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useUpdateToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseUpdateTokenArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseUpdateTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing update token args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenUpdateTransaction().setTokenId(tokenId);

    if (args.name) {
      tx.setTokenName(args.name);
    }
    if (args.symbol) {
      tx.setTokenSymbol(args.symbol);
    }
    if (args.memo) {
      tx.setTokenMemo(args.memo);
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseUpdateTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useMintFungibleToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseMintFungibleTokenArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseMintFungibleTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing mint token args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(args.amount);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseMintFungibleTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useBurnFungibleToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseBurnFungibleTokenArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseBurnFungibleTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing burn token args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenBurnTransaction()
      .setTokenId(tokenId)
      .setAmount(args.amount);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseBurnFungibleTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useMintNft(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseMintNftArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseMintNftArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing mint NFT args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenMintTransaction().setTokenId(tokenId);

    for (const item of args.metadata) {
      tx.addMetadata(
        typeof item === "string" ? new TextEncoder().encode(item) : item
      );
    }

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseMintNftArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useBurnNft(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseBurnNftArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseBurnNftArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing burn NFT args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenBurnTransaction()
      .setTokenId(tokenId)
      .setSerials(args.serials);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseBurnNftArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useAssociateToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseAssociateTokenArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseAssociateTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing associate token args");
    }

    const accountId = useAccountIdOrOperator(args.accountId);
    if (!accountId) {
      throw new Error("Account is required to associate token");
    }

    const tokenIds = args.tokenIds.map((id) =>
      typeof id === "string" ? TokenId.fromString(id) : id
    );

    const tx = new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds(tokenIds);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseAssociateTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useDissociateToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseDissociateTokenArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseDissociateTokenArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing dissociate token args");
    }

    const accountId = useAccountIdOrOperator(args.accountId);
    if (!accountId) {
      throw new Error("Account is required to dissociate token");
    }

    const tokenIds = args.tokenIds.map((id) =>
      typeof id === "string" ? TokenId.fromString(id) : id
    );

    const tx = new TokenDissociateTransaction()
      .setAccountId(accountId)
      .setTokenIds(tokenIds);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseDissociateTokenArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useGrantTokenKyc(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseTokenAccountArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseTokenAccountArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing grant KYC args");
    }

    const tokenId = useTokenId(args.tokenId);
    const accountId =
      typeof args.accountId === "string"
        ? AccountId.fromString(args.accountId)
        : args.accountId;

    const tx = new TokenGrantKycTransaction()
      .setTokenId(tokenId)
      .setAccountId(accountId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseTokenAccountArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useRevokeTokenKyc(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseTokenAccountArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseTokenAccountArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing revoke KYC args");
    }

    const tokenId = useTokenId(args.tokenId);
    const accountId =
      typeof args.accountId === "string"
        ? AccountId.fromString(args.accountId)
        : args.accountId;

    const tx = new TokenRevokeKycTransaction()
      .setTokenId(tokenId)
      .setAccountId(accountId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseTokenAccountArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useFreezeTokenAccount(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseTokenAccountArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseTokenAccountArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing freeze token args");
    }

    const tokenId = useTokenId(args.tokenId);
    const accountId =
      typeof args.accountId === "string"
        ? AccountId.fromString(args.accountId)
        : args.accountId;

    const tx = new TokenFreezeTransaction()
      .setTokenId(tokenId)
      .setAccountId(accountId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseTokenAccountArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useUnfreezeTokenAccount(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseTokenAccountArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseTokenAccountArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing unfreeze token args");
    }

    const tokenId = useTokenId(args.tokenId);
    const accountId =
      typeof args.accountId === "string"
        ? AccountId.fromString(args.accountId)
        : args.accountId;

    const tx = new TokenUnfreezeTransaction()
      .setTokenId(tokenId)
      .setAccountId(accountId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseTokenAccountArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function usePauseToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseTokenPauseArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseTokenPauseArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing pause token args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenPauseTransaction().setTokenId(tokenId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseTokenPauseArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

export function useUnpauseToken(
  options: TransactionFlowOptions = {}
): UseFlowActionResult<UseTokenPauseArgs, TransactionReceipt> {
  const client = useHieroClient();
  const argsRef = useRef<UseTokenPauseArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing unpause token args");
    }

    const tokenId = useTokenId(args.tokenId);

    const tx = new TokenUnpauseTransaction().setTokenId(tokenId);

    const handle = await client.submit(tx);
    const receipt = await handle.wait(options.timeoutMs);
    return receipt;
  };

  const flow = useTransactionFlow(intent, { ...options, autoStart: false });

  const execute = async (args: UseTokenPauseArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}

