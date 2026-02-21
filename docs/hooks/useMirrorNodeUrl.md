# useMirrorNodeUrl

Read the mirror REST API base URL configured for the client.

## Import

```ts
import { useMirrorNodeUrl } from "hierokit";
```

## Parameters

None.

## Returns

`string | null` – the base URL or `null` if no mirror network is configured.

## Usage

```tsx
import { useMirrorNodeUrl } from "hierokit";

function MirrorInfo() {
  const url = useMirrorNodeUrl();
  return <span>{url ?? "no mirror configured"}</span>;
}
```

