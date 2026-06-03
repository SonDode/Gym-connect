import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { toast } from "sonner";
import type { SplitTemplate } from "@/types/workout";

async function authFetch(url: string, getToken: () => Promise<string | null>, options?: RequestInit) {
  const token = await getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res;
}

export function useSplits() {
  const { getToken, isSignedIn } = useAuth();
  const [splits, setSplits] = useState<SplitTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    authFetch("/api/splits", getToken)
      .then((r) => r.json())
      .then((data: SplitTemplate[]) => {
        setSplits(data);
        setLoaded(true);
      })
      .catch(() => {
        toast.error("Eroare la încărcarea rutinelor.");
        setLoaded(true);
      });
  }, [isSignedIn, getToken]);

  const upsertSplit = useCallback(
    async (split: SplitTemplate) => {
      const isExisting = splits.some((s) => s.id === split.id);
      const url = isExisting ? `/api/splits/${split.id}` : "/api/splits";
      const method = isExisting ? "PUT" : "POST";

      const res = await authFetch(url, getToken, {
        method,
        body: JSON.stringify(split),
      });
      const saved: SplitTemplate = await res.json();

      setSplits((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id);
        return idx >= 0 ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
      });
    },
    [splits, getToken],
  );

  const deleteSplit = useCallback(
    async (id: string) => {
      await authFetch(`/api/splits/${id}`, getToken, { method: "DELETE" });
      setSplits((prev) => prev.filter((s) => s.id !== id));
    },
    [getToken],
  );

  return { splits, loaded, upsertSplit, deleteSplit };
}
