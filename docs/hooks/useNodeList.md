# useNodeList

Return the list of network nodes the client is configured to use.

## Import

```ts
import { useNodeList } from "hierokit";
```

## Parameters

None.

## Returns

An array of:

```ts
{ nodeId: string; address: string | AccountId }
```

## Usage

```tsx
import { useNodeList } from "hierokit";

function NodesTable() {
  const nodes = useNodeList();

  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.nodeId}>
          {node.nodeId} → {String(node.address)}
        </li>
      ))}
    </ul>
  );
}
```

