# Transaction flow abstraction

On the Node side, HieroKit exposes a small flow helper in addition to the
React hooks.

## `client.prepareFlow(factory, options?)`

```ts
const flow = client.prepareFlow(
  (sdk) => {
    const tx = new TransferTransaction()
      .setTransactionMemo("Hello HieroKit");
    // configure tx...
    return tx;
  },
  {
    timeout: 60_000,
    maxRetries: 3,
  }
);
```

The returned object exposes the lifecycle explicitly:

```ts
const prepared = await flow.prepare();       // construct transaction
const signed = await flow.sign();           // apply external signers, if any
const handle = await flow.submit();         // submit + retry handling
const receipt = await flow.waitForReceipt();// wait for finality
```

This mirrors the conceptual steps:

1. **prepare()** – build the transaction using the raw SDK client
2. **sign()** – apply external or multi‑sig signers
3. **submit()** – submit with retry handling
4. **waitForReceipt()** – wait for consensus and get a receipt

