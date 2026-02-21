# Mental Model

HieroKit is designed to be the "missing layer" between the raw SDK and your application logic.

## The Problem

The raw Hiero SDK (`@hashgraph/sdk`) is powerful but low-level. It requires you to:
1. Manually handle client connection logic.
2. Manually sign transactions (sometimes).
3. Manually wait for consensus (receipts).
4. Manually handle retries for various network errors.

## The HieroKit Solution

HieroKit abstracts these steps into declarative flows:

1. **Client**: A configured instance that manages connection and operator identity.
2. **Transaction Handle**: A promise-like object that represents a submitted transaction, allowing you to wait for finality or check status.
3. **Flows**: High-level methods for common tasks (e.g., `transferHbar`, `createTopic`).

## Lifecycle

1. **Construct**: Create the transaction object (SDK level).
2. **Submit**: Send it to the network via HieroKit Client.
3. **Wait**: HieroKit handles the polling for consensus.
4. **Result**: You get a finalized Receipt or Record.
