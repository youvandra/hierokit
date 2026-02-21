# useTransferFlowStatus

Mirror-backed hook for looking up transaction status by transaction ID.

## Import

```ts
import { useTransferFlowStatus } from "hierokit";
```

## Parameters

```ts
type TransferFlowStatusArgs = {
  flowId: string;
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

`MirrorTransaction` matches the mirror node REST API transaction shape:

```ts
interface MirrorTransfer {
  account: string;
  amount: number;
  is_approval: boolean;
}

interface MirrorTokenTransfer {
  token_id: string;
  account: string;
  amount: number;
  is_approval: boolean;
}

interface MirrorTransaction {
  transaction_id: string;
  consensus_timestamp: string;
  name: string;
  result: string;
  transfers: MirrorTransfer[];
  token_transfers: MirrorTokenTransfer[];
}
```

## Usage

```tsx
import { useTransferFlowStatus } from "hierokit";

function FlowDebug({ flowId }: { flowId: string }) {
  const { data, status, refresh } = useTransferFlowStatus({ flowId });

  return (
    <div>
      <button onClick={refresh}>Refresh status</button>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```
