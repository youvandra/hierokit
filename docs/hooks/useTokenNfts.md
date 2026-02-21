# useTokenNfts

Query NFT infos for a given token ID.

## Import

```ts
import { useTokenNfts } from "hierokit";
```

## Parameters

- `tokenId?: string | TokenId | null`

## Returns

```ts
{
  data: TokenNftInfo[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTokenNfts } from "hierokit";

function NftList({ tokenId }: { tokenId: string }) {
  const { data, status, error, refresh } = useTokenNfts(tokenId);

  if (status === "loading") return <p>Loading NFTs...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return <p>No NFTs</p>;

  return (
    <div>
      <ul>
        {data.map((nft) => (
          <li key={nft.nftId.toString()}>
            {nft.nftId.toString()} – owner {nft.accountId?.toString()}
          </li>
        ))}
      </ul>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

