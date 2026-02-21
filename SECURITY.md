# Security Policy

HieroKit is a small, security‑sensitive library that helps applications submit
transactions to Hiero/Hedera networks. This document explains how we think about
security and how to report potential vulnerabilities.

## Supported versions

We currently support security fixes for:

- The latest `1.x` release published to npm.

Older major versions may receive critical fixes on a best‑effort basis, but there
is no guarantee. If you rely on HieroKit in production, you should keep your
dependency reasonably up to date.

## Reporting a vulnerability

If you believe you have found a security issue in HieroKit, please use **private
disclosure** rather than opening a public GitHub issue.

Preferred channels:

- Use the "Report a vulnerability" flow in the GitHub Security tab for this
  repository, which creates a private security advisory.
- If that is not available, contact the maintainers using the contact information
  listed on the repository owner's GitHub profile and mention "HieroKit security"
  in the subject or message.

Please include as much detail as you can:

- A description of the issue and potential impact
- Steps to reproduce or a proof of concept, if available
- Any relevant environment details (Node version, browser, operating system)

## Our response process

When you report a vulnerability through a private channel:

- We aim to acknowledge receipt within **3 business days**.
- We will investigate the issue and:
  - Confirm whether it is a security vulnerability,
  - Assess impact and affected versions,
  - Propose a fix or mitigation plan.
- For confirmed vulnerabilities, we will:
  - Prepare and test a fix,
  - Coordinate a release to npm,
  - Update the `CHANGELOG.md` with relevant information,
  - Where appropriate, publish a GitHub security advisory.

Timeline and details may vary depending on severity and complexity, but we try to
keep you informed throughout the process.

## Non‑security issues

If the issue you have found is not security‑sensitive (for example, a bug that
cannot lead to loss of funds or unauthorized access), please open a normal issue
on GitHub instead of using the private disclosure process.

Examples of non‑security issues:

- Typings that are too narrow or too permissive
- Documentation mistakes or omissions
- Errors that result in a clear failure instead of a silent, exploitable bug

These issues are still important and are handled through the normal bug‑tracking
workflow.

## Dependencies

HieroKit builds on top of the official `@hiero-ledger/sdk` package. Security
issues in that package should generally be reported to its maintainers through
their recommended channels.

If you are unsure whether an issue belongs in HieroKit or the underlying SDK,
you can still contact us privately and we will help route the report.

