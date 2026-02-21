import { TransactionResponse, TransactionReceipt, Client, TransactionRecord } from "@hashgraph/sdk";

export class TransactionHandle {
  private _response: TransactionResponse;
  private _client: Client;

  constructor(response: TransactionResponse, client: Client) {
    this._response = response;
    this._client = client;
  }

  /**
   * Get the transaction ID.
   */
  get transactionId(): string {
    return this._response.transactionId.toString();
  }

  /**
   * Wait for the transaction to reach consensus and return the receipt.
   * 
   * @param timeout The timeout in milliseconds to wait for the receipt.
   * @returns A promise that resolves to the transaction receipt.
   */
  async wait(timeout?: number): Promise<TransactionReceipt> {
    // Use getReceiptQuery to allow setting timeout on execution
    return this._response.getReceiptQuery().execute(this._client, timeout);
  }

  /**
   * Get the transaction record (if requested).
   * 
   * @param timeout The timeout in milliseconds.
   */
  async getRecord(timeout?: number): Promise<TransactionRecord> {
    return this._response.getRecordQuery().execute(this._client, timeout);
  }
}
