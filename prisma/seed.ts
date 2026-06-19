import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ID = "user_3Ecxu9PMjLd4jpPxfHHcUNm8hRp";

// Utilitare
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(18, 30, 0, 0);
  return d;
};

async function main() {
  console.log("🌱 Seeding database...");

  // Sterge date existente pentru acest user
  await prisma.workoutSession.deleteMany({ where: { userId: USER_ID } });
  await prisma.splitTemplate.deleteMany({ where: { userId: USER_ID } });

  // ─── SPLIT-URI ────────────────────────────────────────────────────

  const push = await prisma.splitTemplate.create({
    data: {
      userId: USER_ID,
      name: "Push",
      description: "Piept · Umeri · Triceps",
      exercises: [
        { exerciseId: "ex-bench-press", targetSets: 4, targetRepRange: "6-8", order: 0 },
        { exerciseId: "ex-incline-db",  targetSets: 3, targetRepRange: "8-12", order: 1 },
        { exerciseId: "ex-cable-fly",   targetSets: 3, targetRepRange: "12-15", order: 2 },
        { exerciseId: "ex-ohp",         targetSets: 3, targetRepRange: "8-10", order: 3 },
        { exerciseId: "ex-lateral-raise", targetSets: 4, targetRepRange: "12-15", order: 4 },
        { exerciseId: "ex-tricep-pushdown", targetSets: 3, targetRepRange: "12-15", order: 5 },
        { exerciseId: "ex-skullcrusher",  targetSets: 3, targetRepRange: "10-12", order: 6 },
      ],
    },
  });

  const pull = await prisma.splitTemplate.create({
    data: {
      userId: USER_ID,
      name: "Pull",
      description: "Spate · Biceps",
      exercises: [
        { exerciseId: "ex-deadlift",     targetSets: 4, targetRepRange: "4-6", order: 0 },
        { exerciseId: "ex-pullup",       targetSets: 4, targetRepRange: "6-10", order: 1 },
        { exerciseId: "ex-barbell-row",  targetSets: 4, targetRepRange: "6-8", order: 2 },
        { exerciseId: "ex-lat-pulldown", targetSets: 3, targetRepRange: "10-12", order: 3 },
        { exerciseId: "ex-seated-row",   targetSets: 3, targetRepRange: "10-12", order: 4 },
        { exerciseId: "ex-barbell-curl", targetSets: 3, targetRepRange: "8-12", order: 5 },
        { exerciseId: "ex-hammer-curl",  targetSets: 3, targetRepRange: "10-12", order: 6 },
      ],
    },
  });

  const legs = await prisma.splitTemplate.create({
    data: {
      userId: USER_ID,
      name: "Legs",
      description: "Cvadricepși · Ischiogambieri · Fesieri",
      exercises: [
        { exerciseId: "ex-squat",           targetSets: 4, targetRepRange: "6-8", order: 0 },
        { exerciseId: "ex-leg-press",       targetSets: 4, targetRepRange: "10-12", order: 1 },
        { exerciseId: "ex-leg-extension",   targetSets: 3, targetRepRange: "12-15", order: 2 },
        { exerciseId: "ex-rdl",             targetSets: 4, targetRepRange: "8-10", order: 3 },
        { exerciseId: "ex-leg-curl",        targetSets: 3, targetRepRange: "10-12", order: 4 },
        { exerciseId: "ex-bulgarian-split", targetSets: 3, targetRepRange: "10-12", order: 5 },
      ],
    },
  });

  console.log("✅ Split-uri create: Push, Pull, Legs");

  // ─── SESIUNI ─────────────────────────────────────────────────────
  // 12 sesiuni pe ultimele 3 luni — pattern PPL x2/saptamana cu progresie vizibila

  const sessions = [
    // ── LUNA 3 (acum 80-60 zile) ──────────────────────────────────

    {
      splitId: push.id, splitName: push.name, date: daysAgo(77), durationSeconds: 4200,
      sets: [
        { exerciseId: "ex-bench-press", setOrder: 0, weight: 70, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 1, weight: 70, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 2, weight: 70, reps: 7, rir: 3, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 3, weight: 70, reps: 6, rir: 3, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 0, weight: 24, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 1, weight: 24, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 2, weight: 24, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-cable-fly",   setOrder: 0, weight: 12, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-cable-fly",   setOrder: 1, weight: 12, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-cable-fly",   setOrder: 2, weight: 12, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 0, weight: 50, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 1, weight: 50, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 2, weight: 50, reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 0, weight: 10, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 1, weight: 10, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 2, weight: 10, reps: 13, rir: 1, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 0, weight: 30, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 1, weight: 30, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 0, weight: 30, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 1, weight: 30, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: pull.id, splitName: pull.name, date: daysAgo(75), durationSeconds: 4500,
      sets: [
        { exerciseId: "ex-deadlift",    setOrder: 0, weight: 100, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 1, weight: 100, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 2, weight: 100, reps: 5, rir: 3, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 0, weight: 0,   reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 1, weight: 0,   reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 2, weight: 0,   reps: 6,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 0, weight: 70,  reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 1, weight: 70,  reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 2, weight: 70,  reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 0, weight: 60, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 1, weight: 60, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 0, weight: 35, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 1, weight: 35, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 0, weight: 14, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 1, weight: 14, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: legs.id, splitName: legs.name, date: daysAgo(72), durationSeconds: 5100,
      sets: [
        { exerciseId: "ex-squat",     setOrder: 0, weight: 90, reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 1, weight: 90, reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 2, weight: 90, reps: 7,  rir: 3, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 3, weight: 90, reps: 6,  rir: 3, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 0, weight: 150, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 1, weight: 150, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 2, weight: 150, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 0, weight: 50, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 1, weight: 50, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 0, weight: 70, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 1, weight: 70, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 2, weight: 70, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 0, weight: 40, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 1, weight: 40, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    // ── LUNA 2 (acum 55-35 zile) ──────────────────────────────────

    {
      splitId: push.id, splitName: push.name, date: daysAgo(56), durationSeconds: 4320,
      sets: [
        { exerciseId: "ex-bench-press", setOrder: 0, weight: 72.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 1, weight: 72.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 2, weight: 72.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 3, weight: 72.5, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 0, weight: 26, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 1, weight: 26, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 2, weight: 26, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-cable-fly",   setOrder: 0, weight: 13, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-cable-fly",   setOrder: 1, weight: 13, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-cable-fly",   setOrder: 2, weight: 13, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 0, weight: 52.5, reps: 9, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 1, weight: 52.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 2, weight: 52.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 0, weight: 11, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 1, weight: 11, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 2, weight: 11, reps: 13, rir: 1, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 0, weight: 32, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 1, weight: 32, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 0, weight: 32, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 1, weight: 32, reps: 10, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: pull.id, splitName: pull.name, date: daysAgo(53), durationSeconds: 4680,
      sets: [
        { exerciseId: "ex-deadlift",    setOrder: 0, weight: 105, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 1, weight: 105, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 2, weight: 105, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 0, weight: 5,   reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 1, weight: 5,   reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 2, weight: 5,   reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 0, weight: 72.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 1, weight: 72.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 2, weight: 72.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 0, weight: 62, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 1, weight: 62, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 0, weight: 37, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 1, weight: 37, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 0, weight: 16, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 1, weight: 16, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: legs.id, splitName: legs.name, date: daysAgo(49), durationSeconds: 5400,
      sets: [
        { exerciseId: "ex-squat",     setOrder: 0, weight: 95, reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 1, weight: 95, reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 2, weight: 95, reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 3, weight: 95, reps: 6,  rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 0, weight: 160, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 1, weight: 160, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 2, weight: 160, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 0, weight: 52, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 1, weight: 52, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 0, weight: 75, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 1, weight: 75, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 2, weight: 75, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 0, weight: 42, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 1, weight: 42, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: push.id, splitName: push.name, date: daysAgo(42), durationSeconds: 4500,
      sets: [
        { exerciseId: "ex-bench-press", setOrder: 0, weight: 75, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 1, weight: 75, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 2, weight: 75, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 3, weight: 75, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 0, weight: 28, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 1, weight: 28, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 2, weight: 28, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-pec-deck",    setOrder: 0, weight: 55, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-pec-deck",    setOrder: 1, weight: 55, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 0, weight: 55, reps: 9, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 1, weight: 55, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 0, weight: 12, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 1, weight: 12, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 2, weight: 12, reps: 13, rir: 1, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 0, weight: 34, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 1, weight: 34, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 0, weight: 34, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 1, weight: 34, reps: 10, rir: 2, isWarmup: false },
      ],
    },

    // ── LUNA 1 (acum 30-7 zile) ──────────────────────────────────

    {
      splitId: pull.id, splitName: pull.name, date: daysAgo(28), durationSeconds: 4800,
      sets: [
        { exerciseId: "ex-deadlift",    setOrder: 0, weight: 110, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 1, weight: 110, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 2, weight: 110, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 0, weight: 10,  reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 1, weight: 10,  reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 2, weight: 10,  reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 0, weight: 75, reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 1, weight: 75, reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 2, weight: 75, reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 0, weight: 65, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 1, weight: 65, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-seated-row",   setOrder: 0, weight: 55, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-seated-row",   setOrder: 1, weight: 55, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 0, weight: 40, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 1, weight: 40, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 0, weight: 18, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 1, weight: 18, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: legs.id, splitName: legs.name, date: daysAgo(21), durationSeconds: 5700,
      sets: [
        { exerciseId: "ex-squat",     setOrder: 0, weight: 100, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 1, weight: 100, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 2, weight: 100, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 3, weight: 100, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 0, weight: 170, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 1, weight: 170, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 2, weight: 170, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 0, weight: 55, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 1, weight: 55, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 0, weight: 80, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 1, weight: 80, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 2, weight: 80, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 0, weight: 45, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 1, weight: 45, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-bulgarian-split", setOrder: 0, weight: 20, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-bulgarian-split", setOrder: 1, weight: 20, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: push.id, splitName: push.name, date: daysAgo(14), durationSeconds: 4620,
      sets: [
        { exerciseId: "ex-bench-press", setOrder: 0, weight: 77.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 1, weight: 77.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 2, weight: 77.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-bench-press", setOrder: 3, weight: 77.5, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 0, weight: 30, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 1, weight: 30, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-incline-db",  setOrder: 2, weight: 30, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-pec-deck",    setOrder: 0, weight: 58, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-pec-deck",    setOrder: 1, weight: 58, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 0, weight: 57.5, reps: 9, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 1, weight: 57.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-ohp",         setOrder: 2, weight: 57.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 0, weight: 13, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 1, weight: 13, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-lateral-raise", setOrder: 2, weight: 13, reps: 13, rir: 1, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 0, weight: 36, reps: 14, rir: 2, isWarmup: false },
        { exerciseId: "ex-tricep-pushdown", setOrder: 1, weight: 36, reps: 13, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 0, weight: 36, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-skullcrusher", setOrder: 1, weight: 36, reps: 10, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: pull.id, splitName: pull.name, date: daysAgo(7), durationSeconds: 4920,
      sets: [
        { exerciseId: "ex-deadlift",    setOrder: 0, weight: 115, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 1, weight: 115, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-deadlift",    setOrder: 2, weight: 115, reps: 5, rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 0, weight: 12,  reps: 8,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 1, weight: 12,  reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-pullup",      setOrder: 2, weight: 12,  reps: 7,  rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 0, weight: 77.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 1, weight: 77.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-row", setOrder: 2, weight: 77.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 0, weight: 67, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-lat-pulldown", setOrder: 1, weight: 67, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-seated-row",   setOrder: 0, weight: 58, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-seated-row",   setOrder: 1, weight: 58, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 0, weight: 42, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-barbell-curl", setOrder: 1, weight: 42, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 0, weight: 20, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-hammer-curl",  setOrder: 1, weight: 20, reps: 11, rir: 2, isWarmup: false },
      ],
    },

    {
      splitId: legs.id, splitName: legs.name, date: daysAgo(3), durationSeconds: 5820,
      sets: [
        { exerciseId: "ex-squat",     setOrder: 0, weight: 102.5, reps: 8, rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 1, weight: 102.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 2, weight: 102.5, reps: 7, rir: 2, isWarmup: false },
        { exerciseId: "ex-squat",     setOrder: 3, weight: 102.5, reps: 6, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 0, weight: 180, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 1, weight: 180, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-press", setOrder: 2, weight: 180, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 0, weight: 57, reps: 15, rir: 1, isWarmup: false },
        { exerciseId: "ex-leg-extension", setOrder: 1, weight: 57, reps: 14, rir: 1, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 0, weight: 82.5, reps: 10, rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 1, weight: 82.5, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-rdl",       setOrder: 2, weight: 82.5, reps: 9,  rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 0, weight: 47, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-leg-curl",  setOrder: 1, weight: 47, reps: 11, rir: 2, isWarmup: false },
        { exerciseId: "ex-bulgarian-split", setOrder: 0, weight: 22, reps: 12, rir: 2, isWarmup: false },
        { exerciseId: "ex-bulgarian-split", setOrder: 1, weight: 22, reps: 11, rir: 2, isWarmup: false },
      ],
    },
  ];

  for (const s of sessions) {
    await prisma.workoutSession.create({
      data: {
        userId: USER_ID,
        splitId: s.splitId,
        splitName: s.splitName,
        date: s.date,
        durationSeconds: s.durationSeconds,
        sets: { create: s.sets },
      },
    });
  }

  console.log(`✅ ${sessions.length} sesiuni de antrenament create`);
  console.log("🎉 Seed complet!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
