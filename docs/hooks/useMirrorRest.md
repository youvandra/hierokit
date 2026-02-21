# useMirrorRest

Call Hedera Mirror Node REST endpoints from React with a small typed helper.

## Import

```ts
import { useMirrorRest } from "hierokit";
```

## Parameters

```ts
type MirrorRestOptions = {
  query?: Record<string, string | number | boolean | null | undefined>;
  enabled?: boolean;
};

function useMirrorRest<T = unknown>(
  path: string,
  options?: MirrorRestOptions
): {
  data: T | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
};
```

- `path`
  - Mirror REST path, for example `"/api/v1/accounts/0.0.xxxx/transactions"`.
- `options.query`
  - Optional querystring parameters encoded into the URL.
- `options.enabled`
  - When `false`, the hook stays idle until you call `refresh()`.

## Returns

```ts
{
  data: T | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

If the Mirror node URL is not configured on the client, `status` becomes
`"error"` with an explanatory error.

## Usage

```tsx
import { useMirrorRest } from "hierokit";

type TopicMessagesResponse = {
  messages: Array<{
    consensus_timestamp: string;
    message: string;
    sequence_number: number;
  }>;
};

function TopicMessages({ topicId }: { topicId: string }) {
  const { data, status, error, refresh } = useMirrorRest<TopicMessagesResponse>(
    `/api/v1/topics/${topicId}/messages`,
    {
      enabled: true,
      query: { limit: 10, order: "desc" },
    }
  );

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return <button onClick={refresh}>Reload</button>;

  return (
    <ul>
      {data.messages.map((m) => (
        <li key={m.sequence_number}>{m.message}</li>
      ))}
    </ul>
  );
}
```
