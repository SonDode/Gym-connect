// Generator de date mock realiste pentru istoricul de antrenament.
// Simulează 6 săptămâni de antrenamente cu progres natural, oboseală și variație.

import { EXERCISE_LIBRARY } from "./exercises";

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
  date: string; // ISO
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

// 3 split-uri demo
export const DEFAULT_SPLITS: SplitTemplate[] = [
  {
    id: "split-push",
    name: "Push (Piept · Umeri · Triceps)",
    description: "Mișcări de împingere, focus pe forță superioară.",
    exercises: [
      { exerciseId: "ex-bench-press", targetSets: 4, targetRepRange: "5-8", order: 0 },
      { exerciseId: "ex-incline-db", targetSets: 3, targetRepRange: "8-12", order: 1 },
      { exerciseId: "ex-ohp", targetSets: 3, targetRepRange: "6-10", order: 2 },
      { exerciseId: "ex-lateral-raise", targetSets: 3, targetRepRange: "12-15", order: 3 },
      { exerciseId: "ex-tricep-pushdown", targetSets: 3, targetRepRange: "10-15", order: 4 },
      { exerciseId: "ex-skullcrusher", targetSets: 3, targetRepRange: "8-12", order: 5 },
    ],
  },
  {
    id: "split-pull",
    name: "Pull (Spate · Biceps)",
    description: "Tracțiuni și ramate pentru spate dens.",
    exercises: [
      { exerciseId: "ex-deadlift", targetSets: 3, targetRepRange: "3-5", order: 0 },
      { exerciseId: "ex-pullup", targetSets: 4, targetRepRange: "6-10", order: 1 },
      { exerciseId: "ex-barbell-row", targetSets: 4, targetRepRange: "6-10", order: 2 },
      { exerciseId: "ex-seated-row", targetSets: 3, targetRepRange: "10-12", order: 3 },
      { exerciseId: "ex-barbell-curl", targetSets: 3, targetRepRange: "8-12", order: 4 },
      { exerciseId: "ex-hammer-curl", targetSets: 3, targetRepRange: "10-15", order: 5 },
    ],
  },
  {
    id: "split-legs",
    name: "Legs (Picioare complete)",
    description: "Cvadricepși, ischiogambieri, fesieri și gambe.",
    exercises: [
      { exerciseId: "ex-squat", targetSets: 4, targetRepRange: "5-8", order: 0 },
      { exerciseId: "ex-rdl", targetSets: 3, targetRepRange: "6-10", order: 1 },
      { exerciseId: "ex-leg-press", targetSets: 3, targetRepRange: "10-12", order: 2 },
      { exerciseId: "ex-leg-curl", targetSets: 3, targetRepRange: "10-15", order: 3 },
      { exerciseId: "ex-standing-calf", targetSets: 4, targetRepRange: "12-15", order: 4 },
    ],
  },
];

// Greutăți de bază (kg) pentru exerciții cheie — startul perioadei mock
const BASE_WEIGHTS: Record<string, { weight: number; reps: number }> = {
  "ex-bench-press": { weight: 90, reps: 6 },
  "ex-incline-db": { weight: 28, reps: 10 },
  "ex-ohp": { weight: 55, reps: 8 },
  "ex-lateral-raise": { weight: 10, reps: 14 },
  "ex-tricep-pushdown": { weight: 35, reps: 12 },
  "ex-skullcrusher": { weight: 35, reps: 10 },
  "ex-deadlift": { weight: 140, reps: 4 },
  "ex-pullup": { weight: 0, reps: 8 }, // bodyweight
  "ex-barbell-row": { weight: 80, reps: 8 },
  "ex-seated-row": { weight: 60, reps: 10 },
  "ex-barbell-curl": { weight: 35, reps: 10 },
  "ex-hammer-curl": { weight: 14, reps: 12 },
  "ex-squat": { weight: 110, reps: 6 },
  "ex-rdl": { weight: 100, reps: 8 },
  "ex-leg-press": { weight: 200, reps: 12 },
  "ex-leg-curl": { weight: 50, reps: 12 },
  "ex-standing-calf": { weight: 80, reps: 14 },
};

/**
 * Generator pseudo-random determinist pe baza unui seed numeric.
 * Este folosit ca rezultatele mock să fie reproductibile între rulări.
 */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Construiește o sesiune mock completă pentru un split și un moment în timp.
 * Include progres săptămânal, oboseală intra-set și seturi de încălzire pentru exerciții grele.
 */
function generateSession(
  split: SplitTemplate,
  weekIndex: number,
  daysAgo: number,
  seed: number,
): WorkoutSession {
  const rand = rng(seed);
  const sets: WorkoutSet[] = [];
  let setCounter = 0;

  for (const sx of split.exercises) {
    const base = BASE_WEIGHTS[sx.exerciseId] ?? { weight: 20, reps: 10 };
    // Progres ~1.5% / săpt. cu mic noise și un mini-deload în săpt 4
    const progressFactor =
      1 + weekIndex * 0.015 + (rand() - 0.5) * 0.02 - (weekIndex === 3 ? 0.03 : 0);
    const baseWeight = base.weight * progressFactor;

    // Round la 2.5 kg
    const workWeight = Math.max(base.weight * 0.5, Math.round((baseWeight * 2) / 5) * 2.5);

    // 1-2 încălziri pentru exerciții compuse cu greutate > 40
    const isHeavy = workWeight >= 40;
    if (isHeavy) {
      sets.push({
        id: `set-${seed}-${setCounter++}`,
        exerciseId: sx.exerciseId,
        setOrder: 0,
        weight: Math.round((workWeight * 0.5) / 2.5) * 2.5,
        reps: 8,
        rir: 5,
        isWarmup: true,
      });
    }

    for (let i = 0; i < sx.targetSets; i++) {
      // Reps scad ușor pe parcursul setului din cauza oboselii
      const fatigue = i * 0.5;
      const reps = Math.max(2, Math.round(base.reps - fatigue + (rand() - 0.5) * 2));
      // RIR scade pe parcurs (mai aproape de eșec la final)
      const rir = Math.max(0, Math.min(4, Math.round(3 - i * 0.7 + (rand() - 0.5))));
      sets.push({
        id: `set-${seed}-${setCounter++}`,
        exerciseId: sx.exerciseId,
        setOrder: i + (isHeavy ? 1 : 0),
        weight: workWeight,
        reps,
        rir,
        isWarmup: false,
      });
    }
  }

  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(18, 30, 0, 0);

  return {
    id: `session-${seed}`,
    splitId: split.id,
    splitName: split.name,
    date: date.toISOString(),
    durationSeconds: 3300 + Math.round(rand() * 900), // 55-70 min
    sets,
  };
}

/**
 * Generează întreg istoricul demo (6 săptămâni x 3 sesiuni/săptămână).
 * Rezultatul final este sortat cu cele mai recente sesiuni primele.
 */
export function generateMockHistory(): WorkoutSession[] {
  // 6 săptămâni × 3 antrenamente / săpt. = 18 sesiuni
  const sessions: WorkoutSession[] = [];
  let seed = 42;
  for (let week = 0; week < 6; week++) {
    // Push (luni), Pull (miercuri), Legs (vineri)
    const weekStartDaysAgo = (5 - week) * 7;
    const order = [
      { split: DEFAULT_SPLITS[0], offset: 6 }, // Push
      { split: DEFAULT_SPLITS[1], offset: 4 }, // Pull
      { split: DEFAULT_SPLITS[2], offset: 2 }, // Legs
    ];
    for (const { split, offset } of order) {
      sessions.push(generateSession(split, week, weekStartDaysAgo + offset, seed++));
    }
  }
  // Cele mai noi întâi
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Verifică că toate ID-urile referite există în librărie
const referenced = new Set<string>();
DEFAULT_SPLITS.forEach((s) => s.exercises.forEach((e) => referenced.add(e.exerciseId)));
referenced.forEach((id) => {
  if (!EXERCISE_LIBRARY.find((e) => e.id === id)) {
    console.warn(`[mock] Exercise referenced but missing: ${id}`);
  }
});
