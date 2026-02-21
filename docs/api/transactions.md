# Transactions API

## TransactionHandle

Wraps a submitted transaction response.

- `transactionId: string`
- `wait(timeout?: number): Promise<TransactionReceipt>`
- `getRecord(timeout?: number): Promise<TransactionRecord>`
