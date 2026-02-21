# usePollingQuery

Run an asynchronous function on a fixed interval – a simple agent/polling hook.

## Import

```ts
import { usePollingQuery } from "hierokit";
```

## Parameters

```ts
type PollingOptions = {
  enabled?: boolean;
  immediate?: boolean;
};

function usePollingQuery<T>(
  fn: () => Promise<T>,
  intervalMs: number,
  options?: PollingOptions
): {
  data: T | null;
  status: "idle" | "running" | "success" | "error";
  error: unknown | null;
  start: () => void;
  stop: () => void;
  refresh: () => void;
};
```

- `fn`
  - Async function that performs the work or query on each tick.
- `intervalMs`
  - Polling interval in milliseconds.
- `options.enabled`
  - When `false`, polling is disabled until you call `start()`.
- `options.immediate`
  - When `true` (default), runs once immediately before the first interval.

## Returns

```ts
{
  data: T | null;
  status: "idle" | "running" | "success" | "error";
  error: unknown | null;
  start: () => void;
  stop: () => void;
  refresh: () => void;
}
```

## Usage

```tsx
import { usePollingQuery } from "hierokit";
import { useMirrorRest } from "hierokit";

function LiveTopicTail({ topicId }: { topicId: string }) {
  const { data, status, error, refresh } = useMirrorRest(
    `/api/v1/topics/${topicId}/messages`,
    { enabled: false, query: { limit: 1, order: "desc" } }
  );

  const polling = usePollingQuery(
    async () => {
      await refresh();
      return null;
    },
    5_000,
    { enabled: true, immediate: true }
  );

  if (status === "error") return <p>Error: {String(error)}</p>;

  return (
    <div>
      <p>Polling status: {polling.status}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

