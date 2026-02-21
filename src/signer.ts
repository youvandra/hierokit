import type {
  Transaction,
  LedgerId,
  AccountId,
  Key,
  TransactionRecord,
  AccountBalance,
  AccountInfo,
  Executable,
} from "@hiero-ledger/sdk";
import type { HieroSigner } from "./types.js";

export function createCompositeSigner(signers: HieroSigner[]): HieroSigner {
  if (signers.length === 0) {
    throw new Error("At least one signer is required");
  }

  const primary = signers[0];

  return {
    getLedgerId(): LedgerId | null {
      return primary.getLedgerId();
    },
    getAccountId(): AccountId {
      return primary.getAccountId();
    },
    getAccountKey(): Key | undefined {
      return primary.getAccountKey ? primary.getAccountKey() : undefined;
    },
    getNetwork(): { [key: string]: string | AccountId } {
      return primary.getNetwork();
    },
    getMirrorNetwork(): string[] {
      return primary.getMirrorNetwork();
    },
    async sign(messages: Uint8Array[]): Promise<any[]> {
      const signatures: any[] = [];
      for (const signer of signers) {
        const part = await signer.sign(messages);
        signatures.push(...part);
      }
      return signatures;
    },
    getAccountBalance(): Promise<AccountBalance> {
      return primary.getAccountBalance();
    },
    getAccountInfo(): Promise<AccountInfo> {
      return primary.getAccountInfo();
    },
    getAccountRecords(): Promise<TransactionRecord[]> {
      return primary.getAccountRecords();
    },
    async signTransaction<T extends Transaction>(transaction: T): Promise<T> {
      let tx = transaction;
      for (const signer of signers) {
        tx = await signer.signTransaction(tx);
      }
      return tx;
    },
    async checkTransaction<T extends Transaction>(transaction: T): Promise<T> {
      let tx = transaction;
      for (const signer of signers) {
        tx = await signer.checkTransaction(tx);
      }
      return tx;
    },
    async populateTransaction<T extends Transaction>(transaction: T): Promise<T> {
      let tx = transaction;
      for (const signer of signers) {
        tx = await signer.populateTransaction(tx);
      }
      return tx;
    },
    call<RequestT, ResponseT, OutputT>(
      request: Executable<RequestT, ResponseT, OutputT>
    ): Promise<OutputT> {
      return primary.call(request);
    },
  } as HieroSigner;
}
