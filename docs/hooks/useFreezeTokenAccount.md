# useFreezeTokenAccount

Freeze a token for a specific account.

## Import

```ts
import { useFreezeTokenAccount } from "hierokit";
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
import { useFreezeTokenAccount } from "hierokit";

function FreezeButton({
  tokenId,
  accountId,
}: {
  tokenId: string;
  accountId: string;
}) {
  const { flow, execute } = useFreezeTokenAccount();

  return (
    <div>
      <button onClick={() => execute({ tokenId, accountId })}>
        Freeze account
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

