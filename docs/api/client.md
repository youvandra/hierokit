# Client API

## Constructor

```typescript
new Client(config: HieroConfig)
```

## Methods

- `submit(transaction: Transaction, options?: TransactionOptions): Promise<TransactionHandle>`
- `execute(transaction: Transaction, options?: TransactionOptions): Promise<TransactionReceipt>`
- `transferHbar(to: string | AccountId, amount: number | Hbar, memo?: string): Promise<TransactionHandle>`
