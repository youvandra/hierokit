# useGrantTokenKyc

Grant KYC for a token to an account.

## Import

```ts
import { useGrantTokenKyc } from "hierokit";
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
import { useGrantTokenKyc } from "hierokit";

function GrantKycButton({
  tokenId,
  accountId,
}: {
  tokenId: string;
  accountId: string;
}) {
  const { flow, execute } = useGrantTokenKyc();

  return (
    <div>
      <button onClick={() => execute({ tokenId, accountId })}>
        Grant KYC
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

