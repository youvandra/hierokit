# useTransferHistory

Mirror-backed hook for querying historical transfers for an account.

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
  data: MirrorTransaction[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

See `useTransferFlowStatus` for the `MirrorTransaction` interface.

## Usage

```tsx
import { useTransferHistory } from "hierokit";

function HistoryPanel({ accountId }: { accountId: string }) {
  const { data, status, refresh } = useTransferHistory({ accountId });

  return (
    <div>
      <button onClick={refresh}>Load history</button>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```
