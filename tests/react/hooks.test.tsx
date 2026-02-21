// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useEffect } from "react";
import type { TransactionReceipt } from "@hiero-ledger/sdk";
import { Client } from "../../src/Client.js";
import {
  HieroProvider,
  useHieroClient,
  useNetwork,
  useNetworkAddressBook,
} from "../../src/react/core.js";
import { useTransferHbar } from "../../src/react/transfers.js";
import type { HieroConfig } from "../../src/types.js";

function ShowNetwork() {
  const client = useHieroClient();
  return (
    <div data-testid="network">{String(client.config.network)}</div>
  );
}

interface TestTransferProps {
  onReady: (execute: (args: {
    to: string;
    amount: number;
    memo?: string;
  }) => Promise<void>) => void;
}

function TestTransfer(props: TestTransferProps) {
  const { flow, execute } = useTransferHbar({ timeoutMs: 1000 });

  useEffect(() => {
    props.onReady(execute);
  }, [execute, props]);

  return <div data-testid="status">{flow.status}</div>;
}

function ShowNetworkHooks() {
  const network = useNetwork();
  return <div data-testid="network-hook">{String(network)}</div>;
}

function ShowAddressBookStatus() {
  const { status } = useNetworkAddressBook();
  return <div data-testid="addressbook-status">{status}</div>;
}

describe("React hooks", () => {
  it("provides client via HieroProvider and useHieroClient", () => {
    const config: HieroConfig = {
      network: "testnet",
    };

    render(
      <HieroProvider config={config}>
        <ShowNetwork />
      </HieroProvider>
    );

    expect(screen.getByTestId("network").textContent).toBe("testnet");
  });

  it("exposes network via useNetwork and fetches address book", async () => {
    const config: HieroConfig = {
      network: "testnet",
    };

    render(
      <HieroProvider config={config}>
        <ShowNetworkHooks />
        <ShowAddressBookStatus />
      </HieroProvider>
    );

    expect(screen.getByTestId("network-hook").textContent).toBe("testnet");
    expect(screen.getByTestId("addressbook-status").textContent).toBe("loading");
  });

  it("useTransferHbar uses client.transferHbar with provided arguments", async () => {
    const config: HieroConfig = {
      network: "testnet",
      operator: {
        accountId: "0.0.1001",
      },
    };

    const receipt: TransactionReceipt = {
      status: {
        toString: () => "SUCCESS",
      },
    } as any;

    const transferSpy = vi
      .spyOn(Client.prototype, "transferHbar")
      .mockResolvedValue({
        wait: vi.fn().mockResolvedValue(receipt),
      } as any);

    let capturedExecute:
      | ((
          args: {
            to: string;
            amount: number;
            memo?: string;
          }
        ) => Promise<void>)
      | null = null;

    render(
      <HieroProvider config={config}>
        <TestTransfer
          onReady={(execute) => {
            capturedExecute = execute;
          }}
        />
      </HieroProvider>
    );

    expect(capturedExecute).not.toBeNull();

    await act(async () => {
      await capturedExecute!({
        to: "0.0.1234",
        amount: 1,
        memo: "test",
      });
    });

    expect(transferSpy).toHaveBeenCalledWith("0.0.1234", 1, "test");

    transferSpy.mockRestore();
  });
});
