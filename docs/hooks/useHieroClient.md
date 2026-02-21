# useHieroClient

Access the configured HieroKit `Client` instance from React.

## Import

```ts
import { useHieroClient } from "hierokit";
```

## Parameters

None.

## Returns

`Client` – the HieroKit client wrapper created by `HieroProvider`.

## Usage

```tsx
import { useHieroClient } from "hierokit";

function TransferButton() {
  const client = useHieroClient();

  async function onClick() {
    const handle = await client.transferHbar("0.0.recipient", 10, "Hello HieroKit");
    const receipt = await handle.wait();
    console.log("Status", receipt.status.toString());
  }

  return <button onClick={onClick}>Transfer 10 ℏ</button>;
}
```
