import {
  Client as HieroSDKClient,
  AccountId,
  PrivateKey,
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  Hbar,
  TransferTransaction,
  Status,
} from "@hiero-ledger/sdk";
import { HieroConfig, TransactionOptions } from "./types.js";
import { TransactionHandle } from "./TransactionHandle.js";

/**
 * HieroKit Client: Simplified, developer-friendly interface for Hiero interactions.
 */
export class Client {
  private _sdkClient: HieroSDKClient;
  private _config: HieroConfig;

  constructor(config: HieroConfig) {
    this._config = config;

    // Initialize SDK Client
    if (typeof config.network === "string") {
      switch (config.network) {
        case "mainnet":
          this._sdkClient = HieroSDKClient.forMainnet();
          break;
        case "testnet":
          this._sdkClient = HieroSDKClient.forTestnet();
          break;
        case "previewnet":
          this._sdkClient = HieroSDKClient.forPreviewnet();
          break;
        default:
            // Assuming config.network is a custom network object if not a string
            this._sdkClient = HieroSDKClient.forNetwork(config.network as any);
      }
    } else {
      this._sdkClient = HieroSDKClient.forNetwork(config.network);
    }

    if (config.operator) {
      this._sdkClient.setOperator(
        config.operator.accountId,
        config.operator.privateKey
      );
    }

    if (config.mirrorNodeUrl) {
      this._sdkClient.setMirrorNetwork([config.mirrorNodeUrl]);
    }
  }

  /**
   * Access the underlying Hiero SDK Client instance.
   */
  get raw(): HieroSDKClient {
    return this._sdkClient;
  }

  /**
   * Submit a transaction to the network.
   * Returns a handle to wait for receipt or query status.
   */
  async submit(
    transaction: Transaction,
    options: TransactionOptions = {}
  ): Promise<TransactionHandle> {
    const timeout = options.timeout;

    // Execute the transaction
    const response = await transaction.execute(this._sdkClient, timeout);
    
    return new TransactionHandle(response, this._sdkClient);
  }

  /**
   * Execute a transaction and wait for its receipt.
   * Convenience method for simple fire-and-forget flows.
   */
  async execute(
    transaction: Transaction,
    options: TransactionOptions = {}
  ): Promise<TransactionReceipt> {
    const handle = await this.submit(transaction, options);
    return handle.wait(options.timeout);
  }

  /**
   * Transfer HBAR.
   */
  async transferHbar(
    to: string | AccountId,
    amount: number | Hbar,
    memo?: string
  ): Promise<TransactionHandle> {
    const tx = new TransferTransaction()
      .addHbarTransfer(this._sdkClient.operatorAccountId!, new Hbar(amount).negated())
      .addHbarTransfer(to, new Hbar(amount));

    if (memo) {
      tx.setTransactionMemo(memo);
    }

    return this.submit(tx);
  }
}
