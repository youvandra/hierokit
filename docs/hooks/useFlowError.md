# useFlowError

Selector hook to read the last error from a flow handle.

## Import

```ts
import { useFlowError } from "hierokit";
```

## Parameters

- `handle: FlowHandle<TReceipt>`

## Returns

`unknown | null` – the last error thrown by the flow, or `null`.

## Usage

```tsx
import {
  useTransactionFlow,
  useFlowError,
  type TransactionFlow,
} from "hierokit";

const flow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.12345", 10);
  return handle.wait();
};

function ErrorBanner() {
  const handle = useTransactionFlow(flow);
  const error = useFlowError(handle);

  if (!error) return null;
  return <div>{String(error)}</div>;
}
```

