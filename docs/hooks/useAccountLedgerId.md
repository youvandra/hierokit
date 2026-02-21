# useAccountLedgerId

Read the ledger ID associated with an account.

## Import

```ts
import { useAccountLedgerId } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: string | null; // ledger ID as a string
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountLedgerId } from "hierokit";

function AccountLedger() {
  const { data: ledgerId, status } = useAccountLedgerId();
  if (status !== "success") return null;

  return <span>{ledgerId ?? "n/a"}</span>;
}
```

