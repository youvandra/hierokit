# Idempotency and replay safety

HieroKit builds on the underlying SDK's idempotency model. This guide
outlines the recommended patterns.

## Transaction IDs as idempotency keys

Use a stable mapping between your business keys and transaction IDs:

1. Generate a unique business identifier, such as `orderId`.
2. Persist a mapping `orderId -> transactionId` in your database.
3. On retries for the same `orderId`, reuse the same `transactionId`.

The Hedera network treats duplicate transactions with the same ID as the
same logical transaction, which avoids double‑spend within the valid
window for that ID.

## Memos as application‑level deduplication

You can also incorporate idempotency keys into the transaction memo:

```ts
const memo = `order:${orderId}`;
const tx = new TransferTransaction().setTransactionMemo(memo);
```

On the backend, you can read receipts or mirror data and deduplicate
based on the memo prefix and business key.

## Using flows and intents

When using `client.prepareFlow` or `runIntent`:

- Keep the transaction creation pure and driven by your business key.
- Persist the mapping from key to transactionId and status.
- On retries, either:
  - Recreate the same transaction with the same ID, or
  - Short‑circuit if a successful receipt already exists.

Combining stable transaction IDs with memo‑based deduplication gives a
robust idempotency story for payment or order flows.

