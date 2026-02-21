# Getting Started

## Installation

::: code-group

```bash [npm]
npm install hierokit @hiero-ledger/sdk
```

```bash [pnpm]
pnpm add hierokit @hiero-ledger/sdk
```

```bash [yarn]
yarn add hierokit @hiero-ledger/sdk
```

```bash [bun]
bun add hierokit @hiero-ledger/sdk
```

:::

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

## Using with Vue

HieroKit does not ship a Vue-specific layer, but you can use the core client
in any Vue 3 app (Composition API) and wrap it in your own composables.

```ts
// client.ts
import { Client } from "hierokit";

export const client = new Client({
  network: "testnet",
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID!,
    privateKey: process.env.HEDERA_PRIVATE_KEY!,
  },
});
```

```ts
// useAccountHbar.ts
import { ref, onMounted } from "vue";
import { AccountBalanceQuery, Hbar } from "@hiero-ledger/sdk";
import { client } from "./client";

export function useAccountHbar(accountId: string) {
  const hbar = ref<Hbar | null>(null);
  const loading = ref(true);

  onMounted(async () => {
    const query = new AccountBalanceQuery().setAccountId(accountId);
    const balance = await query.execute(client.raw as any);
    hbar.value = balance.hbars;
    loading.value = false;
  });

  return { hbar, loading };
}
```

Then in a Vue component:

```vue
<script setup lang="ts">
import { useAccountHbar } from "./useAccountHbar";

const { hbar, loading } = useAccountHbar("0.0.xxxx");
</script>

<template>
  <div>
    <span v-if="loading">Loading...</span>
    <span v-else>{{ hbar?.toString() }}</span>
  </div>
</template>
```

## Using with vanilla TypeScript

You can also use HieroKit directly in any TypeScript/JavaScript environment
without a framework. The Node example above is already valid "vanilla"
usage; in a browser bundler you would do the same:

```ts
import { Client } from "hierokit";

const client = new Client({
  network: "testnet",
  operator: {
    accountId: "0.0.xxxx",
    privateKey: "302e...",
  },
});

async function main() {
  const handle = await client.transferHbar("0.0.recipient", 10);
  const receipt = await handle.wait();
  console.log(receipt.status.toString());
}

main().catch(console.error);
```
