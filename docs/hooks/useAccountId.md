# useAccountId

Resolve the current account ID, defaulting to the client's operator.

## Import

```ts
import { useAccountId } from "hierokit";
```

## Parameters

None.

## Returns

`AccountId | null` – the resolved account ID, or `null` if the client has no
operator configured.

## Usage

```tsx
import { useAccountId } from "hierokit";

function CurrentAccount() {
  const accountId = useAccountId();
  return <span>{accountId?.toString() ?? "no operator"}</span>;
}
```

