import { useEffect, useMemo, useState } from "react";
import {
  AccountId,
  AccountInfoQuery,
  AccountBalanceQuery,
  Hbar,
} from "@hiero-ledger/sdk";
import { useHieroClient } from "./core.js";

type QueryStatus = "idle" | "loading" | "success" | "error";

interface QueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: unknown | null;
  refresh: () => void;
}

function useAccountIdInternal(explicitAccountId?: string | AccountId | null) {
  const client = useHieroClient();

  return useMemo(() => {
    if (explicitAccountId) {
      return typeof explicitAccountId === "string"
        ? AccountId.fromString(explicitAccountId)
        : explicitAccountId;
    }

    const operatorId = client.raw.operatorAccountId;
    if (!operatorId) {
      return null;
    }
    return operatorId;
  }, [client, explicitAccountId]);
}

function useAccountInfoQuery(
  accountIdInput?: string | AccountId | null
): QueryResult<Awaited<ReturnType<AccountInfoQuery["execute"]>>> {
  const client = useHieroClient();
  const accountId = useAccountIdInternal(accountIdInput);
  const [data, setData] = useState<
    Awaited<ReturnType<AccountInfoQuery["execute"]>> | null
  >(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!accountId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new AccountInfoQuery().setAccountId(accountId);

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
  }, [client, accountId, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

function useAccountBalanceQuery(
  accountIdInput?: string | AccountId | null
): QueryResult<Awaited<ReturnType<AccountBalanceQuery["execute"]>>> {
  const client = useHieroClient();
  const accountId = useAccountIdInternal(accountIdInput);
  const [data, setData] = useState<
    Awaited<ReturnType<AccountBalanceQuery["execute"]>> | null
  >(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!accountId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const query = new AccountBalanceQuery().setAccountId(accountId);

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
  }, [client, accountId, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

export function useAccountId() {
  return useAccountIdInternal();
}

export function useAccountInfo(accountId?: string | AccountId | null) {
  return useAccountInfoQuery(accountId);
}

export function useAccountBalance(accountId?: string | AccountId | null) {
  return useAccountBalanceQuery(accountId);
}

export function useAccountHbarBalance(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountBalanceQuery(accountId);

  const hbar = useMemo<Hbar | null>(() => {
    if (!data) return null;
    return data.hbars;
  }, [data]);

  return { data: hbar, status, error, refresh };
}

export function useAccountTokens(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountBalanceQuery(accountId);

  const tokens = useMemo(() => {
    if (!data) return null;
    return data.tokens;
  }, [data]);

  return { data: tokens, status, error, refresh };
}

export function useAccountNFTs(accountId?: string | AccountId | null) {
  const client = useHieroClient();
  const resolvedAccountId = useAccountIdInternal(accountId);
  const [data, setData] = useState<unknown[] | null>(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!resolvedAccountId) {
      setStatus("idle");
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    let baseUrl: string | null = null;
    try {
      baseUrl = client.raw.mirrorRestApiBaseUrl;
    } catch {
      baseUrl = null;
    }

    if (!baseUrl) {
      setStatus("error");
      setError(new Error("Mirror node URL is not configured"));
      return;
    }

    setStatus("loading");
    setError(null);

    const url = `${baseUrl}/api/v1/accounts/${resolvedAccountId.toString()}/nfts`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Mirror node error: ${res.status}`);
        }
        const json = await res.json();
        return json.nfts ?? json.items ?? [];
      })
      .then((items) => {
        if (cancelled) return;
        setData(items);
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
  }, [client, resolvedAccountId, version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

export function useAccountKeys(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const keys = useMemo(() => {
    if (!data) return null;
    return data.key ?? null;
  }, [data]);

  return { data: keys, status, error, refresh };
}

export function useAccountStakingInfo(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const staking = useMemo(() => {
    if (!data) return null;
    return {
      stakingInfo: data.stakingInfo ?? null,
    };
  }, [data]);

  return { data: staking, status, error, refresh };
}

export function useAccountMemo(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const memo = useMemo(() => {
    if (!data) return null;
    return data.accountMemo ?? null;
  }, [data]);

  return { data: memo, status, error, refresh };
}

export function useIsAccountDeleted(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const deleted = useMemo(() => {
    if (!data) return null;
    return data.isDeleted ?? false;
  }, [data]);

  return { data: deleted, status, error, refresh };
}

export function useIsAccountFrozen(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const frozen = useMemo(() => {
    if (!data) return null;
    return data.isReceiverSignatureRequired ?? false;
  }, [data]);

  return { data: frozen, status, error, refresh };
}

export function useAccountExpiration(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const expiration = useMemo(() => {
    if (!data) return null;
    return data.expirationTime ?? null;
  }, [data]);

  return { data: expiration, status, error, refresh };
}

export function useAccountAutoRenew(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const autoRenew = useMemo(() => {
    if (!data) return null;
    return {
      autoRenewPeriod: data.autoRenewPeriod ?? null,
    };
  }, [data]);

  return { data: autoRenew, status, error, refresh };
}

export function useAccountProxy(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const proxy = useMemo(() => {
    if (!data) return null;
    return data.proxyAccountId ?? null;
  }, [data]);

  return { data: proxy, status, error, refresh };
}

export function useAccountLedgerId(accountId?: string | AccountId | null) {
  const { data, status, error, refresh } = useAccountInfoQuery(accountId);

  const ledgerId = useMemo(() => {
    if (!data) return null;
    return data.ledgerId ?? null;
  }, [data]);

  return { data: ledgerId, status, error, refresh };
}
