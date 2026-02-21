# useAccountKeys

Read the key associated with an account.

## Import

```ts
import { useAccountKeys } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: Key | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountKeys } from "hierokit";

function AccountKey() {
  const { data: key, status } = useAccountKeys();
  if (status !== "success") return null;

  return <pre>{key ? key.toString() : "no key"}</pre>;
}
```

