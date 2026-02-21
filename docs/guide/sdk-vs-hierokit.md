---
outline: deep
---

# SDK vs HieroKit

HieroKit is built on top of the official `@hiero-ledger/sdk`. You still get
the full power of the SDK, but with a higher-level, flow-based API and better
DX for both Node and React.

This page compares the raw SDK and HieroKit side by side so you can see:

- What HieroKit adds on top of the SDK
- When to use raw SDK vs HieroKit
- How common tasks look in each style

## Mental model

### SDK

- Low-level, imperative API.
- You control everything: network config, retries, timeouts, error handling.
- Each transaction or query is its own object (e.g. `TransferTransaction`,
  `AccountBalanceQuery`).
- Great when you need maximum control and are comfortable with the SDK surface.

### HieroKit

- Flow-based, opinionated API for common patterns.
- Wraps the SDK and exposes:
  - A single `Client` abstraction
  - Higher-level transfer and token helpers
  - Transaction "flows" with explicit lifecycle
  - React hooks that talk to the same client
- Designed for teams that want consistency, safety, and strong typing without
  re-implementing cross-cutting concerns.

## Client configuration

### Using the SDK directly

```ts
import { Client } from "@hiero-ledger/sdk";

const client = Client.forTestnet();

client.setOperator(
  process.env.HEDERA_ACCOUNT_ID!,
  process.env.HEDERA_PRIVATE_KEY!
);
``+

### Using HieroKit

```ts
import { Client } from "hierokit";

const client = new Client({
  network: "testnet",
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID,
    privateKey: process.env.HEDERA_PRIVATE_KEY,
  },
});
```

**What HieroKit adds**

- Single config object instead of mutating an SDK client.
- Strict typing on `network` and operator.
- A place to hang other config (mirror node URL, defaults) in one shape.

## HBAR transfer

### Using the SDK directly

```ts
import {
  Client,
  Hbar,
  TransferTransaction,
} from "@hiero-ledger/sdk";

const client = Client.forTestnet();

client.setOperator(
  process.env.HEDERA_ACCOUNT_ID!,
  process.env.HEDERA_PRIVATE_KEY!
);

async function sendHbar() {
  const tx = await new TransferTransaction()
    .addHbarTransfer("0.0.sender", new Hbar(-10))
    .addHbarTransfer("0.0.recipient", new Hbar(10))
    .setTransactionMemo("Hello HieroKit")
    .execute(client);

  const receipt = await tx.getReceipt(client);

  console.log(receipt.status.toString());
}
```

### Using HieroKit

```ts
import { Client } from "hierokit";

const client = new Client({
  network: "testnet",
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID,
    privateKey: process.env.HEDERA_PRIVATE_KEY,
  },
});

async function sendHbar() {
  const handle = await client.transferHbar(
    "0.0.recipient",
    10,
    "Hello HieroKit"
  );

  const receipt = await handle.wait();

  console.log(receipt.status.toString());
}
```

**What HieroKit adds**

- One call (`transferHbar`) instead of constructing a transaction object.
- `TransactionHandle` that:
  - Encapsulates the ID
  - Knows how to `wait()` with an optional timeout
  - Plays nicely with flows and React hooks.
- Consistent argument order and types across helpers.

## Error handling

### Using the SDK directly

```ts
try {
  const tx = await new TransferTransaction()
    .addHbarTransfer("0.0.sender", new Hbar(-10))
    .addHbarTransfer("0.0.recipient", new Hbar(10))
    .execute(client);

  const receipt = await tx.getReceipt(client);

  console.log(receipt.status.toString());
} catch (err) {
  console.error("transfer failed", err);
}
```

You receive a thrown error from the SDK and you must interpret:

- gRPC status
- Hedera `Status`
- When to retry vs fail fast.

### Using HieroKit

```ts
import { classifyError } from "hierokit";

try {
  const handle = await client.transferHbar("0.0.recipient", 10);
  const receipt = await handle.wait();
  console.log(receipt.status.toString());
} catch (err) {
  const classified = classifyError(err);

  if (classified.retryable) {
    console.error("retryable error", classified);
  } else {
    console.error("non-retryable error", classified);
  }
}
```

**What HieroKit adds**

- Error classification so you do not need to manually map statuses.
- A structured error type suitable for logging and UIs.

## React integration

### Using the SDK directly in React

You typically have to:

- Create a client singleton yourself.
- Manage loading/error state with `useState` and `useEffect`.
- Remember to clean up polling and timeouts.

That often becomes repetitive and inconsistent between components.

### Using HieroKit hooks

```tsx
import {
  HieroProvider,
  useAccountId,
  useAccountHbarBalance,
  useTransferHbar,
} from "hierokit";

const config = {
  network: "testnet" as const,
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID as string,
    privateKey: process.env.HEDERA_PRIVATE_KEY as string,
  },
  mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
};

function AccountSummary() {
  const accountId = useAccountId();
  const { data: hbar, status } = useAccountHbarBalance();

  return (
    <div>
      <div>Account: {accountId?.toString() ?? "n/a"}</div>
      <div>
        HBAR:{" "}
        {status === "success" && hbar ? hbar.toString() : "loading..."}
      </div>
    </div>
  );
}

function SendHbarButton() {
  const { flow, execute } = useTransferHbar();

  return (
    <button
      onClick={() =>
        execute({ to: "0.0.recipient", amount: 10 })
      }
      disabled={flow.status === "submitting"}
    >
      {flow.status === "submitting" ? "Sending..." : "Send 10 HBAR"}
    </button>
  );
}

export function AppRoot() {
  return (
    <HieroProvider config={config}>
      <AccountSummary />
      <SendHbarButton />
    </HieroProvider>
  );
}
```

**What HieroKit adds**

- `HieroProvider` that owns the client and config.
- Hooks that expose:
  - `data`, `status`, `error`
  - `execute` or `refresh` depending on the operation.
- Flow-aware status (`idle`, `submitting`, `success`, `error`) that you can
  bind directly to UI.

## When to use which

Use **raw SDK** when:

- You are writing very low-level tooling or infrastructure.
- You need features HieroKit does not expose yet.
- You want complete control over every transaction field and lifecycle.

Use **HieroKit** when:

- You are building application code (backend or React) and want:
  - Consistent flows
  - Safer defaults
  - Better DX and typing
- You prefer to think in "what" (transfer, create token, query account) rather
  than "how" (build and execute multiple SDK objects).

In practice, most apps can use HieroKit for 90% of work and drop down to the
SDK only for the few advanced cases where absolute control is required.

