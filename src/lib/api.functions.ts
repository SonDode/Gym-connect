// "Mock API" — server functions TanStack care înlocuiesc Express.
// Returnează aceleași structuri ca viitorul Supabase.
// La migrare, aceste handler-uri vor fi înlocuite cu apeluri supabase.from(...).

import { createServerFn } from "@tanstack/react-start";
import { EXERCISE_LIBRARY } from "@/data/exercises";
import { DEFAULT_SPLITS, generateMockHistory, type WorkoutSession } from "@/data/mock-history";

/**
 * Returnează catalogul complet de exerciții folosit în UI.
 */
export const fetchExerciseLibrary = createServerFn({ method: "GET" }).handler(async () => {
  return { exercises: EXERCISE_LIBRARY };
});

/**
 * Returnează split-urile disponibile pentru pornirea unui antrenament.
 */
export const fetchSplits = createServerFn({ method: "GET" }).handler(async () => {
  return { splits: DEFAULT_SPLITS };
});

/**
 * Returnează istoricul de antrenamente mock (ordonat descrescător după dată).
 */
export const fetchWorkoutHistory = createServerFn({ method: "GET" }).handler(async () => {
  const sessions: WorkoutSession[] = generateMockHistory();
  return { sessions };
});
