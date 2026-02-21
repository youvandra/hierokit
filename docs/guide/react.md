# React Hooks

HieroKit includes an optional React layer that wraps the core client and flows
with ergonomic hooks. The React APIs are built on top of the same HieroKit
client – there is no separate network stack.

## Installation

React support is bundled in the main package:

```bash
npm install hierokit @hashgraph/sdk react react-dom
```

The library declares `react` as a peer dependency so you can manage the exact
version in your app.

## HieroProvider

At the root of your app, provide a configured Hiero client:

```tsx
import { HieroProvider } from "hierokit";

const config = {
  network: "testnet" as const,
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID as string,
    privateKey: process.env.HEDERA_PRIVATE_KEY as string,
  },
  mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
};

export function AppRoot() {
  return (
    <HieroProvider config={config}>
      <App />
    </HieroProvider>
  );
}
```

All hooks below assume they are used inside `HieroProvider`.

## Core environment hooks

These come from the `react/core` module and are re‑exported from `hierokit`:

- `useHieroClient()` – access the configured `Client` wrapper
- `useHieroConfig()` – read the current `HieroConfig`
- `useNetwork()` – convenience for `config.network`
- `useLedgerId()` – read `client.raw.ledgerId`
- `useNodeList()` – list of network nodes
- `useClientStatus()` – `"idle"` or `"ready"`
- `useClientHealth()` – `"ready"` or `"unknown"`
- `useMirrorNodeUrl()` – resolved mirror REST base URL or `null`
- `useMaxTransactionFee()` – default max transaction fee (`Hbar | null`)
- `useDefaultOperator()` – current operator information

Example:

```tsx
import { useNetwork, useHieroClient } from "hierokit";

function NetworkBadge() {
  const network = useNetwork();
  const client = useHieroClient();

  return (
    <div>
      <div>Network: {typeof network === "string" ? network : "custom"}</div>
      <div>Operator: {client.raw.operatorAccountId?.toString() ?? "none"}</div>
    </div>
  );
}
```

## Transaction flows in React

The core DX primitive is a **flow** – a function that takes a HieroKit `Client`
and returns a `Promise` of a receipt or other result:

```ts
type TransactionFlow<TReceipt = TransactionReceipt> =
  (client: Client) => Promise<TReceipt>;
```

The `useTransactionFlow` hook manages the lifecycle:

```tsx
import {
  useTransactionFlow,
  type TransactionFlow,
} from "hierokit";

const transferFlow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.12345", 10, "Hello HieroKit");
  const receipt = await handle.wait();
  return receipt;
};

function TransferButton() {
  const flow = useTransactionFlow(transferFlow, {
    autoStart: false,
    timeoutMs: 60_000,
  });

  return (
    <div>
      <button onClick={() => flow.start()} disabled={flow.status === "submitting"}>
        Transfer
      </button>

      {flow.status === "success" && (
        <p>Done: {flow.receipt?.status.toString()}</p>
      )}
      {flow.status === "error" && <p>Error: {String(flow.error)}</p>}
    </div>
  );
}
```

Supporting helpers:

- `useCreateFlow(intent, options?)` – same as `useTransactionFlow` but never auto‑starts
- `useFlowStatus(handle)` – read `FlowStatus`
- `useFlowReceipt(handle)` – read the flow result
- `useFlowError(handle)` – read the last error
- `useRetryFlow(handle)` – retry the same flow
- `useCancelFlow(handle)` – cancel an in‑flight flow
- `useFlowTimeout(handle)` – read the configured timeout

This is the React counterpart of HieroKit’s declarative flow model: the intent
is a pure function, and the hook handles retries, cancellation and timeout.

## Account & identity hooks

Account hooks follow a consistent pattern:

- `data` – the normalized result (for example a `Hbar`, map, or DTO)
- `status` – `"idle" | "loading" | "success" | "error"`
- `error` – error from the latest request
- `refresh()` – re‑run the underlying query

If `accountId` is omitted, the hooks default to the configured operator account.

### `useAccountId()`

Resolve the current account ID:

```tsx
import { useAccountId } from "hierokit";

const CurrentAccount = () => {
  const accountId = useAccountId();
  return <span>{accountId?.toString() ?? "no operator"}</span>;
};
```

### `useAccountInfo(accountId?)`

Query full `AccountInfo`:

```tsx
import { useAccountInfo } from "hierokit";

function AccountInfoPanel() {
  const { data, status, error } = useAccountInfo();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return null;

  return (
    <div>
      <div>ID: {data.accountId.toString()}</div>
      <div>Memo: {data.accountMemo}</div>
    </div>
  );
}
```

### `useAccountBalance(accountId?)` and `useAccountHbarBalance(accountId?)`

Access the full balance or just the HBAR portion:

```tsx
import { useAccountHbarBalance } from "hierokit";

function HbarBalance() {
  const { data: hbar, status } = useAccountHbarBalance();

  if (status !== "success" || !hbar) return <span>Loading...</span>;
  return <span>{hbar.toString()}</span>;
}
```

### `useAccountTokens(accountId?)`

Token balances for fungible tokens:

```tsx
import { useAccountTokens } from "hierokit";

function TokenList() {
  const { data: tokens, status } = useAccountTokens();
  if (status !== "success" || !tokens) return null;

  return (
    <ul>
      {Array.from(tokens.entries()).map(([tokenId, balance]) => (
        <li key={tokenId.toString()}>
          {tokenId.toString()}: {balance.toString()}
        </li>
      ))}
    </ul>
  );
}
```

### `useAccountNFTs(accountId?)`

Fetch NFTs for an account via the configured mirror node:

```tsx
import { useAccountNFTs } from "hierokit";

function NFTGrid() {
  const { data, status, error } = useAccountNFTs();

  if (status === "loading") return <p>Loading NFTs...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return <p>No NFTs</p>;

  return (
    <ul>
      {data.map((nft, i) => (
        <li key={i}>{JSON.stringify(nft)}</li>
      ))}
    </ul>
  );
}
```

This requires `mirrorNodeUrl` to be set in `HieroConfig`.

### Other account helpers

All derived from `AccountInfo`:

- `useAccountKeys(accountId?)`
- `useAccountStakingInfo(accountId?)`
- `useAccountMemo(accountId?)`
- `useIsAccountDeleted(accountId?)`
- `useIsAccountFrozen(accountId?)`
- `useAccountExpiration(accountId?)`
- `useAccountAutoRenew(accountId?)`
- `useAccountProxy(accountId?)`
- `useAccountLedgerId(accountId?)`

These are thin selectors over the raw SDK response, keeping your components
focused on rendering and user flows instead of query plumbing.

