# useScheduledTransfer

Run a transfer flow that can be triggered later from UI.

`useScheduledTransfer` has the same argument shape as `useTransferHbar`, but is
named to emphasize that the transfer is only executed when you call
`execute()`.

## Import

```ts
import { useScheduledTransfer } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type ScheduledTransferArgs = {
  to: string | AccountId;
  amount: number | Hbar;
  memo?: string;
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: ScheduledTransferArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useScheduledTransfer } from "hierokit";

function ConfirmThenSend() {
  const { flow, execute } = useScheduledTransfer();

  async function onConfirm() {
    await execute({
      to: "0.0.recipient",
      amount: 1,
      memo: "Scheduled payout",
    });
  }

  return (
    <div>
      <button onClick={onConfirm}>Confirm & send</button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```
