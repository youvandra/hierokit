# Contributing to HieroKit

Thank you for your interest in contributing to HieroKit! We want to make it as easy as possible for you to get involved.

## Process

1. **Fork** the repository to your own GitHub account.
2. **Clone** the project to your machine.
3. **Branch** from `main` with a descriptive name (e.g., `feature/add-token-support` or `fix/client-retry`).
4. **Commit** your changes.
    - We follow [Conventional Commits](https://www.conventionalcommits.org/).
    - Please sign your commits (GPG signature) if possible.
    - We use a DCO (Developer Certificate of Origin) process. By submitting a PR, you certify that you have the right to submit your code. Add `Signed-off-by: Name <email>` to your commits (can be done with `git commit -s`).
5. **Test** your changes locally.
6. **Push** changes to your fork.
7. **Open a PR** in our repository.

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Documentation

To run the documentation site locally:

```bash
npm run docs:dev
```

## Code Style

We use `eslint` and `prettier`. Please run `npm run lint` and `npm run format` before submitting.

## License

By contributing, you agree that your contributions will be licensed under the project's [Apache 2.0 License](./LICENSE).
