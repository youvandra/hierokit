# useAllowanceStatus

Mirror-backed hook for querying HBAR, token, and NFT allowances for an account.

## Import

```ts
import { useAllowanceStatus } from "hierokit";
```

## Parameters

```ts
type AllowanceStatusArgs = {
  owner: string | AccountId;
};
```

Pass `null` to disable the query.

## Returns

```ts
{
  data: AllowanceStatus | null;
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

`AllowanceStatus` is a thin wrapper around the mirror node REST API:

```ts
interface MirrorLinks {
  next: string | null;
}

interface MirrorCryptoAllowance {
  owner: string;
  spender: string;
  amount: string;
}

interface MirrorTokenAllowance {
  owner: string;
  spender: string;
  token_id: string;
  amount: string;
}

interface MirrorNftAllowance {
  owner: string;
  spender: string;
  token_id: string;
}

interface MirrorAllowanceList<TAllowance> {
  allowances: TAllowance[];
  links: MirrorLinks;
}

interface AllowanceStatus {
  hbarAllowances: MirrorCryptoAllowance[];
  tokenAllowances: MirrorTokenAllowance[];
  nftAllowances: MirrorNftAllowance[];
}
```

## Usage

```tsx
import { useAllowanceStatus } from "hierokit";

function AllowancePanel() {
  const { data, status } = useAllowanceStatus({ owner: "0.0.1001" });

  if (status === "idle") return <p>Enter an owner account ID</p>;
  if (status === "loading") return <p>Loading allowances…</p>;
  if (status === "error") return <p>Failed to load allowances</p>;

  return (
    <pre>
      {JSON.stringify(
        {
          hbar: data?.hbarAllowances.length,
          tokens: data?.tokenAllowances.length,
          nfts: data?.nftAllowances.length,
        },
        null,
        2
      )}
    </pre>
  );
}
```
