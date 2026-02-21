# useTokenMetadata

Read high-level metadata for a token (name, symbol, memo, decimals).

## Import

```ts
import { useTokenMetadata } from "hierokit";
```

## Parameters

- `tokenId?: string | TokenId | null`

## Returns

```ts
{
  data: {
    name: string | null;
    symbol: string | null;
    memo: string | null;
    decimals: number | null;
  } | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTokenMetadata } from "hierokit";

function TokenHeader({ tokenId }: { tokenId: string }) {
  const { data, status } = useTokenMetadata(tokenId);
  if (status !== "success" || !data) return <p>Loading...</p>;

  return (
    <h2>
      {data.name} ({data.symbol}){data.memo ? ` – ${data.memo}` : ""}
    </h2>
  );
}
```

