// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useEffect } from "react";
import type { TransactionReceipt } from "@hiero-ledger/sdk";
import { TokenCreateTransaction } from "@hiero-ledger/sdk";
import {
  HieroProvider,
  useHieroClient,
} from "../../src/react/core.js";
import {
  useCreateFungibleToken,
  type UseCreateFungibleTokenArgs,
} from "../../src/react/tokens.js";
import type { HieroConfig } from "../../src/types.js";

interface CreateTokenTestProps {
  onReady: (
    execute: (args: UseCreateFungibleTokenArgs) => Promise<void>
  ) => void;
  onClient: (client: unknown) => void;
}

function CreateTokenTest(props: CreateTokenTestProps) {
  const client = useHieroClient();
  const { flow, execute } = useCreateFungibleToken({ timeoutMs: 1000 });

  useEffect(() => {
    props.onReady(execute);
    props.onClient(client);
  }, [client, execute, props]);

  return <div data-testid="status">{flow.status}</div>;
}

describe("token flow hooks", () => {
  it("useCreateFungibleToken constructs a token create transaction and submits it", async () => {
    const config: HieroConfig = {
      network: "testnet",
      operator: {
        accountId: "0.0.1001",
        privateKey:
          "302e020100300506032b657004220420" + "3".repeat(64),
      },
    };

    const receipt: TransactionReceipt = {
      status: {
        toString: () => "SUCCESS",
      },
    } as any;

    let capturedExecute:
      | ((
          args: UseCreateFungibleTokenArgs
        ) => Promise<void>)
      | null = null;

    let capturedClient: any = null;

    render(
      <HieroProvider config={config}>
        <CreateTokenTest
          onReady={(execute) => {
            capturedExecute = execute;
          }}
          onClient={(client) => {
            capturedClient = client;
          }}
        />
      </HieroProvider>
    );

    expect(capturedExecute).not.toBeNull();
    expect(capturedClient).not.toBeNull();

    const submitSpy = vi
      .spyOn(capturedClient, "submit")
      .mockResolvedValue({
        wait: vi.fn().mockResolvedValue(receipt),
      } as any);
    expect(screen.getByTestId("status").textContent).toBe("idle");

    await act(async () => {
      await capturedExecute!({
        name: "Test Token",
        symbol: "TT",
        decimals: 2,
        initialSupply: 1000,
      });
    });

    expect(submitSpy).toHaveBeenCalledTimes(1);

    const txArg = submitSpy.mock.calls[0][0];
    expect(txArg).toBeInstanceOf(TokenCreateTransaction);

    submitSpy.mockRestore();
  });
}
);
