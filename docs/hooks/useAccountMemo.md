# useAccountMemo

Read the memo string for an account.

## Import

```ts
import { useAccountMemo } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: string | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountMemo } from "hierokit";

function MemoLine() {
  const { data: memo, status } = useAccountMemo();
  if (status !== "success") return null;

  return <span>{memo ?? "(no memo)"}</span>;
}
```

