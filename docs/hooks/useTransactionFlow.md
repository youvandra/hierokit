# useTransactionFlow

Run a transaction flow in React and track its lifecycle.

## Import

```ts
import {
  useTransactionFlow,
  type TransactionFlow,
} from "hierokit";
```

## Parameters

- `flow: TransactionFlow<TReceipt> | null`

  A function that receives the HieroKit `Client` and returns a promise:

  ```ts
  type TransactionFlow<TReceipt = TransactionReceipt> =
    (client: Client) => Promise<TReceipt>;
  ```

- `options?: { autoStart?: boolean; timeoutMs?: number }`

  - `autoStart` – if `true`, the flow starts immediately when the hook mounts.
  - `timeoutMs` – optional timeout; marks the flow as `"timeout"` if exceeded.

## Returns

```ts
{
  id: string;
  status: "idle" | "preparing" | "submitting" | "success" |
          "error" | "cancelled" | "timeout";
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
  useTransactionFlow,
  type TransactionFlow,
} from "hierokit";

const transferFlow: TransactionFlow = async (client) => {
  const handle = await client.transferHbar("0.0.recipient", 10, "Hello HieroKit");
  const receipt = await handle.wait();
  return receipt;
};

function TransferButton() {
  const flow = useTransactionFlow(transferFlow, {
    autoStart: false,
    timeoutMs: 60_000,
  });

  return (
    <div>
      <button
        onClick={() => flow.start()}
        disabled={flow.status === "submitting"}
      >
        Transfer 10 ℏ
      </button>

      {flow.status === "success" && (
        <p>Done: {flow.receipt?.status.toString()}</p>
      )}
      {flow.status === "error" && <p>Error: {String(flow.error)}</p>}
      {flow.status === "timeout" && <p>Timed out</p>}
    </div>
  );
}
```
