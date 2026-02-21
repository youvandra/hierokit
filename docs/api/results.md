# Receipt & result normalization

HieroKit exposes helpers to normalize transaction receipts and records
into small plain objects that are easier to log or serialize.

## `normalizeReceipt(receipt)`

```ts
import { normalizeReceipt } from "hierokit";

type NormalizedReceipt = {
  status: string;
  success: boolean;
  transactionId?: string;
  accountId?: string;
  contractId?: string;
  topicId?: string;
  tokenId?: string;
  scheduleId?: string;
};
```

Example:

```ts
const handle = await client.submit(tx);
const receipt = await handle.wait();
const normalized = normalizeReceipt(receipt);
```

## `normalizeRecord(record)`

```ts
import { normalizeRecord } from "hierokit";

type NormalizedRecord = NormalizedReceipt & {
  consensusTimestamp?: string;
  memo?: string;
};
```

Use when you request transaction records in addition to receipts.

