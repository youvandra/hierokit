# useCreateFlow

Create a transaction flow handle without auto‑starting it.

## Import

```ts
import {
  useCreateFlow,
  type TransactionFlow,
} from "hierokit";
```

## Parameters

- `intent: TransactionFlow<TReceipt>`
- `options?: { timeoutMs?: number }`

`useCreateFlow` is a thin wrapper over `useTransactionFlow` that always sets
`autoStart: false`.

## Returns

Same `FlowHandle<TReceipt>` shape as `useTransactionFlow`:

```ts
{
  id: string;
  status: FlowStatus;
  receipt: TReceipt | null;
  error: unknown | null;
  start: () => Promise<void>;
  retry: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
  timeoutMs: number | null;
}
```

## Usage

```tsx
import {
  useCreateFlow,
  type TransactionFlow,
} from "hierokit";

const transferFlow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.12345", 10);
  return handle.wait();
};

function ManualFlow() {
  const flow = useCreateFlow(transferFlow, { timeoutMs: 60_000 });

  return (
    <div>
      <button onClick={() => flow.start()}>Run flow</button>
      <button onClick={() => flow.retry()}>Retry</button>
      <button onClick={() => flow.reset()}>Reset</button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

