# useUpdateAccountStaking

Update staking configuration for an account (staked node/account and reward settings).

## Import

```ts
import { useUpdateAccountStaking } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

  Passed through to the underlying `useTransactionFlow`:

  - `timeoutMs?: number`

## Execute arguments

The hook returns an `execute` function that accepts:

```ts
type UseUpdateAccountStakingArgs = {
  accountId?: string | AccountId | null;
  stakedAccountId?: string | AccountId | null;
  stakedNodeId?: number | null;
  declineStakingReward?: boolean | null;
};
```

- `accountId`
  - Omit to use the client operator account.
- `stakedAccountId`
  - `undefined` – leave unchanged.
  - `null` – clear staked account.
  - string or `AccountId` – set staked account.
- `stakedNodeId`
  - `undefined` – leave unchanged.
  - `null` – clear staked node.
  - `number` – set the staked node ID.
- `declineStakingReward`
  - `undefined` – leave unchanged.
  - `true | false` – set decline flag.

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseUpdateAccountStakingArgs) => Promise<void>;
}
```

Use the `flow` handle to read status and receipt.

## Usage

```tsx
import { useUpdateAccountStaking } from "hierokit";

function StakingControls() {
  const { flow, execute } = useUpdateAccountStaking({ timeoutMs: 60_000 });

  return (
    <div>
      <button
        onClick={() =>
          execute({
            stakedNodeId: 5,
            declineStakingReward: false,
          })
        }
        disabled={flow.status === "submitting"}
      >
        Stake to node 5
      </button>
    </div>
  );
}
```

