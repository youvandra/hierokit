# useFlowTimeout

Selector hook to read the timeout configured for a flow.

## Import

```ts
import { useFlowTimeout } from "hierokit";
```

## Parameters

- `handle: FlowHandle<TReceipt>`

## Returns

`number | null` – timeout in milliseconds, or `null` if no timeout is set.

## Usage

```tsx
import {
  useTransactionFlow,
  useFlowTimeout,
  type TransactionFlow,
} from "hierokit";

const flow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.recipient", 10);
  return handle.wait();
};

function TimeoutLabel() {
  const handle = useTransactionFlow(flow, { timeoutMs: 60_000 });
  const timeoutMs = useFlowTimeout(handle);

  return <span>Timeout: {timeoutMs ?? "none"}</span>;
}
```
