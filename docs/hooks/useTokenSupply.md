# useTokenSupply

Read the total supply for a token.

## Import

```ts
import { useTokenSupply } from "hierokit";
```

## Parameters

- `tokenId?: string | TokenId | null`

## Returns

```ts
{
  data: Long | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTokenSupply } from "hierokit";

function TokenSupplyLine({ tokenId }: { tokenId: string }) {
  const { data, status } = useTokenSupply(tokenId);

  if (status !== "success" || !data) return <span>Loading...</span>;
  return <span>{data.toString()}</span>;
}
```

