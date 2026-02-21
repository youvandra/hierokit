# useDissociateToken

Dissociate one or more tokens from an account.

## Import

```ts
import { useDissociateToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseDissociateTokenArgs = {
  accountId?: string | AccountId;
  tokenIds: (string | TokenId)[];
};
```

- If `accountId` is omitted, the client's operator account is used.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseDissociateTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useDissociateToken } from "hierokit";

function DissociateButton({
  tokenId,
}: {
  tokenId: string;
}) {
  const { flow, execute } = useDissociateToken();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            tokenIds: [tokenId],
          })
        }
      >
        Dissociate token
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

