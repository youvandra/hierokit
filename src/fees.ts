import type { Hbar, TransactionRecord } from "@hiero-ledger/sdk";
import type { Client } from "./Client.js";

export interface FeeBreakdown {
  maxFee: Hbar | null;
  chargedFee: Hbar | null;
}

export async function estimateExecutableCost(
  client: Client,
  executable: { getCost: (client: any) => Promise<Hbar> }
): Promise<Hbar> {
  const sdkClient = client.raw as any;
  return executable.getCost(sdkClient);
}

export function extractFeeFromRecord(record: TransactionRecord): FeeBreakdown {
  const anyRecord = record as any;
  const chargedFee: Hbar | null =
    anyRecord.transactionFee != null ? anyRecord.transactionFee : null;

  const maxFee: Hbar | null =
    anyRecord.transaction != null && anyRecord.transaction.transactionFee
      ? anyRecord.transaction.transactionFee
      : null;

  return {
    maxFee,
    chargedFee,
  };
}
