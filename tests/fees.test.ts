import { describe, it, expect, vi } from "vitest";
import type { Client } from "../src/Client.js";
import {
  estimateExecutableCost,
  extractFeeFromRecord,
  type FeeBreakdown,
} from "../src/fees.js";

describe("estimateExecutableCost", () => {
  it("calls executable.getCost with underlying SDK client", async () => {
    const rawClient = {};
    const client: any = {
      raw: rawClient,
    };

    const getCost = vi.fn(async () => 10 as any);
    const executable = { getCost };

    const cost = await estimateExecutableCost(client as Client, executable);

    expect(cost).toBe(10);
    expect(getCost).toHaveBeenCalledWith(rawClient);
  });
});

describe("extractFeeFromRecord", () => {
  it("extracts charged and max fee when present", () => {
    const record: any = {
      transactionFee: 5,
      transaction: {
        transactionFee: 7,
      },
    };

    const result: FeeBreakdown = extractFeeFromRecord(record);
    expect(result.chargedFee).toBe(5);
    expect(result.maxFee).toBe(7);
  });

  it("handles missing fields", () => {
    const record: any = {};
    const result: FeeBreakdown = extractFeeFromRecord(record);
    expect(result.chargedFee).toBeNull();
    expect(result.maxFee).toBeNull();
  });
});

