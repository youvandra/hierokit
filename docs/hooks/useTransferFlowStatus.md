# useTransferFlowStatus

Placeholder hook for looking up transfer flows by ID.

The current implementation does not yet integrate with any global flow
registry; it always returns static `"idle"` state and `null` data.

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
  data: FlowHandle<TransactionReceipt> | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTransferFlowStatus } from "hierokit";

function FlowDebug({ flowId }: { flowId: string }) {
  const { data, status } = useTransferFlowStatus({ flowId });
  return <pre>{JSON.stringify({ status, hasHandle: !!data }, null, 2)}</pre>;
}
```

