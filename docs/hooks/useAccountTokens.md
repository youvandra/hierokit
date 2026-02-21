# useAccountTokens

Query fungible token balances for an account.

## Import

```ts
import { useAccountTokens } from "hierokit";
```

## Parameters

- `accountId?: string | AccountId | null`

  - Omit to use the client's operator account.

## Returns

```ts
{
  data: TokenBalanceMap | null; // from @hiero-ledger/sdk
  status: "idle" | "loading" | "success" | "error";
  error: unknown | null;
  refresh: () => void;
}
```

## Usage

```tsx
import { useAccountTokens } from "hierokit";

function TokenList() {
  const { data: tokens, status } = useAccountTokens();
  if (status !== "success" || !tokens) return null;

  return (
    <ul>
      {Array.from(tokens.entries()).map(([tokenId, balance]) => (
        <li key={tokenId.toString()}>
          {tokenId.toString()}: {balance.toString()}
        </li>
      ))}
    </ul>
  );
}
```
