// "Mock API" — server functions TanStack care înlocuiesc Express.
// Returnează aceleași structuri ca viitorul Supabase.
// La migrare, aceste handler-uri vor fi înlocuite cu apeluri supabase.from(...).

import { createServerFn } from "@tanstack/react-start";
import { EXERCISE_LIBRARY } from "@/data/exercises";
import {
  DEFAULT_SPLITS,
  generateMockHistory,
  type WorkoutSession,
} from "@/data/mock-history";

export const fetchExerciseLibrary = createServerFn({ method: "GET" }).handler(
  async () => {
    return { exercises: EXERCISE_LIBRARY };
  }
);

export const fetchSplits = createServerFn({ method: "GET" }).handler(async () => {
  return { splits: DEFAULT_SPLITS };
});

export const fetchWorkoutHistory = createServerFn({ method: "GET" }).handler(
  async () => {
    const sessions: WorkoutSession[] = generateMockHistory();
    return { sessions };
  }
);
