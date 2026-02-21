# useMintFungibleToken

Mint additional units of a fungible token.

## Import

```ts
import { useMintFungibleToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseMintFungibleTokenArgs = {
  tokenId: string | TokenId;
  amount: number;
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseMintFungibleTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useMintFungibleToken } from "hierokit";

function MintButton({ tokenId }: { tokenId: string }) {
  const { flow, execute } = useMintFungibleToken();

  return (
    <div>
      <button onClick={() => execute({ tokenId, amount: 1000 })}>
        Mint 1000 units
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

