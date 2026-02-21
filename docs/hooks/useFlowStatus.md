# useFlowStatus

Selector hook to read the status from a flow handle.

## Import

```ts
import { useFlowStatus } from "hierokit";
```

## Parameters

- `handle: FlowHandle<TReceipt>`

  A handle returned from `useTransactionFlow` or `useCreateFlow`.

## Returns

`FlowStatus`:

```ts
"idle" | "preparing" | "submitting" |
"success" | "error" | "cancelled" | "timeout";
```

## Usage

```tsx
import {
  useTransactionFlow,
  useFlowStatus,
  type TransactionFlow,
} from "hierokit";

const flow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.recipient", 10);
  return handle.wait();
};

function FlowStatusLine() {
  const handle = useTransactionFlow(flow);
  const status = useFlowStatus(handle);

  return <span>Status: {status}</span>;
}
```
