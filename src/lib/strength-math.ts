// Algoritmi de știință a sportului: predicție 1RM, regresie liniară.
// Toate funcțiile sunt pure și testabile.

/**
 * Brzycki — precis pentru 1-10 reps. Subestimează la reps mari.
 * 1RM = W / (1.0278 - 0.0278 * R)
 */
export function brzycki(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  const denom = 1.0278 - 0.0278 * reps;
  if (denom <= 0) return weight;
  return weight / denom;
}

/**
 * Epley — robust pentru reps moderate-mari, standard în industrie.
 * 1RM = W * (1 + R/30)
 */
export function epley(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * Lombardi — exerciții compuse grele.
 * 1RM = W * R^0.10
 */
export function lombardi(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * Math.pow(reps, 0.1);
}

/**
 * O'Conner — formulă liniară simplificată, fallback.
 * 1RM = W * (1 + 0.025 * R)
 */
export function oconner(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  return weight * (1 + 0.025 * reps);
}

/**
 * Calculează "repetările efective" = reps completate + RIR.
 * Esența monitorizării prin RIR: o serie cu 8 reps @ RIR 2 = 10 reps echivalente.
 */
export function effectiveReps(reps: number, rir: number): number {
  return Math.max(1, reps + Math.max(0, rir));
}

/**
 * Predicție 1RM ca medie între Brzycki și Epley (recomandat).
 * Trimitem (weight, reps_completate, RIR).
 */
export function predict1RM(weight: number, reps: number, rir: number): number {
  const effR = effectiveReps(reps, rir);
  const a = brzycki(weight, effR);
  const b = epley(weight, effR);
  return Math.round(((a + b) / 2) * 10) / 10;
}

/**
 * Regresie liniară simplă (least squares) — y = a + b*x.
 * Returnează slope, intercept și o funcție de predicție.
 */
export type RegressionResult = {
  slope: number;
  intercept: number;
  predict: (x: number) => number;
  r2: number;
};

export function linearRegression(points: Array<{ x: number; y: number }>): RegressionResult {
  const n = points.length;
  if (n === 0) {
    return { slope: 0, intercept: 0, predict: () => 0, r2: 0 };
  }
  if (n === 1) {
    const y = points[0].y;
    return { slope: 0, intercept: y, predict: () => y, r2: 1 };
  }

  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denom = sumXX - n * meanX * meanX;
  const slope = denom === 0 ? 0 : (sumXY - n * meanX * meanY) / denom;
  const intercept = meanY - slope * meanX;

  // R^2
  const ssTot = points.reduce((s, p) => s + Math.pow(p.y - meanY, 2), 0);
  const ssRes = points.reduce((s, p) => s + Math.pow(p.y - (intercept + slope * p.x), 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return {
    slope,
    intercept,
    predict: (x: number) => intercept + slope * x,
    r2: Math.max(0, Math.min(1, r2)),
  };
}

/**
 * Calculator discuri de bară olimpică.
 * Returnează lista de discuri necesare per parte (descrescător).
 */
export const STANDARD_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

export type PlateLoadout = {
  perSide: Array<{ weight: number; count: number }>;
  achievable: number;
  remainder: number;
};

export function calculatePlates(
  targetWeight: number,
  barWeight = 20,
  plates: number[] = STANDARD_PLATES,
): PlateLoadout {
  if (targetWeight < barWeight) {
    return { perSide: [], achievable: barWeight, remainder: 0 };
  }
  let perSideWeight = (targetWeight - barWeight) / 2;
  const result: Array<{ weight: number; count: number }> = [];
  for (const p of plates) {
    if (perSideWeight >= p) {
      const count = Math.floor(perSideWeight / p);
      result.push({ weight: p, count });
      perSideWeight -= count * p;
    }
  }
  const remainder = Math.round(perSideWeight * 100) / 100;
  const totalLoaded = barWeight + 2 * result.reduce((s, p) => s + p.weight * p.count, 0);
  return { perSide: result, achievable: totalLoaded, remainder };
}

/**
 * Volum total al unei serii (kg).
 */
export function setVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Volum total al unei sesiuni.
 */
export function sessionVolume(
  sets: Array<{ weight: number; reps: number; isWarmup?: boolean }>,
): number {
  return sets.filter((s) => !s.isWarmup).reduce((sum, s) => sum + setVolume(s.weight, s.reps), 0);
}
