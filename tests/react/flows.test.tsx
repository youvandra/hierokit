// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useEffect } from "react";
import type { TransactionReceipt } from "@hiero-ledger/sdk";
import {
  useTransactionFlow,
  useCreateFlow,
  useFlowStatus,
  useFlowReceipt,
  useFlowError,
  useFlowTimeout,
  type FlowHandle,
  type TransactionFlow,
} from "../../src/react/flows.js";
import {
  HieroProvider,
} from "../../src/react/core.js";
import type { HieroConfig } from "../../src/types.js";

interface FlowTestProps {
  onReady: (handle: FlowHandle<TransactionReceipt>) => void;
}

function TransactionFlowTest(props: FlowTestProps) {
  const handle = useTransactionFlow<TransactionReceipt>(async () => {
    return {
      status: {
        toString: () => "SUCCESS",
      },
    } as TransactionReceipt;
  });

  useEffect(() => {
    props.onReady(handle);
  }, [handle, props]);

  return (
    <div>
      <div data-testid="flow-status">{handle.status}</div>
      <div data-testid="flow-timeout">{String(handle.timeoutMs)}</div>
    </div>
  );
}

interface CreateFlowTestProps {
  intent: TransactionFlow<TransactionReceipt>;
  timeoutMs: number;
  onReady: (handle: FlowHandle<TransactionReceipt>) => void;
}

function CreateFlowTest(props: CreateFlowTestProps) {
  const handle = useCreateFlow<TransactionReceipt>(props.intent, {
    timeoutMs: props.timeoutMs,
  });

  useEffect(() => {
    props.onReady(handle);
  }, [handle, props]);

  return (
    <div>
      <div data-testid="create-flow-status">{handle.status}</div>
      <div data-testid="create-flow-timeout">{String(handle.timeoutMs)}</div>
    </div>
  );
}

describe("transaction flow hooks", () => {
  it("useTransactionFlow runs the intent and exposes receipt and status", async () => {
    const config: HieroConfig = {
      network: "testnet",
    };

    let capturedHandle: FlowHandle<TransactionReceipt> | null = null;

    render(
      <HieroProvider config={config}>
        <TransactionFlowTest
          onReady={(handle) => {
            capturedHandle = handle;
          }}
        />
      </HieroProvider>
    );

    expect(capturedHandle).not.toBeNull();
    expect(useFlowStatus(capturedHandle!)).toBe("idle");

    await act(async () => {
      await capturedHandle!.start();
    });

    expect(screen.getByTestId("flow-status").textContent).toBe("success");
    expect(useFlowStatus(capturedHandle!)).toBe("success");
    expect(useFlowReceipt(capturedHandle!)).not.toBeNull();
    expect(useFlowError(capturedHandle!)).toBeNull();
  });

  it("useCreateFlow creates a handle that does not auto-start and respects timeout", async () => {
    const config: HieroConfig = {
      network: "testnet",
    };

    const receipt: TransactionReceipt = {
      status: {
        toString: () => "SUCCESS",
      },
    } as any;

    const intent: TransactionFlow<TransactionReceipt> = async () => {
      return receipt;
    };

    let capturedHandle: FlowHandle<TransactionReceipt> | null = null;

    render(
      <HieroProvider config={config}>
        <CreateFlowTest
          intent={intent}
          timeoutMs={5000}
          onReady={(handle) => {
            capturedHandle = handle;
          }}
        />
      </HieroProvider>
    );

    expect(capturedHandle).not.toBeNull();

    expect(screen.getByTestId("create-flow-status").textContent).toBe("idle");
    expect(useFlowStatus(capturedHandle!)).toBe("idle");
    expect(useFlowTimeout(capturedHandle!)).toBe(5000);
    expect(screen.getByTestId("create-flow-timeout").textContent).toBe("5000");

    await act(async () => {
      await capturedHandle!.start();
    });

    expect(screen.getByTestId("create-flow-status").textContent).toBe("success");
    expect(useFlowStatus(capturedHandle!)).toBe("success");
    expect(useFlowReceipt(capturedHandle!)).toBe(receipt);
  });
}
);

