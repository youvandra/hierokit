import { describe, it, expect, vi } from "vitest";
import { Client } from "../src/Client.js";
import { HieroConfig } from "../src/types.js";
import { Client as SDKClient, Status } from "@hiero-ledger/sdk";

vi.mock("@hiero-ledger/sdk", async () => {
  const actual = await vi.importActual<typeof import("@hiero-ledger/sdk")>(
    "@hiero-ledger/sdk"
  );
  return {
    ...actual,
    Client: {
      forTestnet: vi.fn().mockReturnValue({
        setOperator: vi.fn(),
        setMirrorNetwork: vi.fn(),
        operatorAccountId: "0.0.operator",
      }),
      forMainnet: vi.fn().mockReturnValue({
        setOperator: vi.fn(),
        setMirrorNetwork: vi.fn(),
        operatorAccountId: "0.0.operator",
      }),
      forPreviewnet: vi.fn().mockReturnValue({
        setOperator: vi.fn(),
        setMirrorNetwork: vi.fn(),
        operatorAccountId: "0.0.operator",
      }),
      forNetwork: vi.fn().mockReturnValue({
        setOperator: vi.fn(),
        setMirrorNetwork: vi.fn(),
        operatorAccountId: "0.0.operator",
      }),
    },
    Hbar: class {
      amount: number;
      constructor(amount: number) {
        this.amount = amount;
      }
      negated() {
        return new (this.constructor as typeof import("@hiero-ledger/sdk").Hbar)(
          -this.amount
        );
      }
    } as typeof actual.Hbar,
    TransferTransaction: class {
      transfers: unknown[] = [];
      memo: string | undefined;
      addHbarTransfer(accountId: unknown, amount: unknown) {
        this.transfers.push({ accountId, amount });
        return this;
      }
      setTransactionMemo(memo: string) {
        this.memo = memo;
        return this;
      }
    } as typeof actual.TransferTransaction,
  };
});

describe("HieroKit Client", () => {
  it("should initialize with testnet configuration", () => {
    const config: HieroConfig = {
      network: "testnet",
      operator: {
        accountId: "0.0.123",
        privateKey: "302e020100300506032b657004220420" + "0".repeat(64), // Mock key
      },
    };

    const client = new Client(config);
    expect(client).toBeDefined();
    expect(client.raw).toBeDefined();
  });

  it("sets operator and mirror network when provided", () => {
    const config: HieroConfig = {
      network: "testnet",
      operator: {
        accountId: "0.0.123",
        privateKey: "302e020100300506032b657004220420" + "1".repeat(64),
      },
      mirrorNodeUrl: "https://mirror.testnet",
    };

    const client = new Client(config);
    const raw = client.raw as any;

    expect(raw.setOperator).toHaveBeenCalledWith(
      config.operator?.accountId,
      config.operator?.privateKey
    );
    expect(raw.setMirrorNetwork).toHaveBeenCalledWith([
      config.mirrorNodeUrl,
    ]);
  });

  it("uses forNetwork for custom network configurations", () => {
    const customNetwork = { "127.0.0.1:50211": "0.0.3" } as any;
    const config: HieroConfig = {
      network: customNetwork,
    };

    const client = new Client(config);
    expect(client.raw).toBeDefined();
    expect((SDKClient.forNetwork as any)).toHaveBeenCalledWith(customNetwork);
  });

  it("applies external signers before executing transactions", async () => {
    const order: string[] = [];

    const signerA: any = {
      populateTransaction: vi.fn(async (tx: any) => {
        order.push("a-populate");
        return { ...tx, aPopulated: true };
      }),
      checkTransaction: vi.fn(async (tx: any) => {
        order.push("a-check");
        return tx;
      }),
      signTransaction: vi.fn(async (tx: any) => {
        order.push("a-sign");
        return tx;
      }),
    };

    const signerB: any = {
      populateTransaction: vi.fn(async (tx: any) => {
        order.push("b-populate");
        return { ...tx, bPopulated: true };
      }),
      checkTransaction: vi.fn(async (tx: any) => {
        order.push("b-check");
        return tx;
      }),
      signTransaction: vi.fn(async (tx: any) => {
        order.push("b-sign");
        return tx;
      }),
    };

    const config: HieroConfig = {
      network: "testnet",
      signers: [signerA, signerB],
    };

    const client = new Client(config);

    const tx: any = {
      execute: vi.fn().mockResolvedValue({
        transactionId: { toString: () => "tx-id" },
        getReceiptQuery: () => ({
          execute: vi.fn().mockResolvedValue({} as any),
        }),
        getRecordQuery: () => ({
          execute: vi.fn().mockResolvedValue({} as any),
        }),
      }),
    };

    await client.submit(tx);

    expect(order).toEqual([
      "a-populate",
      "a-check",
      "a-sign",
      "b-populate",
      "b-check",
      "b-sign",
    ]);
    expect(tx.execute).toHaveBeenCalledTimes(1);
  });

  it("retries on retryable status errors", async () => {
    const config: HieroConfig = {
      network: "testnet",
      maxRetries: 3,
    };

    const client = new Client(config);

    const error: any = new Error("busy");
    error.name = "PrecheckStatusError";
    error.status = Status.Busy;

    const tx: any = {
      execute: vi
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValue({
          transactionId: { toString: () => "tx-id" },
          getReceiptQuery: () => ({
            execute: vi.fn().mockResolvedValue({} as any),
          }),
          getRecordQuery: () => ({
            execute: vi.fn().mockResolvedValue({} as any),
          }),
        }),
    };

    await client.submit(tx, { maxRetries: 2 });

    expect(tx.execute).toHaveBeenCalledTimes(2);
  });

  it("does not retry on non-retryable status errors", async () => {
    const config: HieroConfig = {
      network: "testnet",
      maxRetries: 3,
    };

    const client = new Client(config);

    const error: any = new Error("invalid signature");
    error.status = Status.InvalidSignature;

    const tx: any = {
      execute: vi.fn().mockRejectedValue(error),
    };

    await expect(client.submit(tx, { maxRetries: 2 })).rejects.toBe(error);
    expect(tx.execute).toHaveBeenCalledTimes(1);
  });

  it("execute delegates to submit and waits for receipt", async () => {
    const config: HieroConfig = {
      network: "testnet",
    };

    const client = new Client(config);
    const tx: any = {};

    const handle: any = {
      wait: vi.fn().mockResolvedValue("receipt"),
    };

    const submitSpy = vi
      .spyOn(client, "submit")
      .mockResolvedValue(handle);

    const result = await client.execute(tx, { timeout: 1234 });

    expect(submitSpy).toHaveBeenCalledWith(tx, { timeout: 1234 });
    expect(handle.wait).toHaveBeenCalledWith(1234);
    expect(result).toBe("receipt");

    submitSpy.mockRestore();
  });

  it("prepareFlow reuses prepared transaction and uses internal execution", async () => {
    const config: HieroConfig = {
      network: "testnet",
      defaultTimeoutMs: 5000,
      maxRetries: 2,
    };

    const client = new Client(config);

    const factory = vi.fn(async () => ({ id: "tx" } as any));

    const flow = client.prepareFlow(factory, {
      timeout: 4000,
      maxRetries: 1,
    });

    const prepared1 = await flow.prepare();
    const prepared2 = await flow.prepare();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(prepared1).toBe(prepared2);

    const executeWithRetrySpy = vi
      .spyOn(client as any, "_executeWithRetry")
      .mockResolvedValue({
        transactionId: { toString: () => "tx-id" },
        getReceiptQuery: () => ({
          execute: vi.fn().mockResolvedValue({} as any),
        }),
        getRecordQuery: () => ({
          execute: vi.fn().mockResolvedValue({} as any),
        }),
      });

    await flow.submit();

    expect(executeWithRetrySpy).toHaveBeenCalledWith(prepared1, 4000, 1);

    executeWithRetrySpy.mockRestore();
  });

  it("transferHbar creates a transfer and delegates to submit", async () => {
    const config: HieroConfig = {
      network: "testnet",
      operator: {
        accountId: "0.0.1001",
        privateKey: "302e020100300506032b657004220420" + "2".repeat(64),
      },
    };

    const client = new Client(config);

    const submitSpy = vi
      .spyOn(client, "submit")
      .mockResolvedValue({} as any);

    await client.transferHbar("0.0.2002", 10, "test memo");

    expect(submitSpy).toHaveBeenCalledTimes(1);

    submitSpy.mockRestore();
  });
});
