# useRetryFlow

Selector hook to access the `retry` function on a flow handle.

## Import

```ts
import { useRetryFlow } from "hierokit";
```

## Parameters

- `handle: FlowHandle<TReceipt>`

## Returns

`() => Promise<void>` – a function that re‑runs the flow.

## Usage

```tsx
import {
  useTransactionFlow,
  useRetryFlow,
  useFlowStatus,
  type TransactionFlow,
} from "hierokit";

const flow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.12345", 10);
  return handle.wait();
};

function RetryButton() {
  const handle = useTransactionFlow(flow);
  const status = useFlowStatus(handle);
  const retry = useRetryFlow(handle);

  return (
    <button onClick={() => retry()} disabled={status === "submitting"}>
      Retry
    </button>
  );
}
```

