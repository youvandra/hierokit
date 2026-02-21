# useHieroConfig

Read the `HieroConfig` that was passed to `HieroProvider`.

## Import

```ts
import { useHieroConfig } from "hierokit";
```

## Parameters

None.

## Returns

`HieroConfig` – the configuration object used to construct the client.

## Usage

```tsx
import { useHieroConfig } from "hierokit";

function ConfigDebug() {
  const config = useHieroConfig();

  return (
    <pre>{JSON.stringify(config, null, 2)}</pre>
  );
}
```

