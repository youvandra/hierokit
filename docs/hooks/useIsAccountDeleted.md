# useIsAccountDeleted

Check whether an account is marked as deleted.

## Import

```ts
import { useIsAccountDeleted } from "hierokit";
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
import { useIsAccountDeleted } from "hierokit";

function DeletedBadge() {
  const { data: deleted, status } = useIsAccountDeleted();
  if (status !== "success" || deleted == null) return null;

  return <span>{deleted ? "Deleted" : "Active"}</span>;
}
```

