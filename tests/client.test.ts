import { describe, it, expect, vi } from "vitest";
import { Client } from "../src/Client.js";
import { HieroConfig } from "../src/types.js";

// Mock the underlying SDK client
vi.mock("@hashgraph/sdk", async () => {
  const actual = await vi.importActual("@hashgraph/sdk");
  return {
    ...actual,
    Client: {
      forTestnet: vi.fn().mockReturnValue({
        setOperator: vi.fn(),
        setMirrorNetwork: vi.fn(),
      }),
      forMainnet: vi.fn().mockReturnValue({
        setOperator: vi.fn(),
        setMirrorNetwork: vi.fn(),
      }),
    },
  };
});

describe("HieroKit Client", () => {
  it("should initialize with testnet configuration", () => {
    const config: HieroConfig = {
      network: "testnet",
      operator: {
        accountId: "0.0.123",
        privateKey: "302e020100300506032b657004220420" + "0".repeat(64), // Mock key
      },
    };

    const client = new Client(config);
    expect(client).toBeDefined();
    expect(client.raw).toBeDefined();
  });

  it("should throw error for invalid network", () => {
    const config: HieroConfig = {
      network: "invalid" as any,
    };

    expect(() => new Client(config)).toThrow();
  });
});
