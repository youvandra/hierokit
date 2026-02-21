# useCreateFungibleToken

Create a new fungible token using a flow-aware hook.

## Import

```ts
import { useCreateFungibleToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseCreateFungibleTokenArgs = {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  treasuryAccountId?: string | AccountId;
  memo?: string;
};
```

- If `treasuryAccountId` is omitted, the client's operator account is used.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseCreateFungibleTokenArgs) => Promise<void>;
}
```

## Usage

```tsx
import { useCreateFungibleToken } from "hierokit";

function CreateTokenButton() {
  const { flow, execute } = useCreateFungibleToken();

  return (
    <div>
      <button
        onClick={() =>
          execute({
            name: "Demo Token",
            symbol: "DEMO",
            decimals: 2,
            initialSupply: 1_000_0,
            memo: "Example token",
          })
        }
      >
        Create token
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

