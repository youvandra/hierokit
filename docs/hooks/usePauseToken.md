# usePauseToken

Pause a token, halting all transfers.

## Import

```ts
import { usePauseToken } from "hierokit";
```

## Parameters

- `options?: TransactionFlowOptions`

## Execute arguments

```ts
type UseTokenPauseArgs = {
  tokenId: string | TokenId;
};
```

## Returns

```ts
{
  flow: FlowHandle<TransactionReceipt>;
  execute: (args: UseTokenPauseArgs) => Promise<void>;
}
```

## Usage

```tsx
import { usePauseToken } from "hierokit";

function PauseTokenButton({ tokenId }: { tokenId: string }) {
  const { flow, execute } = usePauseToken();

  return (
    <div>
      <button onClick={() => execute({ tokenId })}>Pause token</button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

