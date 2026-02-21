# Client abstraction

The `Client` class wraps `@hiero-ledger/sdk` with a higher‑level
configuration and retry model.

## Network & operator

```ts
import { Client, type HieroConfig } from "hierokit";

const config: HieroConfig = {
  network: "testnet",
  operator: {
    accountId: "0.0.123",
    // optional: omit when using external signers only
    privateKey: process.env.HEDERA_PRIVATE_KEY!,
  },
  mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
};

const client = new Client(config);
```

`HieroConfig` also supports external signers:

```ts
const config: HieroConfig = {
  network: "testnet",
  signers: [externalSignerA, externalSignerB],
};
```

## Retry & timeout defaults

`HieroConfig`:

- `maxRetries?: number` – default max retries for transactions (default: `3`)
- `defaultTimeoutMs?: number` – default timeout for execution and receipts

Per‑call overrides:

- `TransactionOptions.maxRetries`
- `TransactionOptions.timeout`

Example:

```ts
const handle = await client.submit(tx, {
  maxRetries: 5,
  timeout: 120_000,
});
```

## External signer flows

When `signers` are provided, the client will:

1. Call `populateTransaction` for each signer
2. Call `checkTransaction` for each signer
3. Call `signTransaction` for each signer
4. Execute the transaction with built‑in retry handling

This makes it suitable for:

- browser / wallet signers
- hardware wallets
- multi‑sig setups
- scheduled transaction signers

