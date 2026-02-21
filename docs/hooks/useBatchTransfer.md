# useBatchTransfer

Send multiple HBAR transfers in a single transaction.

## Import

```ts
import { useBatchTransfer } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type BatchTransferItem = {
  to: string | AccountId;
  amount: number | Hbar;
};

type BatchTransferArgs = {
  items: BatchTransferItem[];
  memo?: string;
};
```

- The operator account is debited for the sum of all `amount` values.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: BatchTransferArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useBatchTransfer } from "hierokit";

function PayrollButton() {
  const { flow, execute } = useBatchTransfer();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            items: [
              { to: "0.0.alice", amount: 5 },
              { to: "0.0.bob", amount: 7 },
            ],
            memo: "Weekly payout",
          })
        }
      >
        Run payroll
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```
