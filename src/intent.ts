import type {
  Transaction,
  TransactionReceipt,
  TransactionRecord,
} from "@hiero-ledger/sdk";
import type { Client } from "./Client.js";
import type { TransactionOptions } from "./types.js";
import { TransactionHandle } from "./TransactionHandle.js";

export interface TransactionIntent<TParsed = unknown> {
  type: string;
  toTransaction(client: Client): Promise<Transaction> | Transaction;
  parse?(receipt: TransactionReceipt, record: TransactionRecord | null): TParsed;
}

export interface IntentResult<TParsed = unknown> {
  handle: TransactionHandle;
  receipt: TransactionReceipt;
  record: TransactionRecord | null;
  parsed: TParsed | null;
}

export async function runIntent<TParsed = unknown>(
  client: Client,
  intent: TransactionIntent<TParsed>,
  options: TransactionOptions = {}
): Promise<IntentResult<TParsed>> {
  const tx = await intent.toTransaction(client);
  const handle = await client.submit(tx, options);
  const receipt = await handle.wait(options.timeout);
  let record: TransactionRecord | null = null;

  try {
    record = await handle.getRecord(options.timeout);
  } catch {
    record = null;
  }

  const parsed =
    intent.parse != null ? intent.parse(receipt, record) : (null as TParsed | null);

  return {
    handle,
    receipt,
    record,
    parsed,
  };
}

