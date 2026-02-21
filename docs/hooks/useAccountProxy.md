# useAccountProxy

Read the legacy proxy staking account for an account (deprecated at the
protocol level but still present in `AccountInfo`).

## Import

```ts
import { useAccountProxy } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: AccountId | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountProxy } from "hierokit";

function ProxyInfo() {
  const { data: proxy, status } = useAccountProxy();
  if (status !== "success") return null;

  return <span>{proxy?.toString() ?? "no proxy"}</span>;
}
```

