# useClientStatus

Read the high‑level status of the React client environment.

## Import

```ts
import { useClientStatus } from "hierokit";
```

## Parameters

None.

## Returns

`"idle" | "ready"`

- `"ready"` – client was constructed by `HieroProvider`
- `"idle"` – reserved for future async initialization flows

## Usage

```tsx
import { useClientStatus } from "hierokit";

function ClientStatusDot() {
  const status = useClientStatus();

  return <span>{status}</span>;
}
```

