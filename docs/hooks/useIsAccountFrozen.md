# useIsAccountFrozen

Check whether an account effectively behaves as "frozen" by requiring the
receiver's signature for transfers.

## Import

```ts
import { useIsAccountFrozen } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: boolean | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useIsAccountFrozen } from "hierokit";

function FrozenBadge() {
  const { data: frozen, status } = useIsAccountFrozen();
  if (status !== "success" || frozen == null) return null;

  return <span>{frozen ? "Requires signature" : "Open"}</span>;
}
```

