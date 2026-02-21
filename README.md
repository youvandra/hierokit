# HieroKit

A developer experience (DX) toolkit for building on the Hiero/Hedera network.

![HieroKit](docs/public/logo.png) (Coming soon)

## Overview

HieroKit sits on top of the official `@hiero-ledger/sdk` and provides a cleaner, opinionated, and production-ready API for interacting with the network. It simplifies complex interactions, handles transaction lifecycles, and encodes best practices.

**HieroKit is NOT**:
- A blockchain node.
- A CLI tool.
- A replacement for the Hiero SDK (it wraps it).

## Features

- **Simplified Client Setup**: Configure network and operator in one place.
- **Explicit Lifecycle**: Submit -> Wait -> Receipt flow is clear and manageable.
- **Built-in Retries**: Automatic handling of transient network errors.
- **Type-Safe**: Written in TypeScript with full type definitions.

## Installation

```bash
npm install hierokit @hiero-ledger/sdk
```

## Quick Start (Node / backend)

```typescript
import { Client } from "hierokit";

// Initialize the client
const client = new Client({
  network: "testnet",
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID,
    privateKey: process.env.HEDERA_PRIVATE_KEY,
  },
});

// Transfer HBAR
async function main() {
  console.log("Transferring HBAR...");
  
  const handle = await client.transferHbar("0.0.12345", 10, "Hello HieroKit");
  console.log(`Transaction ID: ${handle.transactionId}`);
  
  const receipt = await handle.wait();
  console.log(`Status: ${receipt.status.toString()}`);
}

main().catch(console.error);
```

## Quick Start (React)

HieroKit includes first‑class React support via hooks:

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

## Documentation

Visit our documentation site at [https://youvandra.github.io/hierokit](https://youvandra.github.io/hierokit) (or run locally with `npm run docs:dev`).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

Apache 2.0
