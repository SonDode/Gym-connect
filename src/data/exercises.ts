// Mock catalog de exerciții — sursa de adevăr a aplicației.
// Structurat exact ca tabelul `exercise_library` din schema Supabase viitoare.

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core";

export type EquipmentType =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  isCompound: boolean;
  isUnilateral: boolean;
};

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Piept",
  back: "Spate",
  shoulders: "Umeri",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Cvadricepși",
  hamstrings: "Ischiogambieri",
  glutes: "Fesieri",
  calves: "Gambe",
  core: "Abdomen",
};

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: "Bară",
  dumbbell: "Gantere",
  cable: "Cabluri",
  machine: "Aparat",
  bodyweight: "Greutate corp",
};

export const EXERCISE_LIBRARY: Exercise[] = [
  // PIEPT
  { id: "ex-bench-press", name: "Împins la piept cu bara", muscleGroup: "chest", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-incline-bench", name: "Împins înclinat cu bara", muscleGroup: "chest", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-db-bench", name: "Împins cu gantere", muscleGroup: "chest", equipmentType: "dumbbell", isCompound: true, isUnilateral: false },
  { id: "ex-incline-db", name: "Împins înclinat cu gantere", muscleGroup: "chest", equipmentType: "dumbbell", isCompound: true, isUnilateral: false },
  { id: "ex-cable-fly", name: "Cross-over la cabluri", muscleGroup: "chest", equipmentType: "cable", isCompound: false, isUnilateral: false },
  { id: "ex-pec-deck", name: "Pec deck", muscleGroup: "chest", equipmentType: "machine", isCompound: false, isUnilateral: false },

  // SPATE
  { id: "ex-deadlift", name: "Îndreptări (Deadlift)", muscleGroup: "back", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-pullup", name: "Tracțiuni", muscleGroup: "back", equipmentType: "bodyweight", isCompound: true, isUnilateral: false },
  { id: "ex-barbell-row", name: "Ramat cu bara", muscleGroup: "back", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-lat-pulldown", name: "Tracțiuni la helcometru", muscleGroup: "back", equipmentType: "cable", isCompound: true, isUnilateral: false },
  { id: "ex-seated-row", name: "Ramat la cablu (șezut)", muscleGroup: "back", equipmentType: "cable", isCompound: true, isUnilateral: false },
  { id: "ex-db-row", name: "Ramat cu gantera", muscleGroup: "back", equipmentType: "dumbbell", isCompound: true, isUnilateral: true },

  // UMERI
  { id: "ex-ohp", name: "Împins militar", muscleGroup: "shoulders", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-db-shoulder-press", name: "Împins gantere deasupra capului", muscleGroup: "shoulders", equipmentType: "dumbbell", isCompound: true, isUnilateral: false },
  { id: "ex-lateral-raise", name: "Ridicări laterale", muscleGroup: "shoulders", equipmentType: "dumbbell", isCompound: false, isUnilateral: false },
  { id: "ex-rear-delt-fly", name: "Fluturări spate (umeri posteriori)", muscleGroup: "shoulders", equipmentType: "dumbbell", isCompound: false, isUnilateral: false },

  // BICEPS
  { id: "ex-barbell-curl", name: "Flexii cu bara", muscleGroup: "biceps", equipmentType: "barbell", isCompound: false, isUnilateral: false },
  { id: "ex-db-curl", name: "Flexii cu gantere", muscleGroup: "biceps", equipmentType: "dumbbell", isCompound: false, isUnilateral: true },
  { id: "ex-hammer-curl", name: "Flexii hammer", muscleGroup: "biceps", equipmentType: "dumbbell", isCompound: false, isUnilateral: true },
  { id: "ex-cable-curl", name: "Flexii la cablu", muscleGroup: "biceps", equipmentType: "cable", isCompound: false, isUnilateral: false },

  // TRICEPS
  { id: "ex-tricep-pushdown", name: "Extensii triceps la cablu", muscleGroup: "triceps", equipmentType: "cable", isCompound: false, isUnilateral: false },
  { id: "ex-skullcrusher", name: "Skull crushers", muscleGroup: "triceps", equipmentType: "barbell", isCompound: false, isUnilateral: false },
  { id: "ex-dips", name: "Dips la paralele", muscleGroup: "triceps", equipmentType: "bodyweight", isCompound: true, isUnilateral: false },
  { id: "ex-overhead-tricep", name: "Extensii triceps deasupra capului", muscleGroup: "triceps", equipmentType: "dumbbell", isCompound: false, isUnilateral: false },

  // CVADRICEPȘI
  { id: "ex-squat", name: "Genuflexiuni cu bara", muscleGroup: "quads", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-front-squat", name: "Genuflexiuni frontale", muscleGroup: "quads", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-leg-press", name: "Presă picioare", muscleGroup: "quads", equipmentType: "machine", isCompound: true, isUnilateral: false },
  { id: "ex-leg-extension", name: "Extensii cvadricepși", muscleGroup: "quads", equipmentType: "machine", isCompound: false, isUnilateral: false },
  { id: "ex-bulgarian-split", name: "Bulgarian split squat", muscleGroup: "quads", equipmentType: "dumbbell", isCompound: true, isUnilateral: true },

  // ISCHIOGAMBIERI
  { id: "ex-rdl", name: "Îndreptări românești (RDL)", muscleGroup: "hamstrings", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-leg-curl", name: "Flexii ischiogambieri", muscleGroup: "hamstrings", equipmentType: "machine", isCompound: false, isUnilateral: false },
  { id: "ex-good-morning", name: "Good morning", muscleGroup: "hamstrings", equipmentType: "barbell", isCompound: true, isUnilateral: false },

  // FESIERI
  { id: "ex-hip-thrust", name: "Hip thrust", muscleGroup: "glutes", equipmentType: "barbell", isCompound: true, isUnilateral: false },
  { id: "ex-glute-bridge", name: "Glute bridge", muscleGroup: "glutes", equipmentType: "barbell", isCompound: true, isUnilateral: false },

  // GAMBE
  { id: "ex-standing-calf", name: "Ridicări pe vârfuri (în picioare)", muscleGroup: "calves", equipmentType: "machine", isCompound: false, isUnilateral: false },
  { id: "ex-seated-calf", name: "Ridicări pe vârfuri (șezut)", muscleGroup: "calves", equipmentType: "machine", isCompound: false, isUnilateral: false },

  // CORE
  { id: "ex-plank", name: "Plank", muscleGroup: "core", equipmentType: "bodyweight", isCompound: false, isUnilateral: false },
  { id: "ex-cable-crunch", name: "Crunch la cablu", muscleGroup: "core", equipmentType: "cable", isCompound: false, isUnilateral: false },
  { id: "ex-hanging-leg-raise", name: "Ridicări picioare la bară", muscleGroup: "core", equipmentType: "bodyweight", isCompound: false, isUnilateral: false },
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.find((e) => e.id === id);
}
