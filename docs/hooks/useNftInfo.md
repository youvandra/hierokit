# useNftInfo

Query NFT info for a specific NFT (token ID + serial).

## Import

```ts
import { useNftInfo } from "hierokit";
```

## Parameters

- `nftId?: string | NftId | null`

  Use the canonical `"tokenId/serial"` string form for convenience.

## Returns

```ts
{
  data: TokenNftInfo[] | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

`data` is an array because the underlying query type returns a list. For single
NFT lookups, it typically contains one element.

## Usage

```tsx
import { useNftInfo } from "hierokit";

function NftDetails({ nftId }: { nftId: string }) {
  const { data, status, error } = useNftInfo(nftId);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data || !data[0]) return <p>Not found</p>;

  const info = data[0];

  return (
    <div>
      <div>ID: {info.nftId.toString()}</div>
      <div>Owner: {info.accountId?.toString()}</div>
      <div>Metadata size: {info.metadata?.length ?? 0} bytes</div>
    </div>
  );
}
```

