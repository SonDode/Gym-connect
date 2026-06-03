import type { Prisma } from "@prisma/client";

type SplitExerciseJson = {
  exerciseId: string;
  targetSets: number;
  targetRepRange: string;
  order: number;
};

export function mapSplit(split: {
  id: string;
  name: string;
  description: string;
  exercises: Prisma.JsonValue;
}) {
  return {
    id: split.id,
    name: split.name,
    description: split.description,
    exercises: split.exercises as SplitExerciseJson[],
  };
}

export function mapSession(session: {
  id: string;
  splitId: string | null;
  splitName: string;
  date: Date;
  durationSeconds: number;
  notes: string | null;
  sets: Array<{
    id: string;
    exerciseId: string;
    setOrder: number;
    weight: number;
    reps: number;
    rir: number;
    isWarmup: boolean;
  }>;
}) {
  return {
    id: session.id,
    splitId: session.splitId ?? "",
    splitName: session.splitName,
    date: session.date.toISOString(),
    durationSeconds: session.durationSeconds,
    notes: session.notes ?? undefined,
    sets: session.sets.map((s) => ({
      id: s.id,
      exerciseId: s.exerciseId,
      setOrder: s.setOrder,
      weight: s.weight,
      reps: s.reps,
      rir: s.rir,
      isWarmup: s.isWarmup,
    })),
  };
}
