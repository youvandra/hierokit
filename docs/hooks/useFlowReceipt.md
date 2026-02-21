# useFlowReceipt

Selector hook to read the receipt/result from a flow handle.

## Import

```ts
import { useFlowReceipt } from "hierokit";
```

## Parameters

- `handle: FlowHandle<TReceipt>`

## Returns

`TReceipt | null` – the result produced by the flow, or `null` if the flow has
not completed successfully.

## Usage

```tsx
import {
  useTransactionFlow,
  useFlowReceipt,
  type TransactionFlow,
} from "hierokit";

const flow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.12345", 10);
  return handle.wait();
};

function ReceiptPanel() {
  const handle = useTransactionFlow(flow);
  const receipt = useFlowReceipt(handle);

  if (!receipt) return <p>No receipt yet</p>;
  return <pre>{receipt.status.toString()}</pre>;
}
```

