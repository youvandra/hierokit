import { describe, it, expect, vi } from "vitest";
import type { HieroSigner } from "../src/types.js";
import { createCompositeSigner } from "../src/signer.js";

function createMockSigner(name: string): HieroSigner {
  const base: any = {
    name,
    getLedgerId: vi.fn(() => "ledger-" + name),
    getAccountId: vi.fn(() => "0.0." + name),
    getAccountKey: vi.fn(),
    getNetwork: vi.fn(() => ({})),
    getMirrorNetwork: vi.fn(() => []),
    sign: vi.fn(async () => [{ signer: name }]),
    getAccountBalance: vi.fn(),
    getAccountInfo: vi.fn(),
    getAccountRecords: vi.fn(),
    signTransaction: vi.fn(async (tx: any) => ({ ...tx, signedBy: name })),
    checkTransaction: vi.fn(async (tx: any) => ({ ...tx, checkedBy: name })),
    populateTransaction: vi.fn(async (tx: any) => ({ ...tx, populatedBy: name })),
    call: vi.fn(),
  };
  return base as HieroSigner;
}

describe("createCompositeSigner", () => {
  it("throws when no signers are provided", () => {
    expect(() => createCompositeSigner([] as HieroSigner[])).toThrow();
  });

  it("delegates readonly methods to the first signer", () => {
    const a = createMockSigner("a");
    const b = createMockSigner("b");

    const composite = createCompositeSigner([a, b]);
    expect(composite.getLedgerId()).toBe("ledger-a");
    expect(composite.getAccountId()).toBe("0.0.a");
    expect(a.getLedgerId).toHaveBeenCalledTimes(1);
    expect(b.getLedgerId).toHaveBeenCalledTimes(0);
  });

  it("aggregates signatures from all signers", async () => {
    const a = createMockSigner("a");
    const b = createMockSigner("b");

    const composite = createCompositeSigner([a, b]);
    const messages = [new Uint8Array([1, 2, 3])];
    const signatures = await composite.sign(messages);

    expect(signatures).toHaveLength(2);
    expect(a.sign).toHaveBeenCalledTimes(1);
    expect(b.sign).toHaveBeenCalledTimes(1);
  });

  it("applies transaction methods across signers in order", async () => {
    const a = createMockSigner("a");
    const b = createMockSigner("b");

    const composite = createCompositeSigner([a, b]);
    const tx: any = { id: "tx" };
    const populated = await composite.populateTransaction(tx);
    const checked = await composite.checkTransaction(populated);
    const signed = await composite.signTransaction(checked);

    expect(a.populateTransaction).toHaveBeenCalled();
    expect(b.populateTransaction).toHaveBeenCalled();
    expect(a.checkTransaction).toHaveBeenCalled();
    expect(b.checkTransaction).toHaveBeenCalled();
    expect(a.signTransaction).toHaveBeenCalled();
    expect(b.signTransaction).toHaveBeenCalled();
    expect(signed.id).toBe("tx");
  });
});

