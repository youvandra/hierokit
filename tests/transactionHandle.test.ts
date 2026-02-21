import { describe, it, expect, vi } from "vitest";
import { TransactionHandle } from "../src/TransactionHandle.js";

describe("TransactionHandle", () => {
  it("exposes transactionId from response", () => {
    const response: any = {
      transactionId: { toString: () => "tx-id-1" },
      getReceiptQuery: vi.fn(),
      getRecordQuery: vi.fn(),
    };
    const client: any = {};

    const handle = new TransactionHandle(response, client);
    expect(handle.transactionId).toBe("tx-id-1");
  });

  it("wait delegates to getReceiptQuery().execute", async () => {
    const execute = vi.fn().mockResolvedValue("receipt" as any);
    const getReceiptQuery = vi.fn(() => ({
      execute,
    }));
    const response: any = {
      transactionId: { toString: () => "tx-id-2" },
      getReceiptQuery,
      getRecordQuery: vi.fn(),
    };
    const client: any = {};

    const handle = new TransactionHandle(response, client);
    const timeout = 5000;
    const result = await handle.wait(timeout);

    expect(result).toBe("receipt");
    expect(getReceiptQuery).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(client, timeout);
  });

  it("getRecord delegates to getRecordQuery().execute", async () => {
    const execute = vi.fn().mockResolvedValue("record" as any);
    const getRecordQuery = vi.fn(() => ({
      execute,
    }));
    const response: any = {
      transactionId: { toString: () => "tx-id-3" },
      getReceiptQuery: vi.fn(),
      getRecordQuery,
    };
    const client: any = {};

    const handle = new TransactionHandle(response, client);
    const timeout = 2500;
    const result = await handle.getRecord(timeout);

    expect(result).toBe("record");
    expect(getRecordQuery).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(client, timeout);
  });
});

