# useAccountNFTs

Query NFTs owned by an account via the configured mirror node.

## Import

```ts
import { useAccountNFTs } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: unknown[] | null; // items from the mirror node response
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Requirements

- `mirrorNodeUrl` must be set in `HieroConfig`.

## Usage

```tsx
import { useAccountNFTs } from "hierokit";

function NFTGrid() {
  const { data, status, error, refresh } = useAccountNFTs();

  if (status === "loading") return <p>Loading NFTs...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return <p>No NFTs</p>;

  return (
    <div>
      <ul>
        {data.map((nft, i) => (
          <li key={i}>{JSON.stringify(nft)}</li>
        ))}
      </ul>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

