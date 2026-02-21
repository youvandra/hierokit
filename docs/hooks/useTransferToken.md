# useTransferToken

Send a fungible token transfer using a flow-aware hook.

## Import

```ts
import { useTransferToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

  Passed through to `useTransactionFlow`:

  - `timeoutMs?: number`

## Execute arguments

```ts
type TransferTokenArgs = {
  tokenId: string | TokenId;
  from?: string | AccountId;
  to: string | AccountId;
  amount: number;
};
```

- If `from` is omitted, the client's operator account is used.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: TransferTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useTransferToken } from "hierokit";

function SendToken() {
  const { flow, execute } = useTransferToken();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            tokenId: "0.0.5005",
            to: "0.0.12345",
            amount: 100,
          })
        }
      >
        Send 100 units
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

