# useTransferPreview

Hook for estimating the network fee for an HBAR transfer before submitting it.

## Import

```ts
import { useTransferPreview } from "hierokit";
```

## Parameters

```ts
type TransferPreviewArgs = {
  to: string | AccountId;
  amount: number | Hbar;
  memo?: string;
};
```

Pass `null` to disable the hook.

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
import { useTransferPreview } from "hierokit";

function PreviewPanel() {
  const { data, status, refresh } = useTransferPreview({
    to: "0.0.recipient",
    amount: 1,
  });

  return (
    <div>
      <button onClick={refresh}>Estimate fee</button>
      <p>Status: {status}</p>
      <p>Estimated fee: {data ? data.toString() : "–"}</p>
    </div>
  );
}
```
