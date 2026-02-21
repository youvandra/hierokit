# useAllowanceStatus

Placeholder hook for querying allowance status.

The current implementation returns static `"idle"` state; it exists to reserve
the API and documentation shape for future mirror-node integrations.

## Import

```ts
import { useAllowanceStatus } from "hierokit";
```

## Parameters

```ts
type AllowanceStatusArgs = {
  owner: string | AccountId;
};
```

Pass `null` to disable the query.

## Returns

```ts
{
  data: {
    hbarAllowances: unknown[];
    tokenAllowances: unknown[];
    nftAllowances: unknown[];
  } | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

Currently `data` is always `null`.

## Usage

```tsx
import { useAllowanceStatus } from "hierokit";

function AllowancePanel() {
  const { data, status } = useAllowanceStatus({ owner: "0.0.1001" });

  return <pre>{JSON.stringify({ status, data }, null, 2)}</pre>;
}
```

