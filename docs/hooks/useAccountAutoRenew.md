# useAccountAutoRenew

Read auto‑renew configuration for an account.

## Import

```ts
import { useAccountAutoRenew } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: { autoRenewPeriod: Duration | null } | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountAutoRenew } from "hierokit";

function AutoRenewLine() {
  const { data, status } = useAccountAutoRenew();
  if (status !== "success" || !data) return null;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

