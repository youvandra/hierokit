# Transaction intents

The transaction intent layer models commands as plain objects that can be
executed by the HieroKit client.

## `TransactionIntent`

```ts
import type { TransactionIntent } from "hierokit";

interface TransactionIntent<TParsed = unknown> {
  type: string;
  toTransaction(client: Client): Promise<Transaction> | Transaction;
  parse?(
    receipt: TransactionReceipt,
    record: TransactionRecord | null
  ): TParsed;
}
```

- `type` – free‑form string describing the intent, for logging or routing.
- `toTransaction` – constructs the underlying SDK transaction.
- `parse` – optional parser that turns receipt/record into a domain result.

## `runIntent(client, intent, options?)`

```ts
import { runIntent } from "hierokit";

type IntentResult<TParsed = unknown> = {
  handle: TransactionHandle;
  receipt: TransactionReceipt;
  record: TransactionRecord | null;
  parsed: TParsed | null;
};
```

`runIntent` ties the intent to the client, including retries and receipt
handling:

```ts
const intent = {
  type: "transfer-hbar",
  async toTransaction(client) {
    const sdk = client.raw;
    const tx = new TransferTransaction()
      .setTransactionMemo("Order #123");
    // configure tx...
    return tx;
  },
  parse(receipt) {
    return {
      status: receipt.status.toString(),
    };
  },
} satisfies TransactionIntent<{ status: string }>;

const result = await runIntent(client, intent, { timeout: 60_000 });
```

