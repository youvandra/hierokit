# useAccountStakingInfo

Read staking metadata for an account.

## Import

```ts
import { useAccountStakingInfo } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: { stakingInfo: StakingInfo | null } | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountStakingInfo } from "hierokit";

function StakingPanel() {
  const { data, status } = useAccountStakingInfo();
  if (status !== "success") return null;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

