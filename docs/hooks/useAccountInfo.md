# useAccountInfo

Query full `AccountInfo` for an account.

## Import

```ts
import { useAccountInfo } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.
  - Pass a string (`"0.0.xxxx"`) or SDK `AccountId`.

## Returns

```ts
{
  data: AccountInfo | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountInfo } from "hierokit";

function AccountInfoPanel() {
  const { data, status, error, refresh } = useAccountInfo();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error: {String(error)}</p>;
  if (!data) return null;

  return (
    <div>
      <div>ID: {data.accountId.toString()}</div>
      <div>Memo: {data.accountMemo}</div>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```
