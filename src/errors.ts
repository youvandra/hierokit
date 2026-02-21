import { Status } from "@hiero-ledger/sdk";

export type HieroErrorCode =
  | "NETWORK"
  | "PRECHECK"
  | "RECEIPT"
  | "TIMEOUT"
  | "UNKNOWN";

export interface HieroError {
  code: HieroErrorCode;
  message: string;
  status?: Status;
  cause?: unknown;
  retryable: boolean;
}

export function normalizeError(err: unknown): HieroError {
  const anyErr = err as any;

  const status: Status | undefined = anyErr?.status;
  const name: string = anyErr?.name ?? "Error";
  const message: string =
    typeof anyErr?.message === "string"
      ? anyErr.message
      : String(anyErr ?? "Unknown error");

  if (name === "MaxAttemptsOrTimeoutError") {
    return {
      code: "TIMEOUT",
      message,
      status,
      cause: err,
      retryable: true,
    };
  }

  if (status instanceof Status) {
    const retryable =
      status === Status.Busy ||
      status === Status.PlatformTransactionNotCreated ||
      status === Status.Unknown;

    const code: HieroErrorCode =
      name === "PrecheckStatusError"
        ? "PRECHECK"
        : name === "ReceiptStatusError" || name === "RecordStatusError"
        ? "RECEIPT"
        : "NETWORK";

    return {
      code,
      message,
      status,
      cause: err,
      retryable,
    };
  }

  return {
    code: "UNKNOWN",
    message,
    status,
    cause: err,
    retryable: false,
  };
}

export function isRetryableError(err: unknown): boolean {
  return normalizeError(err).retryable;
}

