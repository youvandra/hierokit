# useTransferPreview

Placeholder hook for building pre-transfer UI previews.

The current implementation does not perform any network calls and always
returns static `"idle"` state. It exists to reserve the API and docs for more
advanced preview flows.

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
  data: null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useTransferPreview } from "hierokit";

function PreviewPanel() {
  const { status } = useTransferPreview(null);
  return <p>Status: {status}</p>;
}
```

