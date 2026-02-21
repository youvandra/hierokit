---
layout: home

hero:
  name: "HieroKit"
  text: "Developer experience toolkit for Hiero/Hedera"
  tagline: "Build on Hiero with confidence and speed."
  image:
    src: /logo_black.png
    alt: "HieroKit logo"
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/youvandra/hierokit

features:
  - title: Simple & Intuitive
    details: Wraps the powerful Hiero SDK with clean, declarative APIs.
  - title: Production Ready
    details: Built-in retries, explicit transaction lifecycles, and error handling.
  - title: TypeScript Native
    details: Fully typed for a great developer experience.
---

## What is HieroKit?

HieroKit is a flow-based TypeScript toolkit that wraps the Hiero/Hedera SDK
with higher-level primitives for safe, production-ready transactions.

- Opinionated Client abstraction on top of `@hiero-ledger/sdk`
- Flow-based transaction lifecycles with retries and timeouts
- React hooks for declarative, UI-friendly access to accounts, tokens, and flows

## Quick links

- Getting started: [Introduction](/guide/introduction) · [Quickstart](/guide/getting-started)
- Core concepts: [Mental model](/guide/mental-model) · [Client abstraction](/guide/client-abstraction)
- Transaction flows: [Flows overview](/guide/transaction-flows) · [Idempotency](/guide/idempotency)
- React hooks: [Hooks overview](/hooks/index)
- API reference: [Client](/api/client) · [Transactions](/api/transactions) · [Errors](/api/errors)

## Search the docs

Use the search bar in the top navigation to quickly find hooks, guides, and
API pages by name. All guides, API docs, and hook references are indexed.

## Meet the team

HieroKit is created and maintained by:

- **Youvandra Febrial** – Author and maintainer of HieroKit, focused on making
  Hiero/Hedera development more approachable for TypeScript and React
  developers.

## React example

If you prefer to start from a working example, check out the tiny React app
in the source tree (`src/react/example.tsx`). This is a demo-only component
and not part of the public API surface.

It shows how to:

- Configure `HieroProvider` for testnet
- Use `useTransferHbar` to send HBAR
- Use `useTransferPreview` to estimate fees
- Use `useTransferHistory` to inspect recent transfers
