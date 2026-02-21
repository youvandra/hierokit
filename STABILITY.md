# Stability

This document describes what parts of HieroKit are considered stable, how we apply
semantic versioning, and what kinds of changes you can expect over time.

## Overview

- HieroKit is versioned using [Semantic Versioning](https://semver.org/).
- The npm package name is `hierokit`.
- The current major version is `1.x`, which is treated as a stable line.
- Breaking changes are only introduced in new **major** versions.

## Public API surface

Everything that is exported from the root `hierokit` package is considered part of
the **public API** and is covered by our stability guarantees.

Today this includes:

- Types and configuration models exported from `./types`
- The `Client` class exported from `./Client`
- The `TransactionHandle` helper exported from `./TransactionHandle`
- Error types and helpers exported from `./errors`
- Result types and helpers exported from `./results`
- Signing helpers exported from `./signer`
- Intent helpers exported from `./intent`
- Fee utilities exported from `./fees`
- React hooks exported from `./react/hooks`

If a symbol is reachable from a default import like:

```ts
import {
  Client,
  HieroProvider,
  useAccountHbarBalance,
} from "hierokit";
```

then it is considered part of the public API.

### What the stability guarantee means

For all public API surface:

- **No breaking changes within a major version**  
  We avoid changing or removing existing public symbols in a way that breaks
  existing code within the same major version line.

- **New functionality via minor and patch versions**  
  New symbols, options, and small behavior improvements may be added in minor and
  patch releases as long as they do not break existing code.

- **Bug fixes are always allowed**  
  Fixes that correct incorrect behavior are allowed in patch releases, even if they
  exposed previously unintended behavior.

## Non‑stable surface

The following are **not** covered by our stability guarantees:

- Internal modules under `src/` that are not exported from `src/index.ts`
- File names and internal module paths
- Test helpers and fixtures
- Example files in the repository
- The exact shape of build artifacts in `dist/`

These may change at any time, even within a patch release.

If you find yourself importing from a deep path such as:

```ts
import { something } from "hierokit/dist/internal/foo";
```

you are relying on internal, unstable details and should instead use the public
surface exported from `hierokit`.

## Deprecation policy

When we need to evolve the public API in a way that could be breaking:

- We prefer to introduce new symbols or options rather than change existing ones.
- Where possible, existing APIs that are slated for removal will be:
  - Marked as deprecated in TypeScript typings, and
  - Noted in the `CHANGELOG.md` file under a **Deprecated** section.
- Deprecated APIs are kept for at least one **minor** release before removal,
  unless there is a critical security or correctness reason to remove them sooner.

## Runtime environments

HieroKit is primarily designed for:

- Node.js runtimes for backend and automation use cases
- Browser environments via React for frontend use cases

The test suite runs:

- In a Node.js environment using `vitest` for core TypeScript logic
- In a `jsdom` environment for React hooks

Older or non‑standard JavaScript environments may work but are not explicitly
supported or tested.

## Documentation stability

The documentation, examples, and guides are intended to reflect the current
released behavior of HieroKit, but they are not part of the public API surface.
They may be reorganized or clarified between releases without a corresponding
version bump, as long as they accurately describe the behavior of the stable API.

