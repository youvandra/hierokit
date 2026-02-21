# useAccountHbarBalance

Query only the HBAR balance for an account.

## Import

```ts
import { useAccountHbarBalance } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: Hbar | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountHbarBalance } from "hierokit";

function HbarBalance() {
  const { data: hbar, status } = useAccountHbarBalance();

  if (status !== "success" || !hbar) return <span>Loading...</span>;
  return <span>{hbar.toString()}</span>;
}
```

