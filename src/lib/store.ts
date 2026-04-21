// Store local pentru date utilizator (split-uri custom + sesiuni salvate).
// Persistă în localStorage. Înlocuiește temporar baza de date.
// Schema datelor = viitoarea schemă Supabase.

import { useEffect, useState, useCallback } from "react";
import { DEFAULT_SPLITS, generateMockHistory } from "@/data/mock-history";
import type { SplitTemplate, WorkoutSession } from "@/data/mock-history";

const SPLITS_KEY = "forcelab.splits";
const SESSIONS_KEY = "forcelab.sessions";
const SEED_KEY = "forcelab.seeded";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedIfNeeded() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEED_KEY) === "1") return;
  writeJSON(SPLITS_KEY, DEFAULT_SPLITS);
  writeJSON(SESSIONS_KEY, generateMockHistory());
  window.localStorage.setItem(SEED_KEY, "1");
}

export function useSplits() {
  const [splits, setSplits] = useState<SplitTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    seedIfNeeded();
    setSplits(readJSON<SplitTemplate[]>(SPLITS_KEY, DEFAULT_SPLITS));
    setLoaded(true);
  }, []);

  const upsertSplit = useCallback((split: SplitTemplate) => {
    setSplits((prev) => {
      const idx = prev.findIndex((s) => s.id === split.id);
      const next =
        idx >= 0
          ? prev.map((s) => (s.id === split.id ? split : s))
          : [...prev, split];
      writeJSON(SPLITS_KEY, next);
      return next;
    });
  }, []);

  const deleteSplit = useCallback((id: string) => {
    setSplits((prev) => {
      const next = prev.filter((s) => s.id !== id);
      writeJSON(SPLITS_KEY, next);
      return next;
    });
  }, []);

  return { splits, loaded, upsertSplit, deleteSplit };
}

export function useSessions() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    seedIfNeeded();
    setSessions(readJSON<WorkoutSession[]>(SESSIONS_KEY, generateMockHistory()));
    setLoaded(true);
  }, []);

  const addSession = useCallback((session: WorkoutSession) => {
    setSessions((prev) => {
      const next = [session, ...prev];
      writeJSON(SESSIONS_KEY, next);
      return next;
    });
  }, []);

  return { sessions, loaded, addSession };
}
