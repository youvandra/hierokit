# Getting Started

## Installation

```bash
npm install hierokit @hiero-ledger/sdk
```

## Basic Usage (Node / backend)

```typescript
import { Client } from "hierokit";

const client = new Client({
  network: "testnet",
  operator: {
    accountId: "0.0.xxxx",
    privateKey: "302e...",
  },
});

// Transfer HBAR
const handle = await client.transferHbar("0.0.yyyy", 10);
const receipt = await handle.wait();

console.log(`Transaction status: ${receipt.status.toString()}`);
```

## Basic Usage (React)

If you are building a React app, you can use the built‑in hooks layer:

```tsx
import {
  HieroProvider,
  useAccountId,
  useAccountHbarBalance,
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

export function AppRoot() {
  return (
    <HieroProvider config={config}>
      <AccountSummary />
    </HieroProvider>
  );
}
```
