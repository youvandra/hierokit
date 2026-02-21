import { useState } from "react";
import type { ReactNode } from "react";
import { Hbar } from "@hiero-ledger/sdk";
import { HieroProvider } from "./core.js";
import {
  useTransferHbar,
  useTransferPreview,
  useTransferHistory,
} from "./transfers.js";

interface AppProps {
  children?: ReactNode;
}

export function HieroExampleApp(props: AppProps) {
  const [to, setTo] = useState("0.0.1002");
  const [amount, setAmount] = useState("1");

  return (
    <HieroProvider
      config={{
        network: "testnet",
        operator: {
          accountId: process.env.HIEROKIT_TEST_OPERATOR_ID as string,
          privateKey: process.env.HIEROKIT_TEST_OPERATOR_KEY as string,
        },
      }}
    >
      <div>
        <h2>Send HBAR</h2>
        <label>
          To:
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <label>
          Amount (HBAR):
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <SendHbarForm to={to} amount={amount} />
        <TransferHistory accountId={to} />
      </div>
      {props.children}
    </HieroProvider>
  );
}

interface SendHbarFormProps {
  to: string;
  amount: string;
}

function SendHbarForm(props: SendHbarFormProps) {
  const parsedAmount = Number(props.amount) || 0;

  const { flow, execute } = useTransferHbar();

  const { data: feeEstimate, status: previewStatus, refresh } =
    useTransferPreview({
      to: props.to,
      amount: parsedAmount,
    });

  const onSubmit = async () => {
    await execute({
      to: props.to,
      amount: new Hbar(parsedAmount),
    });
  };

  return (
    <div>
      <button onClick={onSubmit} disabled={flow.status === "submitting"}>
        {flow.status === "submitting" ? "Sending…" : "Send"}
      </button>
      <button onClick={refresh}>Estimate fee</button>
      <div>
        <p>Flow status: {flow.status}</p>
        <p>
          Preview status: {previewStatus} –{" "}
          {feeEstimate ? feeEstimate.toString() : "no estimate yet"}
        </p>
      </div>
    </div>
  );
}

interface TransferHistoryProps {
  accountId: string;
}

function TransferHistory(props: TransferHistoryProps) {
  const { data, status, refresh } = useTransferHistory({
    accountId: props.accountId,
  });

  return (
    <div>
      <h3>Recent transfers</h3>
      <button onClick={refresh}>Refresh history</button>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

