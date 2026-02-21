# useRevokeAllowance

Revoke previously granted token allowances.

Internally, this uses `AccountAllowanceDeleteTransaction` to remove NFT/token
allowances for a given token.

## Import

```ts
import { useRevokeAllowance } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type TokenAllowanceArgs = {
  tokenId: string | TokenId;
  owner: string | AccountId;
  spender: string | AccountId;
  amount: number;
};
```

Only `tokenId` and `owner` are used for revocation in the current
implementation.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: TokenAllowanceArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useRevokeAllowance } from "hierokit";

function RevokeButton() {
  const { flow, execute } = useRevokeAllowance();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            tokenId: "0.0.5005",
            owner: "0.0.1001",
            spender: "0.0.2002",
            amount: 0,
          })
        }
      >
        Revoke allowance
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

