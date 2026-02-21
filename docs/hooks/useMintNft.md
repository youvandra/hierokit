# useMintNft

Mint one or more NFTs for a given NFT token.

## Import

```ts
import { useMintNft } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseMintNftArgs = {
  tokenId: string | TokenId;
  metadata: (Uint8Array | string)[];
};
```

Each entry in `metadata` becomes a new NFT. Strings are encoded as UTF‑8
internally.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseMintNftArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useMintNft } from "hierokit";

function MintNftButton({ tokenId }: { tokenId: string }) {
  const { flow, execute } = useMintNft();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            tokenId,
            metadata: ['{ "name": "Demo NFT #1" }'],
          })
        }
      >
        Mint NFT
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

