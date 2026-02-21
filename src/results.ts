import type {
  TransactionReceipt,
  TransactionRecord,
} from "@hiero-ledger/sdk";

export interface NormalizedReceipt {
  status: string;
  success: boolean;
  transactionId?: string;
  accountId?: string;
  contractId?: string;
  topicId?: string;
  tokenId?: string;
  scheduleId?: string;
}

export interface NormalizedRecord extends NormalizedReceipt {
  consensusTimestamp?: string;
  memo?: string;
}

export function normalizeReceipt(
  receipt: TransactionReceipt
): NormalizedReceipt {
  const status = receipt.status.toString();

  return {
    status,
    success: status === "SUCCESS" || status === "Ok",
    transactionId: (receipt as any).transactionId?.toString?.(),
    accountId: (receipt as any).accountId?.toString?.(),
    contractId: (receipt as any).contractId?.toString?.(),
    topicId: (receipt as any).topicId?.toString?.(),
    tokenId: (receipt as any).tokenId?.toString?.(),
    scheduleId: (receipt as any).scheduleId?.toString?.(),
  };
}

export function normalizeRecord(
  record: TransactionRecord
): NormalizedRecord {
  const base = normalizeReceipt(record.receipt);

  return {
    ...base,
    consensusTimestamp: (record as any).consensusTimestamp?.toString?.(),
    memo: (record as any).memo,
  };
}

