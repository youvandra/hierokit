# useLedgerId

Read the ledger ID associated with the current client.

## Import

```ts
import { useLedgerId } from "hierokit";
```

## Parameters

None.

## Returns

`LedgerId | null` – the SDK `LedgerId` instance or `null` if not set.

## Usage

```tsx
import { useLedgerId } from "hierokit";

function LedgerIdText() {
  const ledgerId = useLedgerId();

  return (
    <span>
      Ledger: {ledgerId ? ledgerId.toString() : "unknown"}
    </span>
  );
}
```

