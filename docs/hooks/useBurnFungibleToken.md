# useBurnFungibleToken

Burn units of a fungible token to reduce supply.

## Import

```ts
import { useBurnFungibleToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseBurnFungibleTokenArgs = {
  tokenId: string | TokenId;
  amount: number;
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseBurnFungibleTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useBurnFungibleToken } from "hierokit";

function BurnButton({ tokenId }: { tokenId: string }) {
  const { flow, execute } = useBurnFungibleToken();

  return (
    <div>
      <button onClick={() => execute({ tokenId, amount: 100 })}>
        Burn 100 units
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

