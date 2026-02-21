# useBurnNft

Burn one or more NFTs by serial.

## Import

```ts
import { useBurnNft } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseBurnNftArgs = {
  tokenId: string | TokenId;
  serials: number[];
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseBurnNftArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useBurnNft } from "hierokit";

function BurnNftButton({ tokenId, serial }: { tokenId: string; serial: number }) {
  const { flow, execute } = useBurnNft();

  return (
    <div>
      <button onClick={() => execute({ tokenId, serials: [serial] })}>
        Burn NFT #{serial}
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

