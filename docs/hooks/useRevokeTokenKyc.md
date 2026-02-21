# useRevokeTokenKyc

Revoke KYC for a token from an account.

## Import

```ts
import { useRevokeTokenKyc } from "hierokit";
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
import { useRevokeTokenKyc } from "hierokit";

function RevokeKycButton({
  tokenId,
  accountId,
}: {
  tokenId: string;
  accountId: string;
}) {
  const { flow, execute } = useRevokeTokenKyc();

  return (
    <div>
      <button onClick={() => execute({ tokenId, accountId })}>
        Revoke KYC
      </button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

