# Signer abstraction

HieroKit can work with external signers, multi‑sig and scheduled
transaction signers via the `HieroSigner` type.

## `HieroSigner`

```ts
import type { HieroSigner } from "hierokit";
```

`HieroSigner` is an alias for the SDK's `Signer` type. It can represent:

- browser wallet signers
- hardware signers
- server‑side HSM signers
- composite/multi‑sig signers

You can pass one or more signers into the `HieroConfig` when constructing
the client:

```ts
const config: HieroConfig = {
  network: "testnet",
  signers: [externalSigner],
};

const client = new Client(config);
```

If an `operator.privateKey` is also provided, the client will still set
the SDK operator; otherwise it operates in "external signer only" mode.

## `createCompositeSigner(signers)`

```ts
import { createCompositeSigner } from "hierokit";

const multiSigSigner = createCompositeSigner([signerA, signerB, signerC]);
```

Creates a new `HieroSigner` that:

- delegates network/ledger information to the first signer
- applies `populateTransaction`, `checkTransaction` and `signTransaction`
  across all underlying signers

This is suitable for multi‑sig scenarios and for scheduled transaction
signing where multiple parties need to sign the same transaction.

