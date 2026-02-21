# useTransferHistory

Placeholder hook for querying historical transfers.

The current implementation is a stub which reserves the API surface for future
mirror-node backed history queries.

## Import

```ts
import { useTransferHistory } from "hierokit";
```

## Parameters

```ts
type TransferHistoryArgs = {
  accountId: string | AccountId;
};
```

Pass `null` to disable the hook.

## Returns

```ts
{
  data: unknown[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTransferHistory } from "hierokit";

function HistoryPanel({ accountId }: { accountId: string }) {
  const { data, status } = useTransferHistory({ accountId });
  return <pre>{JSON.stringify({ status, data }, null, 2)}</pre>;
}
```

