# Testing philosophy

This page describes how HieroKit is tested and how you can run and extend the
tests in your own development workflow.

## Goals

- Provide high confidence that core transaction flows behave correctly.
- Catch regressions quickly with fast, deterministic unit tests.
- Exercise real network interactions through opt‑in integration tests.
- Keep the testing setup simple so contributors can run it locally.

The test suite is built with [Vitest](https://vitest.dev) and uses
[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
for React hooks.

## Test layers

### Unit tests

Unit tests cover most of the core library behavior:

- The `Client` abstraction and helpers under `src/`
- Errors, results, and fee helpers
- Transaction handles and flow utilities
- React hooks in `src/react`

They run in a Node.js environment by default and focus on:

- Verifying control flow and branching logic
- Ensuring type‑level guarantees are reflected at runtime
- Simulating network interactions by mocking the underlying SDK where needed

You can run the unit test suite with:

```bash
npm test
```

or with your preferred package manager’s equivalent command.

### React hook tests

React‑specific behavior is tested with:

- The `jsdom` test environment provided by Vitest
- `@testing-library/react` for rendering components and querying the DOM

These tests ensure that:

- `HieroProvider` correctly provides a configured client
- Hooks such as `useNetwork`, `useNetworkAddressBook`, and `useTransferHbar`
  behave as documented
- Side effects (like triggering a transfer) call into the client with the
  expected arguments

React tests are part of the normal `npm test` run and do not require any
special setup beyond installing dev dependencies.

### Integration tests

Integration tests exercise HieroKit against a real Hiero/Hedera network.
They live under:

- `tests/integration/testnet.itest.ts`

These tests are **opt‑in** and are skipped by default to avoid accidental
network usage in local or CI environments.

To enable them you must:

1. Set `HIEROKIT_TESTNET=1` in your environment.
2. Provide test credentials:
   - `HIEROKIT_TEST_OPERATOR_ID`
   - `HIEROKIT_TEST_OPERATOR_KEY`
3. Optionally configure:
   - `HIEROKIT_TEST_NETWORK` (defaults to `testnet`)
   - `HIEROKIT_TEST_RECIPIENT_ID` for transfer tests

Then run:

```bash
npm run test:integration
```

The integration tests verify that:

- A configured client can fetch account balances from the network.
- Fee estimation helpers work end‑to‑end with real queries.
- Optional HBAR transfer flows complete successfully when a recipient is
  configured.

Because these tests interact with a live network, they should use low amounts
of HBAR and be written to be idempotent and safe to rerun.

## When to add tests

When you are changing or extending HieroKit, you should generally:

- Add or update **unit tests** when:
  - You add new public API surface.
  - You fix a bug that could regress in the future.
  - You change control flow or error handling behavior.
- Add or update **React tests** when:
  - You introduce new hooks or modify existing hook behavior.
  - You change how `HieroProvider` wiring works.
- Add or update **integration tests** when:
  - You add new flows that depend on real network behavior.
  - You need to validate subtle interactions with the underlying SDK.

Changes should not be merged without corresponding tests for the new or changed
behavior, unless there is a clear reason that the change is untestable.

## Running tests in CI

The repository’s CI configuration runs the unit test suite on every push or pull
request. Integration tests may be enabled in CI with appropriate credentials,
but they are optional and may be restricted to specific branches or workflows.

If you run HieroKit in your own CI, we recommend:

- Always running the unit test suite.
- Enabling integration tests only in environments where you can safely store and
rotate test credentials.

