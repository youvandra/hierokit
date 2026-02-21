import { describe, it, expect } from "vitest";
import { Status } from "@hiero-ledger/sdk";
import { normalizeError, isRetryableError } from "../src/errors.js";

describe("normalizeError", () => {
  it("classifies timeout errors as TIMEOUT and retryable", () => {
    const err = { name: "MaxAttemptsOrTimeoutError", message: "timeout" };
    const result = normalizeError(err);
    expect(result.code).toBe("TIMEOUT");
    expect(result.retryable).toBe(true);
  });

  it("classifies precheck errors with status", () => {
    const err: any = new Error("precheck");
    err.name = "PrecheckStatusError";
    err.status = Status.Busy;
    const result = normalizeError(err);
    expect(result.code).toBe("PRECHECK");
    expect(result.status).toBe(Status.Busy);
    expect(result.retryable).toBe(true);
  });

  it("classifies receipt errors as non-retryable", () => {
    const err: any = new Error("receipt");
    err.name = "ReceiptStatusError";
    err.status = Status.InvalidSignature;
    const result = normalizeError(err);
    expect(result.code).toBe("RECEIPT");
    expect(result.retryable).toBe(false);
  });

  it("falls back to UNKNOWN for non-SDK errors", () => {
    const err = new Error("other");
    const result = normalizeError(err);
    expect(result.code).toBe("UNKNOWN");
    expect(result.retryable).toBe(false);
  });
});

describe("isRetryableError", () => {
  it("delegates to normalizeError", () => {
    const err: any = new Error("busy");
    err.status = Status.Busy;
    const retryable = isRetryableError(err);
    expect(retryable).toBe(true);
  });
});

