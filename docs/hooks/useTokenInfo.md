# useTokenInfo

Query full on-chain metadata for a token.

## Import

```ts
import { useTokenInfo } from "hierokit";
```

## Parameters

- `tokenId?: string | TokenId | null`

## Returns

```ts
{
  data: TokenInfo | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTokenInfo } from "hierokit";

function TokenInfoPanel({ tokenId }: { tokenId: string }) {
  const { data, status, error, refresh } = useTokenInfo(tokenId);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return null;

  return (
    <div>
      <div>Name: {data.name}</div>
      <div>Symbol: {data.symbol}</div>
      <div>Total supply: {data.totalSupply?.toString()}</div>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

