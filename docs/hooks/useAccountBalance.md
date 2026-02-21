# useAccountBalance

Query the full balance for an account.

## Import

```ts
import { useAccountBalance } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: AccountBalance | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountBalance } from "hierokit";

function BalanceLine() {
  const { data, status } = useAccountBalance();

  if (status !== "success" || !data) return <span>Loading...</span>;
  return <span>{data.hbars.toString()}</span>;
}
```

