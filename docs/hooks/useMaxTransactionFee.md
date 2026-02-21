# useMaxTransactionFee

Read the default maximum transaction fee for the client.

## Import

```ts
import { useMaxTransactionFee } from "hierokit";
```

## Parameters

None.

## Returns

`Hbar | null` – the default max transaction fee, or `null` if the client is
using SDK defaults.

## Usage

```tsx
import { useMaxTransactionFee } from "hierokit";

function FeeLimit() {
  const fee = useMaxTransactionFee();
  return <span>{fee ? fee.toString() : "SDK default"}</span>;
}
```

