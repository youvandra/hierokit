# useAccountExpiration

Read the expiration time for an account.

## Import

```ts
import { useAccountExpiration } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: Timestamp | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountExpiration } from "hierokit";

function ExpirationLine() {
  const { data: expiration, status } = useAccountExpiration();
  if (status !== "success" || !expiration) return null;

  return <span>{expiration.toDate().toISOString()}</span>;
}
```

