import { AccountId, PrivateKey } from "@hiero-ledger/sdk";

export interface HieroConfig {
  /**
   * The network to connect to.
   * Can be 'mainnet', 'testnet', 'previewnet', or a custom network object.
   */
  network: "mainnet" | "testnet" | "previewnet" | { [key: string]: string | AccountId };

  /**
   * The operator account to use for signing transactions.
   * If not provided, the client will be read-only (or require external signing).
   */
  operator?: {
    accountId: string | AccountId;
    privateKey: string | PrivateKey;
  };

  /**
   * Optional custom mirror node URL.
   */
  mirrorNodeUrl?: string;
}

export interface TransactionOptions {
  /**
   * Maximum number of retries for the transaction.
   * Default: 3
   */
  maxRetries?: number;

  /**
   * Timeout in milliseconds for the transaction execution.
   * Default: 60000 (1 minute)
   */
  timeout?: number;

  /**
   * Description for logging/debugging.
   */
  description?: string;
}
