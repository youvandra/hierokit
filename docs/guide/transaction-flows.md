# Transaction flow abstraction

On the Node side, HieroKit exposes a small flow helper in addition to the
React hooks.

## `client.prepareFlow(factory, options?)`

```ts
const flow = client.prepareFlow(
  (sdk) => {
    const tx = new TransferTransaction()
      .setTransactionMemo("Hello HieroKit");
    // configure tx...
    return tx;
  },
  {
    timeout: 60_000,
    maxRetries: 3,
  }
);
```

The returned object exposes the lifecycle explicitly:

```ts
const prepared = await flow.prepare();       // construct transaction
const signed = await flow.sign();           // apply external signers, if any
const handle = await flow.submit();         // submit + retry handling
const receipt = await flow.waitForReceipt();// wait for finality
```

This mirrors the conceptual steps:

1. **prepare()** – build the transaction using the raw SDK client
2. **sign()** – apply external or multi‑sig signers
3. **submit()** – submit with retry handling
4. **waitForReceipt()** – wait for consensus and get a receipt

## Canonical Node‑only example

```ts
import {
  Client,
  normalizeReceipt,
  normalizeError,
} from "hierokit";
import {
  TransferTransaction,
  Hbar,
} from "@hiero-ledger/sdk";

const client = new Client({
  network: "testnet",
  operator: {
    accountId: process.env.HEDERA_ACCOUNT_ID!,
    privateKey: process.env.HEDERA_PRIVATE_KEY!,
  },
  defaultTimeoutMs: 60_000,
  maxRetries: 3,
});

const flow = client.prepareFlow(
  () => {
    return new TransferTransaction()
      .addHbarTransfer("0.0.alice", new Hbar(-10))
      .addHbarTransfer("0.0.bob", new Hbar(10))
      .setTransactionMemo("order:123");
  },
  {
    timeout: 60_000,
    maxRetries: 3,
  }
);

async function main() {
  try {
    const receipt = await flow.waitForReceipt();
    const normalized = normalizeReceipt(receipt);
    console.log(normalized);
  } catch (err) {
    const normalized = normalizeError(err);
    console.error(normalized.code, normalized.message);
  }
}

main().catch((err) => {
  console.error(err);
});
```
