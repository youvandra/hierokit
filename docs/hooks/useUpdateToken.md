# useUpdateToken

Update selected fields for an existing token.

## Import

```ts
import { useUpdateToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseUpdateTokenArgs = {
  tokenId: string | TokenId;
  name?: string;
  symbol?: string;
  memo?: string;
};
```

Only provided fields are updated.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseUpdateTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useUpdateToken } from "hierokit";

function UpdateTokenForm({ tokenId }: { tokenId: string }) {
  const { flow, execute } = useUpdateToken();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            tokenId,
            memo: "Updated memo",
          })
        }
      >
        Update memo
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

