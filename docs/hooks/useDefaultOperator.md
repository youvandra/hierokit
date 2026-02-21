# useDefaultOperator

Read the operator configuration the client is using.

## Import

```ts
import { useDefaultOperator } from "hierokit";
```

## Parameters

None.

## Returns

`ClientOperator | null` – the SDK operator object or `null` if no operator is
configured.

## Usage

```tsx
import { useDefaultOperator } from "hierokit";

function OperatorBadge() {
  const operator = useDefaultOperator();

  if (!operator) return <span>No operator</span>;
  return <span>{operator.accountId.toString()}</span>;
}
```

