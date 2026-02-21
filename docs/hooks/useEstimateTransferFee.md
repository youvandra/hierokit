# useEstimateTransferFee

Estimate the fee for a simple balance query, as a proxy for transfer cost.

The current implementation uses `AccountBalanceQuery.getCost()` against the
configured account or operator.

## Import

```ts
import { useEstimateTransferFee } from "hierokit";
```

## Parameters

```ts
type EstimateTransferFeeArgs = {
  accountId?: string | AccountId;
};
```

Pass `null` to disable estimation.

## Returns

```ts
{
  data: Hbar | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useEstimateTransferFee } from "hierokit";

function FeeEstimate() {
  const { data, status, refresh } = useEstimateTransferFee({});

  return (
    <div>
      <button onClick={refresh}>Estimate fee</button>
      <p>
        {status === "success" && data
          ? data.toString()
          : status === "loading"
          ? "Estimating..."
          : "Idle"}
      </p>
    </div>
  );
}
```

