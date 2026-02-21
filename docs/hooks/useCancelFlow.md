# useCancelFlow

Selector hook to access the `cancel` function on a flow handle.

## Import

```ts
import { useCancelFlow } from "hierokit";
```

## Parameters

- `handle: FlowHandle<TReceipt>`

## Returns

`() => void` – a function that marks the flow as cancelled.

Cancelling does not abort network calls in flight, but it prevents the flow
from transitioning to `success` or `error` once complete and sets the status to
`"cancelled"` instead for UI purposes.

## Usage

```tsx
import {
  useTransactionFlow,
  useCancelFlow,
  useFlowStatus,
  type TransactionFlow,
} from "hierokit";

const flow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.12345", 10);
  return handle.wait();
};

function CancelButton() {
  const handle = useTransactionFlow(flow);
  const status = useFlowStatus(handle);
  const cancel = useCancelFlow(handle);

  return (
    <button onClick={() => cancel()} disabled={status !== "submitting"}>
      Cancel
    </button>
  );
}
```

