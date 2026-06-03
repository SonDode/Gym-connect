/** Tipuri de domeniu — vor fi aliniate cu schema Prisma la pasul următor. */

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  setOrder: number;
  weight: number;
  reps: number;
  rir: number;
  isWarmup: boolean;
};

export type WorkoutSession = {
  id: string;
  splitId: string;
  splitName: string;
  date: string;
  durationSeconds: number;
  notes?: string;
  sets: WorkoutSet[];
};

export type SplitExercise = {
  exerciseId: string;
  targetSets: number;
  targetRepRange: string;
  order: number;
};

export type SplitTemplate = {
  id: string;
  name: string;
  description: string;
  exercises: SplitExercise[];
};
