import { useRef, useMemo } from "react";
import {
  AccountId,
  AccountUpdateTransaction,
  type TransactionReceipt,
} from "@hiero-ledger/sdk";
import { useHieroClient } from "./core.js";
import {
  useTransactionFlow,
  type TransactionFlow,
  type TransactionFlowOptions,
  type UseFlowActionResult,
} from "./flows.js";

function useResolvedAccountId(explicit?: string | AccountId | null) {
  const client = useHieroClient();

  return useMemo(() => {
    if (explicit) {
      return typeof explicit === "string"
        ? AccountId.fromString(explicit)
        : explicit;
    }

    const operatorId = client.raw.operatorAccountId;
    if (!operatorId) {
      return null;
    }
    return operatorId;
  }, [client, explicit]);
}

export interface UseUpdateAccountStakingArgs {
  accountId?: string | AccountId | null;
  stakedAccountId?: string | AccountId | null;
  stakedNodeId?: number | null;
  declineStakingReward?: boolean | null;
}

export function useUpdateAccountStaking(
  options?: TransactionFlowOptions
): UseFlowActionResult<UseUpdateAccountStakingArgs, TransactionReceipt> {
  const defaultAccountId = useResolvedAccountId(null);
  const client = useHieroClient();
  const argsRef = useRef<UseUpdateAccountStakingArgs | null>(null);

  const intent: TransactionFlow<TransactionReceipt> = async () => {
    const args = argsRef.current;
    if (!args) {
      throw new Error("Missing staking update args");
    }

    let targetAccount: AccountId | null = null;

    if (args.accountId != null) {
      targetAccount =
        typeof args.accountId === "string"
          ? AccountId.fromString(args.accountId)
          : args.accountId;
    } else {
      targetAccount = defaultAccountId;
    }
    if (!targetAccount) {
      throw new Error("No account available for staking update");
    }

    const tx = new AccountUpdateTransaction({
      accountId: targetAccount,
    });

    if (args.stakedAccountId !== undefined) {
      if (args.stakedAccountId === null) {
        tx.clearStakedAccountId();
      } else {
        const stakedAccountId =
          typeof args.stakedAccountId === "string"
            ? AccountId.fromString(args.stakedAccountId)
            : args.stakedAccountId;
        tx.setStakedAccountId(stakedAccountId);
      }
    }

    if (args.stakedNodeId !== undefined) {
      if (args.stakedNodeId === null) {
        tx.clearStakedNodeId();
      } else {
        tx.setStakedNodeId(args.stakedNodeId);
      }
    }

    if (args.declineStakingReward !== undefined) {
      if (args.declineStakingReward !== null) {
        tx.setDeclineStakingReward(args.declineStakingReward);
      }
    }

    const handle = await client.submit(tx, {
      timeout: options?.timeoutMs,
    });
    return handle.wait(options?.timeoutMs);
  };

  const flow = useTransactionFlow(intent, {
    ...options,
    autoStart: false,
  });

  const execute = async (args: UseUpdateAccountStakingArgs) => {
    argsRef.current = args;
    await flow.start();
  };

  return { flow, execute };
}
