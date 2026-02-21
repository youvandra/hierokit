# useTransferHbar

Send a single HBAR transfer using a flow-aware hook.

## Import

```ts
import { useTransferHbar } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

  Passed through to the underlying `useTransactionFlow`:

  - `timeoutMs?: number`

## Execute arguments

The hook returns an `execute` function that accepts:

```ts
type TransferHbarArgs = {
  to: string | AccountId;
  amount: number | Hbar;
  memo?: string;
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: TransferHbarArgs) => Promise<void>;
}
```

Use the `flow` handle to read status and receipt.

## Usage

```tsx
import { useTransferHbar } from "hierokit";

function SendHbar() {
  const { flow, execute } = useTransferHbar({ timeoutMs: 60_000 });

  return (
    <div>
      <button
        onClick={() =>
          execute({
            to: "0.0.recipient",
            amount: 10,
            memo: "Hello HieroKit",
          })
        }
        disabled={flow.status === "submitting"}
      >
        Send 10 ℏ
      </button>
      {flow.status === "success" && (
        <p>{flow.receipt?.status.toString()}</p>
      )}
    </div>
  );
}
```
