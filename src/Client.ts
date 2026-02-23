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
import { HieroConfig, TransactionOptions, type HieroSigner } from "./types.js";
import { TransactionHandle } from "./TransactionHandle.js";

function assertNodeRuntime() {
  const isNodeLike =
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!(process as any).versions?.node;

  if (!isNodeLike) {
    throw new Error(
      "HieroKit Client currently supports Node.js runtimes only. Use HieroKit on the server or in SSR, not in a browser bundle."
    );
  }
}

/**
 * HieroKit Client: Simplified, developer-friendly interface for Hiero interactions.
 */
export class Client {
  private _sdkClient: HieroSDKClient;
  private _config: HieroConfig;
  private _signers: HieroSigner[];
  private _maxRetries: number;
  private _defaultTimeoutMs: number;

  constructor(config: HieroConfig) {
    assertNodeRuntime();
    this._config = config;
    this._signers = config.signers ?? [];
    this._maxRetries = config.maxRetries ?? 3;
    this._defaultTimeoutMs = config.defaultTimeoutMs ?? 60_000;

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

    if (config.operator && config.operator.privateKey) {
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
   * Access the resolved configuration.
   */
  get config(): HieroConfig {
    return this._config;
  }

  /**
   * External signers associated with this client.
   */
  get signers(): HieroSigner[] {
    return this._signers;
  }

  get defaultTimeoutMs(): number {
    return this._defaultTimeoutMs;
  }

  get maxRetries(): number {
    return this._maxRetries;
  }

  private async _applySigners<T extends Transaction>(tx: T): Promise<T> {
    if (!this._signers.length) {
      return tx;
    }

    let current = tx;
    for (const signer of this._signers) {
      current = await signer.populateTransaction(current);
      current = await signer.checkTransaction(current);
      current = await signer.signTransaction(current);
    }

    return current;
  }

  private _isRetriableError(err: unknown): boolean {
    const anyErr = err as any;
    const status: Status | undefined = anyErr?.status;
    const name: string = anyErr?.name ?? "Error";

    if (name === "MaxAttemptsOrTimeoutError") {
      return true;
    }

    if (status instanceof Status) {
      return (
        status === Status.Busy ||
        status === Status.PlatformTransactionNotCreated ||
        status === Status.Unknown
      );
    }

    return false;
  }

  private async _executeWithRetry(
    transaction: Transaction,
    timeout?: number,
    maxRetries?: number
  ): Promise<TransactionResponse> {
    const effectiveMaxRetries =
      maxRetries != null ? maxRetries : this._maxRetries;

    const prepared = await this._applySigners(transaction);

    let attempt = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastError: any;

    // first attempt + retries
    while (attempt <= effectiveMaxRetries) {
      try {
        return await prepared.execute(this._sdkClient, timeout);
      } catch (err) {
        lastError = err;
        attempt += 1;

        if (attempt > effectiveMaxRetries || !this._isRetriableError(err)) {
          throw err;
        }
      }
    }

    throw lastError;
  }

  /**
   * Submit a transaction to the network.
   * Returns a handle to wait for receipt or query status.
   */
  async submit(
    transaction: Transaction,
    options: TransactionOptions = {}
  ): Promise<TransactionHandle> {
    const timeout =
      options.timeout != null ? options.timeout : this._defaultTimeoutMs;
    const maxRetries =
      options.maxRetries != null ? options.maxRetries : this._maxRetries;

    const response = await this._executeWithRetry(
      transaction,
      timeout,
      maxRetries
    );

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
    const timeout =
      options.timeout != null ? options.timeout : this._defaultTimeoutMs;
    return handle.wait(timeout);
  }

  /**
   * Create a structured transaction flow with explicit lifecycle steps.
   */
  prepareFlow<T extends Transaction>(
    factory: (client: HieroSDKClient) => Promise<T> | T,
    options: TransactionOptions = {}
  ) {
    const outer = this;
    let preparedTx: T | null = null;

    async function prepare(): Promise<T> {
      if (!preparedTx) {
        preparedTx = await Promise.resolve(factory(outer._sdkClient));
      }
      return preparedTx;
    }

    async function sign(): Promise<T> {
      const tx = await prepare();
      return outer._applySigners(tx);
    }

    async function submit(): Promise<TransactionHandle> {
      const tx = await sign();
      const timeout =
        options.timeout != null ? options.timeout : outer._defaultTimeoutMs;
      const maxRetries =
        options.maxRetries != null ? options.maxRetries : outer._maxRetries;

      const response = await outer._executeWithRetry(
        tx,
        timeout,
        maxRetries
      );
      return new TransactionHandle(response, outer._sdkClient);
    }

    async function waitForReceipt(): Promise<TransactionReceipt> {
      const handle = await submit();
      const timeout =
        options.timeout != null ? options.timeout : outer._defaultTimeoutMs;
      return handle.wait(timeout);
    }

    return {
      prepare,
      sign,
      submit,
      waitForReceipt,
    };
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
