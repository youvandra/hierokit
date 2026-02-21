# useNetwork

Read the configured Hedera network (`mainnet`, `testnet`, `previewnet` or a
custom network map).

## Import

```ts
import { useNetwork } from "hierokit";
```

## Parameters

None.

## Returns

- `"mainnet" | "testnet" | "previewnet"` – for named networks, or
- `{ [nodeId: string]: string | AccountId }` – for custom networks.

## Usage

```tsx
import { useNetwork } from "hierokit";

function NetworkBadge() {
  const network = useNetwork();

  return (
    <span>
      Network: {typeof network === "string" ? network : "custom"}
    </span>
  );
}
```

