import { describe, it, expect } from "vitest";
import { normalizeReceipt, normalizeRecord } from "../src/results.js";

describe("normalizeReceipt", () => {
  it("normalizes core receipt fields", () => {
    const receipt: any = {
      status: { toString: () => "SUCCESS" },
      transactionId: { toString: () => "tx-123" },
      accountId: { toString: () => "0.0.1001" },
    };

    const result = normalizeReceipt(receipt);
    expect(result.status).toBe("SUCCESS");
    expect(result.success).toBe(true);
    expect(result.transactionId).toBe("tx-123");
    expect(result.accountId).toBe("0.0.1001");
  });

  it("marks non-successful statuses as not successful", () => {
    const receipt: any = {
      status: { toString: () => "INSUFFICIENT_PAYER_BALANCE" },
    };

    const result = normalizeReceipt(receipt);
    expect(result.success).toBe(false);
  });
});

describe("normalizeRecord", () => {
  it("extends normalized receipt with record fields", () => {
    const record: any = {
      receipt: {
        status: { toString: () => "SUCCESS" },
      },
      consensusTimestamp: { toString: () => "123.456" },
      memo: "hello",
    };

    const result = normalizeRecord(record);
    expect(result.status).toBe("SUCCESS");
    expect(result.consensusTimestamp).toBe("123.456");
    expect(result.memo).toBe("hello");
  });
});

