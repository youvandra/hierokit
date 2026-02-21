# Fees and cost surface

HieroKit exposes helpers to work with the SDK cost APIs and transaction
records.

## `estimateExecutableCost(client, executable)`

```ts
import { estimateExecutableCost } from "hierokit";
import {
  AccountBalanceQuery,
} from "@hiero-ledger/sdk";

const query = new AccountBalanceQuery().setAccountId("0.0.123");
const cost = await estimateExecutableCost(client, query);
```

This wraps `executable.getCost(client.raw)` and returns an `Hbar` cost.

## `extractFeeFromRecord(record)`

```ts
import { extractFeeFromRecord } from "hierokit";

type FeeBreakdown = {
  maxFee: Hbar | null;
  chargedFee: Hbar | null;
};
```

Given a `TransactionRecord`, returns the configured max transaction fee
and the charged fee when available.
