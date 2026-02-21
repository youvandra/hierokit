# Error normalization

HieroKit provides helpers to normalize errors from the underlying
`@hiero-ledger/sdk` into a simpler shape.

## `normalizeError(err)`

```ts
import { normalizeError } from "hierokit";

type HieroErrorCode =
  | "NETWORK"
  | "PRECHECK"
  | "RECEIPT"
  | "TIMEOUT"
  | "UNKNOWN";

interface HieroError {
  code: HieroErrorCode;
  message: string;
  status?: Status;
  cause?: unknown;
  retryable: boolean;
}
```

Use `normalizeError` to turn any thrown error into a `HieroError`:

```ts
try {
  const receipt = await client.execute(tx);
} catch (err) {
  const normalized = normalizeError(err);
  console.error(normalized.code, normalized.message);
}
```

## `isRetryableError(err)`

```ts
import { isRetryableError } from "hierokit";
```

Returns `true` when the error represents a transient network or status
that may succeed on retry (for example `Status.Busy`), otherwise `false`.

