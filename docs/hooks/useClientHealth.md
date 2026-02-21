# useClientHealth

Read a coarse health indicator for the underlying client.

## Import

```ts
import { useClientHealth } from "hierokit";
```

## Parameters

None.

## Returns

`"ready" | "unknown"`

- `"ready"` – client is active
- `"unknown"` – client has been shut down

## Usage

```tsx
import { useClientHealth } from "hierokit";

function HealthIndicator() {
  const health = useClientHealth();
  return <span>{health}</span>;
}
```

