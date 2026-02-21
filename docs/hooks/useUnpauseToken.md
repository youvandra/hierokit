# useUnpauseToken

Unpause a previously paused token.

## Import

```ts
import { useUnpauseToken } from "hierokit";
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
import { useUnpauseToken } from "hierokit";

function UnpauseTokenButton({ tokenId }: { tokenId: string }) {
  const { flow, execute } = useUnpauseToken();

  return (
    <div>
      <button onClick={() => execute({ tokenId })}>Unpause token</button>
      <p>Status: {flow.status}</p>
    </div>
  );
}
```

