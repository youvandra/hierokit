import { describe, it, expect, vi } from "vitest";
import type { Transaction } from "@hiero-ledger/sdk";
import type { Client } from "../src/Client.js";
import { runIntent, type TransactionIntent } from "../src/intent.js";

describe("runIntent", () => {
  it("runs intent and returns parsed result", async () => {
    const toTransaction = vi.fn(
      async () => null as unknown as Transaction
    );
    const parse = vi.fn(() => ({ ok: true }));

    const intent: TransactionIntent<{ ok: boolean }> = {
      type: "test",
      toTransaction,
      parse,
    };

    const handle: any = {
      wait: vi.fn().mockResolvedValue("receipt" as any),
      getRecord: vi.fn().mockResolvedValue("record" as any),
    };

    const client: any = {
      submit: vi.fn().mockResolvedValue(handle),
    };

    const result = await runIntent(client as Client, intent);

    expect(toTransaction).toHaveBeenCalledWith(client);
    expect(client.submit).toHaveBeenCalled();
    expect(handle.wait).toHaveBeenCalled();
    expect(handle.getRecord).toHaveBeenCalled();
    expect(parse).toHaveBeenCalledWith("receipt", "record");
    expect(result.parsed).toEqual({ ok: true });
  });

  it("handles missing record gracefully", async () => {
    const intent: TransactionIntent = {
      type: "test",
      async toTransaction() {
        return {} as Transaction;
      },
    };

    const handle: any = {
      wait: vi.fn().mockResolvedValue("receipt" as any),
      getRecord: vi.fn().mockRejectedValue(new Error("no record")),
    };

    const client: any = {
      submit: vi.fn().mockResolvedValue(handle),
    };

    const result = await runIntent(client as Client, intent);

    expect(result.record).toBeNull();
    expect(result.parsed).toBeNull();
  });
});
