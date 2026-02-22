import dotenv from "dotenv";
import { describe, it, expect } from "vitest";
import {
  AccountBalanceQuery,
  AccountId,
  Hbar,
  TransferTransaction,
} from "@hiero-ledger/sdk";
import { Client } from "../../src/Client.js";
import type { HieroConfig } from "../../src/types.js";
import { estimateExecutableCost, extractFeeFromRecord } from "../../src/fees.js";
import { runIntent, type TransactionIntent } from "../../src/intent.js";
import { normalizeReceipt, normalizeRecord } from "../../src/results.js";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const enableIntegration = process.env.HIEROKIT_TESTNET === "1";

const integrationDescribe = enableIntegration ? describe : describe.skip;

integrationDescribe("HieroKit testnet integration", () => {
  if (!enableIntegration) {
    return;
  }

  const operatorId = process.env.HIEROKIT_TEST_OPERATOR_ID;
  const operatorKey = process.env.HIEROKIT_TEST_OPERATOR_KEY;
  const network =
    (process.env.HIEROKIT_TEST_NETWORK as "mainnet" | "testnet" | "previewnet" | undefined) ??
    "testnet";

  if (!operatorId || !operatorKey) {
    throw new Error(
      "HIEROKIT_TEST_OPERATOR_ID and HIEROKIT_TEST_OPERATOR_KEY must be set when HIEROKIT_TESTNET=1"
    );
  }

  const config: HieroConfig = {
    network,
    operator: {
      accountId: operatorId,
      privateKey: operatorKey,
    },
  };

  const client = new Client(config);

  it("can fetch account balance from testnet", async () => {
    const query = new AccountBalanceQuery().setAccountId(
      AccountId.fromString(operatorId)
    );

    const balance = await query.execute(client.raw as any);

    expect(balance.hbars).toBeInstanceOf(Hbar);
  });

  it("can estimate executable cost using fees helper", async () => {
    const query = new AccountBalanceQuery().setAccountId(
      AccountId.fromString(operatorId)
    );

    const cost = await estimateExecutableCost(client, query);

    expect(cost).toBeInstanceOf(Hbar);
  });

  it("has at least one node in configured network", () => {
    const entries = Object.entries(client.raw.network);
    expect(entries.length).toBeGreaterThan(0);
  });

  const recipientId = process.env.HIEROKIT_TEST_RECIPIENT_ID;

  if (!recipientId) {
    it.skip("can submit a small HBAR transfer (recipient not configured)", () => {});
    it.skip("can run a simple transfer intent (recipient not configured)", () => {});
    it.skip("can extract fee breakdown from a real transaction record (recipient not configured)", () => {});
    it.skip("can run a prepared transfer flow (recipient not configured)", () => {});
    it.skip("can execute a small HBAR transfer via execute helper (recipient not configured)", () => {});
    it.skip("can normalize a real transaction receipt", () => {});
    it.skip("can normalize a real transaction record", () => {});
  } else {
    it("can submit a small HBAR transfer", async () => {
      const handle = await client.transferHbar(
        recipientId,
        0.0001,
        "hierokit-integration-test"
      );

      const receipt = await handle.wait(60_000);

      const status = receipt.status.toString();
      expect(status === "SUCCESS" || status === "Ok").toBe(true);
    });

    it("can run a simple transfer intent", async () => {
      const intent: TransactionIntent = {
        type: "transfer-hbar",
        async toTransaction(innerClient) {
          const tx = new TransferTransaction()
            .addHbarTransfer(
              innerClient.raw.operatorAccountId!,
              new Hbar(-0.0001)
            )
            .addHbarTransfer(recipientId, new Hbar(0.0001))
            .setTransactionMemo("hierokit-intent-integration-test");

          return tx as any;
        },
      };

      const result = await runIntent(client, intent, { timeout: 60_000 });
      const status = result.receipt.status.toString();
      expect(status === "SUCCESS" || status === "Ok").toBe(true);
    });

    it("can extract fee breakdown from a real transaction record", async () => {
      const handle = await client.transferHbar(
        recipientId,
        0.0001,
        "hierokit-fee-record-test"
      );

      const record = await handle.getRecord(60_000);
      const breakdown = extractFeeFromRecord(record);

      expect(breakdown.chargedFee).not.toBeNull();
      expect(breakdown).toHaveProperty("maxFee");
    });

    it("can run a prepared transfer flow", async () => {
      const flow = client.prepareFlow(
        async (sdkClient) => {
          return new TransferTransaction()
            .addHbarTransfer(
              sdkClient.operatorAccountId!,
              new Hbar(-0.0001)
            )
            .addHbarTransfer(recipientId, new Hbar(0.0001))
            .setTransactionMemo("hierokit-prepareflow-integration");
        },
        { timeout: 60_000, maxRetries: 1 }
      );

      const receipt = await flow.waitForReceipt();
      const status = receipt.status.toString();
      expect(status === "SUCCESS" || status === "Ok").toBe(true);
    });

    it("can execute a small HBAR transfer via execute helper", async () => {
      const tx = new TransferTransaction()
        .addHbarTransfer(
          client.raw.operatorAccountId!,
          new Hbar(-0.0001)
        )
        .addHbarTransfer(recipientId, new Hbar(0.0001))
        .setTransactionMemo("hierokit-execute-integration");

      const receipt = await client.execute(tx, { timeout: 60_000 });
      const status = receipt.status.toString();
      expect(status === "SUCCESS" || status === "Ok").toBe(true);
    });

    it("can normalize a real transaction receipt", async () => {
      const handle = await client.transferHbar(
        recipientId,
        0.0001,
        "hierokit-normalize-receipt"
      );

      const receipt = await handle.wait(60_000);
      const normalized = normalizeReceipt(receipt);

      expect(typeof normalized.status).toBe("string");
      expect(typeof normalized.success).toBe("boolean");
    });

    it("can normalize a real transaction record", async () => {
      const handle = await client.transferHbar(
        recipientId,
        0.0001,
        "hierokit-normalize-record"
      );

      const record = await handle.getRecord(60_000);
      const normalized = normalizeRecord(record);

      expect(typeof normalized.status).toBe("string");
      expect(typeof normalized.success).toBe("boolean");
      expect(normalized).toHaveProperty("transactionId");
    });
  }
});
