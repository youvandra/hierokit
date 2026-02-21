# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0]

### Added

- Initial public release of HieroKit.
- `Client` abstraction for configuring network and operator in one place.
- Flow‑based transaction lifecycle helpers (`TransactionHandle`) with `wait` and
  receipt handling.
- Typed error and result helpers for safer transaction handling.
- Fee estimation utilities on top of `@hiero-ledger/sdk`.
- First‑class React support:
  - `HieroProvider` context provider.
  - Hooks for account data, balances, tokens, NFTs, and staking.
  - Hooks for transfer flows and advanced transaction flows.
- Documentation site with:
  - Golden‑path getting started guides.
  - API reference for core modules.
  - Hooks reference.

