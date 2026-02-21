import type { AccountId, PrivateKey, Signer as SdkSigner } from "@hiero-ledger/sdk";

export type HieroSigner = SdkSigner;

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
    privateKey?: string | PrivateKey;
  };

  /**
   * Optional external signer(s) used to sign and submit transactions.
   * Can represent browser wallets, hardware devices, multi‑sig, etc.
   */
  signers?: HieroSigner[];

  /**
   * Optional custom mirror node URL.
   */
  mirrorNodeUrl?: string;

  /**
   * Default maximum number of retries for transactions.
   * Per‑call overrides via TransactionOptions.maxRetries.
   */
  maxRetries?: number;

  /**
   * Default timeout in milliseconds for transaction execution and receipt.
   * Per‑call overrides via TransactionOptions.timeout.
   */
  defaultTimeoutMs?: number;
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
