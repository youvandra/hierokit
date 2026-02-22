import dotenv from "dotenv";
import { describe, it, expect } from "vitest";
import {
  AccountBalanceQuery,
  AccountId,
  Hbar,
} from "@hiero-ledger/sdk";
import { Client } from "../../src/Client.js";
import type { HieroConfig } from "../../src/types.js";
import { estimateExecutableCost } from "../../src/fees.js";

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
  }
});
