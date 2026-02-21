# useMultiTokenTransfer

Send multiple fungible token transfers in a single transaction.

## Import

```ts
import { useMultiTokenTransfer } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type MultiTokenTransferItem = {
  tokenId: string | TokenId;
  from?: string | AccountId;
  to: string | AccountId;
  amount: number;
};

type MultiTokenTransferArgs = {
  items: MultiTokenTransferItem[];
  memo?: string;
};
```

- If `from` is omitted for an item, the operator account is used.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: MultiTokenTransferArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useMultiTokenTransfer } from "hierokit";

function AirdropButton() {
  const { flow, execute } = useMultiTokenTransfer();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            items: [
              { tokenId: "0.0.5005", to: "0.0.1234", amount: 10 },
              { tokenId: "0.0.5006", to: "0.0.5678", amount: 20 },
            ],
            memo: "Promo drop",
          })
        }
      >
        Run airdrop
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

