# useNetworkAddressBook

Fetch the network address book using the configured Hiero client.

## Import

```ts
import { useNetworkAddressBook } from "hierokit";
```

## Parameters

None.

## Returns

```ts
{
  data: NodeAddressBook | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

- `data` – the resolved `NodeAddressBook` instance, or `null` before load.
- `status` – query lifecycle status.
- `error` – last error, if any.
- `refresh()` – re‑run the query.

## Usage

```tsx
import { useNetworkAddressBook } from "hierokit";

function NodeAddressBookPanel() {
  const { data, status, error, refresh } = useNetworkAddressBook();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return <button onClick={refresh}>Retry</button>;

  const json = data.toJSON();

  return <pre>{JSON.stringify(json, null, 2)}</pre>;
}
```

