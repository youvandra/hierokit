import dotenv from "dotenv";
import { describe, it, expect } from "vitest";
import {
  AccountBalanceQuery,
  AccountId,
  Hbar,
  TransferTransaction,
} from "@hiero-ledger/sdk";
import * as api from "../src/index.js";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const enableIntegration = process.env.HIEROKIT_TESTNET === "1";
const integrationDescribe = enableIntegration ? describe : describe.skip;

describe("HieroKit public API surface", () => {
  it("exposes core client and transaction helpers", () => {
    expect(typeof api.Client).toBe("function");
    expect(typeof api.TransactionHandle).toBe("function");
    expect(typeof api.runIntent).toBe("function");
    expect(typeof api.normalizeReceipt).toBe("function");
    expect(typeof api.normalizeRecord).toBe("function");
    expect(typeof api.estimateExecutableCost).toBe("function");
    expect(typeof api.extractFeeFromRecord).toBe("function");
    expect(typeof api.createCompositeSigner).toBe("function");
  });

  it("exposes a broad set of React hooks for accounts, tokens, flows, and network", () => {
    const hookNames = [
      "HieroProvider",
      "useHieroClient",
      "useNetwork",
      "useClientStatus",
      "useClientHealth",
      "useMirrorNodeUrl",
      "useAccountId",
      "useAccountInfo",
      "useAccountBalance",
      "useAccountHbarBalance",
      "useAccountTokens",
      "useAccountNFTs",
      "useAccountKeys",
      "useAccountStakingInfo",
      "useAccountMemo",
      "useIsAccountDeleted",
      "useIsAccountFrozen",
      "useAccountExpiration",
      "useAccountAutoRenew",
      "useAccountProxy",
      "useAccountLedgerId",
      "useTransactionFlow",
      "useCreateFlow",
      "useFlowStatus",
      "useFlowReceipt",
      "useFlowError",
      "useRetryFlow",
      "useCancelFlow",
      "useFlowTimeout",
      "useTransferHbar",
      "useTransferPreview",
      "useTransferHistory",
      "useTokenInfo",
      "useTokenSupply",
      "useTokenMetadata",
      "useTokenNfts",
      "useNftInfo",
      "useCreateFungibleToken",
      "useUpdateToken",
      "useMintFungibleToken",
      "useBurnFungibleToken",
      "useMintNft",
      "useBurnNft",
      "useAssociateToken",
      "useDissociateToken",
      "useGrantTokenKyc",
      "useRevokeTokenKyc",
      "useFreezeTokenAccount",
      "useUnfreezeTokenAccount",
    ];

    for (const name of hookNames) {
      expect(typeof (api as any)[name]).toBe("function");
    }
  });
});

integrationDescribe("HieroKit network smoke test", () => {
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

  const config = {
    network,
    operator: {
      accountId: operatorId,
      privateKey: operatorKey,
    },
  };

  const client = new api.Client(config as any);
  const recipientId = process.env.HIEROKIT_TEST_RECIPIENT_ID;

  if (!recipientId) {
    it.skip("can run a comprehensive smoke flow on testnet (recipient not configured)", () => {});
  } else {
    it("can run a comprehensive smoke flow on testnet", async () => {
      const balanceQuery = new AccountBalanceQuery().setAccountId(
        AccountId.fromString(operatorId)
      );

      const cost = await api.estimateExecutableCost(client as any, balanceQuery);
      expect(cost).toBeInstanceOf(Hbar);

      const balance = await balanceQuery.execute(client.raw as any);
      expect(balance.hbars).toBeInstanceOf(Hbar);

      const handle = await client.transferHbar(
        recipientId,
        0.0001,
        "hierokit-smoke-transfer"
      );

      const receipt = await handle.wait(60_000);
      const record = await handle.getRecord(60_000);

      const normalizedReceipt = api.normalizeReceipt(receipt);
      const normalizedRecord = api.normalizeRecord(record);
      const breakdown = api.extractFeeFromRecord(record);

      expect(typeof normalizedReceipt.status).toBe("string");
      expect(typeof normalizedReceipt.success).toBe("boolean");
      expect(typeof normalizedRecord.status).toBe("string");
      expect(typeof normalizedRecord.success).toBe("boolean");
      expect(breakdown.chargedFee).not.toBeNull();
      expect(breakdown).toHaveProperty("maxFee");

      const intent = {
        type: "transfer-hbar",
        async toTransaction(innerClient: any) {
          return new TransferTransaction()
            .addHbarTransfer(
              innerClient.raw.operatorAccountId!,
              new Hbar(-0.0001)
            )
            .addHbarTransfer(recipientId, new Hbar(0.0001))
            .setTransactionMemo("hierokit-smoke-intent");
        },
      };

      const intentResult = await api.runIntent(client as any, intent as any, {
        timeout: 60_000,
      });
      const intentStatus = intentResult.receipt.status.toString();
      expect(intentStatus === "SUCCESS" || intentStatus === "Ok").toBe(true);

      const execTx = new TransferTransaction()
        .addHbarTransfer(
          client.raw.operatorAccountId!,
          new Hbar(-0.0001)
        )
        .addHbarTransfer(recipientId, new Hbar(0.0001))
        .setTransactionMemo("hierokit-smoke-execute");

      const execReceipt = await client.execute(execTx as any, { timeout: 60_000 });
      const execStatus = execReceipt.status.toString();
      expect(execStatus === "SUCCESS" || execStatus === "Ok").toBe(true);
    }, 60_000);
  }
});
