import { useEffect, useRef, useState } from "react";

type AgentStatus = "idle" | "running" | "success" | "error";

export interface PollingResult<T> {
  data: T | null;
  status: AgentStatus;
  error: unknown | null;
  start: () => void;
  stop: () => void;
  refresh: () => void;
}

interface PollingOptions {
  enabled?: boolean;
  immediate?: boolean;
}

export function usePollingQuery<T>(
  fn: () => Promise<T>,
  intervalMs: number,
  options: PollingOptions = {}
): PollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [manualTick, setManualTick] = useState(0);
  const enabledRef = useRef<boolean>(options.enabled ?? true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    enabledRef.current = options.enabled ?? true;
  }, [options.enabled]);

  useEffect(() => {
    if (!enabledRef.current) {
      clearTimer();
      setStatus("idle");
      return;
    }

    let cancelled = false;

    const runOnce = async () => {
      setStatus("running");
      setError(null);
      try {
        const result = await fn();
        if (cancelled) return;
        setData(result);
        setStatus("success");
      } catch (err) {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      }
    };

    if (options.immediate ?? true) {
      runOnce();
    }

    clearTimer();
    if (intervalMs > 0) {
      timerRef.current = setInterval(() => {
        if (!enabledRef.current) {
          return;
        }
        runOnce();
      }, intervalMs);
    }

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [fn, intervalMs, options.immediate, manualTick]);

  const start = () => {
    enabledRef.current = true;
    setManualTick((v) => v + 1);
  };

  const stop = () => {
    enabledRef.current = false;
    clearTimer();
    setStatus("idle");
  };

  const refresh = () => {
    setManualTick((v) => v + 1);
  };

  return { data, status, error, start, stop, refresh };
}

