import { useEffect, useState } from "react";
import { useMirrorNodeUrl } from "./core.js";

type QueryStatus = "idle" | "loading" | "success" | "error";

interface MirrorQueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: unknown | null;
  refresh: () => void;
}

interface MirrorRestOptions {
  query?: Record<string, string | number | boolean | null | undefined>;
  enabled?: boolean;
}

export function useMirrorRest<T = unknown>(
  path: string,
  options: MirrorRestOptions = {}
): MirrorQueryResult<T> {
  const baseUrl = useMirrorNodeUrl();
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!options.enabled) {
      setStatus("idle");
      return;
    }

    if (!baseUrl) {
      setStatus("error");
      setError(new Error("Mirror node URL is not configured"));
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const url = new URL(
      path.startsWith("/") ? path : `/${path}`,
      baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
    );

    const params = options.query ?? {};
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }

    fetch(url.toString())
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Mirror node error: ${res.status}`);
        }
        return (await res.json()) as T;
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [baseUrl, path, options.enabled, JSON.stringify(options.query), version]);

  const refresh = () => setVersion((v) => v + 1);

  return { data, status, error, refresh };
}

