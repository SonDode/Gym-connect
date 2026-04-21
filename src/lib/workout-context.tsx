// Context pentru sesiunea de antrenament activă.
// Implementează "Optimistic UI" — schimbările se reflectă instant local.

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SplitTemplate, WorkoutSession, WorkoutSet } from "@/data/mock-history";
import { useSessions } from "./store";

type ActiveSet = {
  id: string;
  exerciseId: string;
  setOrder: number;
  weight: number;
  reps: number;
  rir: number;
  isWarmup: boolean;
  completed: boolean;
};

type ActiveSession = {
  splitId: string;
  splitName: string;
  startedAt: string;
  sets: ActiveSet[];
};

type Action =
  | { type: "START"; split: SplitTemplate; primedSets: ActiveSet[] }
  | { type: "ADD_SET"; exerciseId: string; templateSet?: Partial<ActiveSet> }
  | { type: "UPDATE_SET"; setId: string; patch: Partial<ActiveSet> }
  | { type: "REMOVE_SET"; setId: string }
  | { type: "TOGGLE_COMPLETE"; setId: string }
  | { type: "RESET" };

function reducer(state: ActiveSession | null, action: Action): ActiveSession | null {
  switch (action.type) {
    case "START":
      return {
        splitId: action.split.id,
        splitName: action.split.name,
        startedAt: new Date().toISOString(),
        sets: action.primedSets,
      };
    case "RESET":
      return null;
    default:
      if (!state) return state;
      switch (action.type) {
        case "ADD_SET": {
          const existing = state.sets.filter((s) => s.exerciseId === action.exerciseId);
          const last = existing[existing.length - 1];
          const newSet: ActiveSet = {
            id: `set-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            exerciseId: action.exerciseId,
            setOrder: existing.length,
            weight: action.templateSet?.weight ?? last?.weight ?? 20,
            reps: action.templateSet?.reps ?? last?.reps ?? 8,
            rir: action.templateSet?.rir ?? 2,
            isWarmup: action.templateSet?.isWarmup ?? false,
            completed: false,
          };
          return { ...state, sets: [...state.sets, newSet] };
        }
        case "UPDATE_SET":
          return {
            ...state,
            sets: state.sets.map((s) =>
              s.id === action.setId ? { ...s, ...action.patch } : s
            ),
          };
        case "REMOVE_SET":
          return { ...state, sets: state.sets.filter((s) => s.id !== action.setId) };
        case "TOGGLE_COMPLETE":
          return {
            ...state,
            sets: state.sets.map((s) =>
              s.id === action.setId ? { ...s, completed: !s.completed } : s
            ),
          };
        default:
          return state;
      }
  }
}

type WorkoutContextValue = {
  active: ActiveSession | null;
  startWorkout: (split: SplitTemplate, lastSets?: WorkoutSet[]) => void;
  addSet: (exerciseId: string, template?: Partial<ActiveSet>) => void;
  updateSet: (setId: string, patch: Partial<ActiveSet>) => void;
  removeSet: (setId: string) => void;
  toggleComplete: (setId: string) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  // Rest timer
  restRemaining: number;
  startRest: (seconds: number) => void;
  stopRest: () => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

const ACTIVE_KEY = "forcelab.active-session";

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [active, dispatch] = useReducer(reducer, null);
  const { addSession } = useSessions();
  const [restRemaining, setRestRemaining] = useState(0);

  // Persistă sesiunea activă (recovery la refresh)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(ACTIVE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ActiveSession;
        // Hidratăm prin START hack? Mai simplu: nu hidratăm dacă e mai veche de 6h
        const ageMs = Date.now() - new Date(parsed.startedAt).getTime();
        if (ageMs < 6 * 60 * 60 * 1000) {
          // re-injectăm
          dispatch({
            type: "START",
            split: { id: parsed.splitId, name: parsed.splitName, description: "", exercises: [] },
            primedSets: parsed.sets,
          });
        } else {
          window.localStorage.removeItem(ACTIVE_KEY);
        }
      } catch {
        window.localStorage.removeItem(ACTIVE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (active) {
      window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
    } else {
      window.localStorage.removeItem(ACTIVE_KEY);
    }
  }, [active]);

  // Rest timer
  useEffect(() => {
    if (restRemaining <= 0) return;
    const t = setInterval(() => {
      setRestRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [restRemaining]);

  const startWorkout = useCallback(
    (split: SplitTemplate, lastSets?: WorkoutSet[]) => {
      // Smart Defaults: pre-completăm cu ultima performanță
      const primed: ActiveSet[] = [];
      split.exercises
        .sort((a, b) => a.order - b.order)
        .forEach((sx) => {
          const previous = (lastSets ?? [])
            .filter((s) => s.exerciseId === sx.exerciseId && !s.isWarmup)
            .sort((a, b) => a.setOrder - b.setOrder);
          for (let i = 0; i < sx.targetSets; i++) {
            const prev = previous[i] ?? previous[previous.length - 1];
            primed.push({
              id: `set-${Date.now()}-${sx.exerciseId}-${i}`,
              exerciseId: sx.exerciseId,
              setOrder: i,
              weight: prev?.weight ?? 20,
              reps: prev?.reps ?? (Number(sx.targetRepRange.split("-")[0]) || 8),
              rir: 2,
              isWarmup: false,
              completed: false,
            });
          }
        });
      dispatch({ type: "START", split, primedSets: primed });
    },
    []
  );

  const addSet = useCallback((exerciseId: string, template?: Partial<ActiveSet>) => {
    dispatch({ type: "ADD_SET", exerciseId, templateSet: template });
  }, []);
  const updateSet = useCallback((setId: string, patch: Partial<ActiveSet>) => {
    dispatch({ type: "UPDATE_SET", setId, patch });
  }, []);
  const removeSet = useCallback((setId: string) => {
    dispatch({ type: "REMOVE_SET", setId });
  }, []);
  const toggleComplete = useCallback((setId: string) => {
    dispatch({ type: "TOGGLE_COMPLETE", setId });
  }, []);

  const finishWorkout = useCallback(() => {
    if (!active) return;
    const completedSets = active.sets.filter((s) => s.completed);
    if (completedSets.length === 0) {
      dispatch({ type: "RESET" });
      return;
    }
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      splitId: active.splitId,
      splitName: active.splitName,
      date: active.startedAt,
      durationSeconds: Math.round(
        (Date.now() - new Date(active.startedAt).getTime()) / 1000
      ),
      sets: completedSets.map((s, idx) => ({
        id: `s-${Date.now()}-${idx}`,
        exerciseId: s.exerciseId,
        setOrder: s.setOrder,
        weight: s.weight,
        reps: s.reps,
        rir: s.rir,
        isWarmup: s.isWarmup,
      })),
    };
    addSession(session);
    dispatch({ type: "RESET" });
  }, [active, addSession]);

  const cancelWorkout = useCallback(() => {
    dispatch({ type: "RESET" });
    setRestRemaining(0);
  }, []);

  const startRest = useCallback((seconds: number) => setRestRemaining(seconds), []);
  const stopRest = useCallback(() => setRestRemaining(0), []);

  return (
    <WorkoutContext.Provider
      value={{
        active,
        startWorkout,
        addSet,
        updateSet,
        removeSet,
        toggleComplete,
        finishWorkout,
        cancelWorkout,
        restRemaining,
        startRest,
        stopRest,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
