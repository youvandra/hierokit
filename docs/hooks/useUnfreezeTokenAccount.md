# useUnfreezeTokenAccount

Unfreeze a token for a specific account.

## Import

```ts
import { useUnfreezeTokenAccount } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseTokenAccountArgs = {
  tokenId: string | TokenId;
  accountId: string | AccountId;
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseTokenAccountArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useUnfreezeTokenAccount } from "hierokit";

function UnfreezeButton({
  tokenId,
  accountId,
}: {
  tokenId: string;
  accountId: string;
}) {
  const { flow, execute } = useUnfreezeTokenAccount();

  return (
    <div>
      <button onClick={() => execute({ tokenId, accountId })}>
        Unfreeze account
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

