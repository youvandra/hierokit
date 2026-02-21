# useApproveAllowance

Approve HBAR or token allowances for a spender.

## Import

```ts
import { useApproveAllowance } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

`useApproveAllowance` supports two shapes of arguments:

```ts
type AllowanceArgs = {
  owner: string | AccountId;
  spender: string | AccountId;
  amount: number | Hbar;
};

type TokenAllowanceArgs = {
  tokenId: string | TokenId;
  owner: string | AccountId;
  spender: string | AccountId;
  amount: number;
};
```

If `tokenId` is present, a token allowance is approved; otherwise an HBAR
allowance is approved.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: AllowanceArgs | TokenAllowanceArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useApproveAllowance } from "hierokit";

function ApproveSpender() {
  const { flow, execute } = useApproveAllowance();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            owner: "0.0.1001",
            spender: "0.0.2002",
            amount: 10,
          })
        }
      >
        Approve 10 ℏ
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

