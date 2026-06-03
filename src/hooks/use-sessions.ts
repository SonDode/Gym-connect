import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { toast } from "sonner";
import type { WorkoutSession } from "@/types/workout";

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

export function useSessions() {
  const { getToken, isSignedIn } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    authFetch("/api/sessions", getToken)
      .then((r) => r.json())
      .then((data: WorkoutSession[]) => {
        setSessions(data);
        setLoaded(true);
      })
      .catch(() => {
        toast.error("Eroare la încărcarea istoricului.");
        setLoaded(true);
      });
  }, [isSignedIn, getToken]);

  const addSession = useCallback(
    async (session: WorkoutSession) => {
      // Optimistic update — arata imediat in UI
      setSessions((prev) => [session, ...prev]);

      const { id: _tempId, ...body } = session;
      const res = await authFetch("/api/sessions", getToken, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const saved: WorkoutSession = await res.json();

      // Inlocuieste sesiunea temporara cu cea salvata de server (cu id real)
      setSessions((prev) => prev.map((s) => (s.id === session.id ? saved : s)));
    },
    [getToken],
  );

  return { sessions, loaded, addSession };
}
