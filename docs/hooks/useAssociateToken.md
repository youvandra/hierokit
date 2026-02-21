# useAssociateToken

Associate one or more tokens with an account.

## Import

```ts
import { useAssociateToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseAssociateTokenArgs = {
  accountId?: string | AccountId;
  tokenIds: (string | TokenId)[];
};
```

- If `accountId` is omitted, the client's operator account is used.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseAssociateTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useAssociateToken } from "hierokit";

function AssociateButton({
  tokenId,
}: {
  tokenId: string;
}) {
  const { flow, execute } = useAssociateToken();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            tokenIds: [tokenId],
          })
        }
      >
        Associate token
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

