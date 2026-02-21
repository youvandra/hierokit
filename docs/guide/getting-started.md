# Getting Started

## Installation

```bash
npm install hierokit @hashgraph/sdk
```

## Basic Usage

```typescript
import { Client } from "hierokit";

const client = new Client({
  network: "testnet",
  operator: {
    accountId: "0.0.12345",
    privateKey: "302e...",
  },
});

// Transfer HBAR
const handle = await client.transferHbar("0.0.54321", 10);
const receipt = await handle.wait();

console.log(`Transaction status: ${receipt.status.toString()}`);
```
