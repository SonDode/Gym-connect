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
  | "adductors"
  | "calves"
  | "core"
  | "forearms";

export type EquipmentType = "barbell" | "dumbbell" | "cable" | "machine" | "bodyweight";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipmentType: EquipmentType;
  isCompound: boolean;
  isUnilateral: boolean;
};

// Dicționar pentru afișarea denumirilor locale ale grupelor musculare.
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Piept",
  back: "Spate",
  shoulders: "Umeri",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Cvadricepși",
  hamstrings: "Ischiogambieri",
  glutes: "Fesieri",
  adductors: "Aductori",
  calves: "Gambe",
  core: "Abdomen",
  forearms: "Antebrațe",
};

// Dicționar pentru afișarea denumirilor locale ale echipamentelor.
export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: "Bară",
  dumbbell: "Gantere",
  cable: "Cabluri",
  machine: "Aparat",
  bodyweight: "Greutate corp",
};

// Catalogul central de exerciții din care se alimentează formularele și analytics.
export const EXERCISE_LIBRARY: Exercise[] = [
  // PIEPT
  {
    id: "ex-bench-press",
    name: "Împins la piept cu bara",
    muscleGroup: "chest",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-incline-bench",
    name: "Împins înclinat cu bara",
    muscleGroup: "chest",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-db-bench",
    name: "Împins cu gantere",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-incline-db",
    name: "Împins înclinat cu gantere",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-cable-fly",
    name: "Cross-over la cabluri",
    muscleGroup: "chest",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-pec-deck",
    name: "Pec deck",
    muscleGroup: "chest",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // SPATE
  {
    id: "ex-deadlift",
    name: "Îndreptări (Deadlift)",
    muscleGroup: "back",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-pullup",
    name: "Tracțiuni",
    muscleGroup: "back",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-barbell-row",
    name: "Ramat cu bara",
    muscleGroup: "back",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-lat-pulldown",
    name: "Tracțiuni la helcometru",
    muscleGroup: "back",
    equipmentType: "cable",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-seated-row",
    name: "Ramat la cablu (șezut)",
    muscleGroup: "back",
    equipmentType: "cable",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-db-row",
    name: "Ramat cu gantera",
    muscleGroup: "back",
    equipmentType: "dumbbell",
    isCompound: true,
    isUnilateral: true,
  },

  // UMERI
  {
    id: "ex-ohp",
    name: "Împins militar",
    muscleGroup: "shoulders",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-db-shoulder-press",
    name: "Împins gantere deasupra capului",
    muscleGroup: "shoulders",
    equipmentType: "dumbbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-lateral-raise",
    name: "Ridicări laterale",
    muscleGroup: "shoulders",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-rear-delt-fly",
    name: "Fluturări spate (umeri posteriori)",
    muscleGroup: "shoulders",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },

  // BICEPS
  {
    id: "ex-barbell-curl",
    name: "Flexii cu bara",
    muscleGroup: "biceps",
    equipmentType: "barbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-db-curl",
    name: "Flexii cu gantere",
    muscleGroup: "biceps",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-hammer-curl",
    name: "Flexii hammer",
    muscleGroup: "biceps",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-cable-curl",
    name: "Flexii la cablu",
    muscleGroup: "biceps",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },

  // TRICEPS
  {
    id: "ex-tricep-pushdown",
    name: "Extensii triceps la cablu",
    muscleGroup: "triceps",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-skullcrusher",
    name: "Skull crushers",
    muscleGroup: "triceps",
    equipmentType: "barbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-dips",
    name: "Dips la paralele",
    muscleGroup: "triceps",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-overhead-tricep",
    name: "Extensii triceps deasupra capului",
    muscleGroup: "triceps",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },

  // CVADRICEPȘI
  {
    id: "ex-squat",
    name: "Genuflexiuni cu bara",
    muscleGroup: "quads",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-front-squat",
    name: "Genuflexiuni frontale",
    muscleGroup: "quads",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-leg-press",
    name: "Presă picioare",
    muscleGroup: "quads",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-leg-extension",
    name: "Extensii cvadricepși",
    muscleGroup: "quads",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-bulgarian-split",
    name: "Bulgarian split squat",
    muscleGroup: "quads",
    equipmentType: "dumbbell",
    isCompound: true,
    isUnilateral: true,
  },

  // ISCHIOGAMBIERI
  {
    id: "ex-rdl",
    name: "Îndreptări românești (RDL)",
    muscleGroup: "hamstrings",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-leg-curl",
    name: "Flexii ischiogambieri",
    muscleGroup: "hamstrings",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-good-morning",
    name: "Good morning",
    muscleGroup: "hamstrings",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },

  // FESIERI
  {
    id: "ex-hip-thrust",
    name: "Hip thrust",
    muscleGroup: "glutes",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-glute-bridge",
    name: "Glute bridge",
    muscleGroup: "glutes",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },

  // GAMBE
  {
    id: "ex-standing-calf",
    name: "Ridicări pe vârfuri (în picioare)",
    muscleGroup: "calves",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-seated-calf",
    name: "Ridicări pe vârfuri (șezut)",
    muscleGroup: "calves",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // CORE
  {
    id: "ex-plank",
    name: "Plank",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-cable-crunch",
    name: "Crunch la cablu",
    muscleGroup: "core",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-hanging-leg-raise",
    name: "Ridicări picioare la bară",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },

  // ───────── VARIANTE LA APARATE ─────────

  // Piept
  {
    id: "ex-chest-press-machine",
    name: "Împins la piept la aparat",
    muscleGroup: "chest",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-incline-press-machine",
    name: "Împins înclinat la aparat",
    muscleGroup: "chest",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },

  // Spate
  {
    id: "ex-machine-row",
    name: "Ramat la aparat",
    muscleGroup: "back",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-assisted-pullup",
    name: "Tracțiuni asistate la aparat",
    muscleGroup: "back",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-machine-pullover",
    name: "Pullover la aparat",
    muscleGroup: "back",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // Umeri
  {
    id: "ex-machine-shoulder-press",
    name: "Împins umeri la aparat",
    muscleGroup: "shoulders",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-machine-lateral-raise",
    name: "Ridicări laterale la aparat",
    muscleGroup: "shoulders",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-reverse-pec-deck",
    name: "Fluturări spate la aparat (reverse pec deck)",
    muscleGroup: "shoulders",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // Biceps
  {
    id: "ex-machine-curl",
    name: "Flexii biceps la aparat",
    muscleGroup: "biceps",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // Triceps
  {
    id: "ex-machine-tricep-extension",
    name: "Extensii triceps la aparat",
    muscleGroup: "triceps",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-assisted-dips",
    name: "Dips asistate la aparat",
    muscleGroup: "triceps",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },

  // Cvadricepși
  {
    id: "ex-hack-squat",
    name: "Hack squat la aparat",
    muscleGroup: "quads",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-pendulum-squat",
    name: "Pendulum squat",
    muscleGroup: "quads",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-smith-squat",
    name: "Genuflexiuni la Smith",
    muscleGroup: "quads",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },

  // Ischiogambieri
  {
    id: "ex-seated-leg-curl",
    name: "Flexii ischiogambieri (șezut) la aparat",
    muscleGroup: "hamstrings",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // Fesieri
  {
    id: "ex-machine-hip-thrust",
    name: "Hip thrust la aparat",
    muscleGroup: "glutes",
    equipmentType: "machine",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-hip-abduction",
    name: "Abductor la aparat (fesier mijlociu)",
    muscleGroup: "glutes",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // Abdomen
  {
    id: "ex-ab-crunch-machine",
    name: "Crunch la aparat",
    muscleGroup: "core",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },

  // ───────── ADUCTORI ─────────
  {
    id: "ex-hip-adduction-machine",
    name: "Adductor la aparat",
    muscleGroup: "adductors",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-cable-hip-adduction",
    name: "Adducție șold la cablu",
    muscleGroup: "adductors",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-copenhagen-plank",
    name: "Copenhagen plank",
    muscleGroup: "adductors",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: true,
  },

  // ───────── EXERCIȚII SUPLIMENTARE ─────────
  {
    id: "ex-pushup",
    name: "Flotări",
    muscleGroup: "chest",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-inverted-row",
    name: "Ramat cu corpul înclinat",
    muscleGroup: "back",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-face-pull",
    name: "Face pull",
    muscleGroup: "shoulders",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-preacher-curl",
    name: "Flexii la banca Scott",
    muscleGroup: "biceps",
    equipmentType: "machine",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-close-grip-bench",
    name: "Împins la piept cu prindere strânsă",
    muscleGroup: "triceps",
    equipmentType: "barbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-step-up",
    name: "Step-up",
    muscleGroup: "quads",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: true,
  },
  {
    id: "ex-calf-raise-single-leg",
    name: "Ridicări pe vârfuri pe un picior",
    muscleGroup: "calves",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-mountain-climber",
    name: "Mountain climbers",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: false,
  },

  // ───────── EXERCIȚII SUPLIMENTARE DIN LISTA TA ─────────
  {
    id: "ex-decline-dumbbell-press",
    name: "Decline dumbbell press",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-incline-cable-crossovers",
    name: "Incline cable crossovers",
    muscleGroup: "chest",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-incline-dumbbell-flyes",
    name: "Incline dumbbell flyes",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-decline-cable-crossovers",
    name: "Decline cable crossovers",
    muscleGroup: "chest",
    equipmentType: "cable",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-decline-dumbbell-flyes",
    name: "Decline dumbbell flyes",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-chest-flyes",
    name: "Chest flyes",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-dumbbell-flyes",
    name: "Dumbbell flyes",
    muscleGroup: "chest",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-hyperextensions",
    name: "Hyperextensions",
    muscleGroup: "back",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-bird-dog",
    name: "Bird dog",
    muscleGroup: "back",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-concentration-curls",
    name: "Concentration curls",
    muscleGroup: "biceps",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-donkey-kicks",
    name: "Donkey kicks",
    muscleGroup: "glutes",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: true,
  },
  {
    id: "ex-dumbbell-front-raises",
    name: "Dumbbell front raises",
    muscleGroup: "shoulders",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-bent-over-lateral-raises",
    name: "Bent-over lateral raises",
    muscleGroup: "shoulders",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-crunches",
    name: "Crunches",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-leg-raises",
    name: "Leg raises",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-bicycle-crunches",
    name: "Bicycle crunches",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-russian-twists",
    name: "Russian twists",
    muscleGroup: "core",
    equipmentType: "bodyweight",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-wrist-curl",
    name: "Wrist curl",
    muscleGroup: "forearms",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-wrist-extension",
    name: "Wrist extension",
    muscleGroup: "forearms",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-plate-pinch",
    name: "Plate pinch",
    muscleGroup: "forearms",
    equipmentType: "barbell",
    isCompound: false,
    isUnilateral: false,
  },
  {
    id: "ex-towel-pull-up",
    name: "Towel pull-up",
    muscleGroup: "forearms",
    equipmentType: "bodyweight",
    isCompound: true,
    isUnilateral: false,
  },
  {
    id: "ex-fat-grip-dumbbell-curl",
    name: "Fat grip dumbbell curl",
    muscleGroup: "forearms",
    equipmentType: "dumbbell",
    isCompound: false,
    isUnilateral: true,
  },
];

/**
 * Caută un exercițiu după ID și returnează metadatele complete ale acestuia.
 */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.find((e) => e.id === id);
}
