import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { TrendingUp, Brain, Zap, AlertTriangle } from "lucide-react";
import { useSessions } from "@/hooks/use-sessions";
import { EXERCISE_LIBRARY, getExerciseById } from "@/data/exercises";
import { predict1RM, linearRegression, sessionVolume } from "@/lib/strength-math";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

export function AnalyticsPage() {
  const { sessions, loaded } = useSessions();

  // Exerciții care au date suficiente (compounds)
  const trackableExercises = useMemo(() => {
    if (!loaded) return [];
    const counts = new Map<string, number>();
    sessions.forEach((sess) =>
      sess.sets
        .filter((s) => !s.isWarmup)
        .forEach((s) => counts.set(s.exerciseId, (counts.get(s.exerciseId) ?? 0) + 1)),
    );
    return EXERCISE_LIBRARY.filter((ex) => ex.isCompound && (counts.get(ex.id) ?? 0) >= 4);
  }, [sessions, loaded]);

  const [selectedEx, setSelectedEx] = useState<string>("");

  const activeEx = selectedEx || trackableExercises[0]?.id || "";

  // Date pentru graficul de volum săptămânal
  const weeklyVolume = useMemo(() => {
    const buckets = new Map<string, number>();
    sessions.forEach((sess) => {
      const d = new Date(sess.date);
      // Cheia săptămânii (luni)
      const weekStart = new Date(d);
      const day = weekStart.getDay() || 7;
      weekStart.setDate(weekStart.getDate() - day + 1);
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString();
      buckets.set(key, (buckets.get(key) ?? 0) + sessionVolume(sess.sets));
    });
    return Array.from(buckets.entries())
      .map(([iso, vol]) => ({
        date: iso,
        label: format(new Date(iso), "d MMM", { locale: ro }),
        volume: Math.round(vol),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sessions]);

  // Date pentru graficul de predicție 1RM
  const oneRmData = useMemo(() => {
    if (!activeEx) return { points: [], regression: null, future: [] };
    const points = sessions
      .flatMap((sess) =>
        sess.sets
          .filter((s) => s.exerciseId === activeEx && !s.isWarmup)
          .map((s) => ({
            t: new Date(sess.date).getTime(),
            date: sess.date,
            rm: predict1RM(s.weight, s.reps, s.rir),
          })),
      )
      .sort((a, b) => a.t - b.t);

    if (points.length < 2) return { points: [], regression: null, future: [] };

    // Regresie cu x = zile relative
    const t0 = points[0].t;
    const dayMs = 24 * 60 * 60 * 1000;
    const regPoints = points.map((p) => ({
      x: (p.t - t0) / dayMs,
      y: p.rm,
    }));
    const reg = linearRegression(regPoints);

    const lastDay = regPoints[regPoints.length - 1].x;
    const merged = points.map((p, i) => ({
      label: format(new Date(p.date), "d MMM", { locale: ro }),
      actual: Math.round(p.rm * 10) / 10,
      trend: Math.round(reg.predict(regPoints[i].x) * 10) / 10,
      forecast: null as number | null,
    }));

    // 4 săpt în viitor
    const future: typeof merged = [];
    for (let week = 1; week <= 4; week++) {
      const x = lastDay + week * 7;
      const date = new Date(t0 + x * dayMs);
      future.push({
        label: format(date, "d MMM", { locale: ro }),
        actual: null as unknown as number,
        trend: Math.round(reg.predict(x) * 10) / 10,
        forecast: Math.round(reg.predict(x) * 10) / 10,
      });
    }

    return {
      points: merged,
      regression: reg,
      future,
      combined: [...merged, ...future],
    };
  }, [sessions, activeEx]);

  // Detector platou: ultimele 3 săptămâni de volum
  const plateauWarning = useMemo(() => {
    if (weeklyVolume.length < 3) return null;
    const last3 = weeklyVolume.slice(-3);
    const trend = (last3[2].volume - last3[0].volume) / last3[0].volume;
    if (trend < -0.05) {
      return "Volum în scădere de peste 5% în ultimele 3 săptămâni. Ia în considerare o săptămână de deload.";
    }
    return null;
  }, [weeklyVolume]);

  if (!loaded) return <div className="text-muted-foreground">Se încarcă...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Analize</h1>
        <p className="mt-1 text-muted-foreground">
          Tendințe, predicții și inteligență din datele tale.
        </p>
      </div>

      {plateauWarning && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <div className="font-semibold">Platou detectat</div>
            <div className="text-sm text-muted-foreground">{plateauWarning}</div>
          </div>
        </div>
      )}

      {/* Volum săptămânal */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Volum săptămânal</h2>
        </div>
        {weeklyVolume.length === 0 ? (
          <Empty msg="Nu există date încă." />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVolume}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.86 0.22 130)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.86 0.22 130)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.27 0.014 250)" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="oklch(0.65 0.015 250)" fontSize={12} />
                <YAxis
                  stroke="oklch(0.65 0.015 250)"
                  fontSize={12}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}t`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.21 0.014 250)",
                    border: "1px solid oklch(0.27 0.014 250)",
                    borderRadius: 12,
                  }}
                  formatter={(v: number) => [`${v.toLocaleString("ro-RO")} kg`, "Volum"]}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="oklch(0.86 0.22 130)"
                  strokeWidth={2.5}
                  fill="url(#volGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Predicție 1RM */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Predicție 1RM</h2>
          </div>
          {trackableExercises.length > 0 && (
            <select
              value={activeEx}
              onChange={(e) => setSelectedEx(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            >
              {trackableExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {trackableExercises.length === 0 ? (
          <Empty msg="Loghează cel puțin 4 serii dintr-un exercițiu compus pentru a vedea predicții." />
        ) : oneRmData.points.length < 2 ? (
          <Empty msg="Mai loghează câteva serii pentru a calcula tendința." />
        ) : (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <MiniMetric
                label="1RM curent"
                value={`${oneRmData.points[oneRmData.points.length - 1].actual} kg`}
                hint={getExerciseById(activeEx)?.name}
              />
              <MiniMetric
                label="Tendință"
                value={`${oneRmData.regression!.slope >= 0 ? "+" : ""}${(
                  oneRmData.regression!.slope * 7
                ).toFixed(2)} kg/săpt`}
                hint={oneRmData.regression!.slope >= 0 ? "Progres" : "Scădere"}
                positive={oneRmData.regression!.slope >= 0}
              />
              <MiniMetric
                label="Predicție 4 săpt"
                value={`${oneRmData.future[oneRmData.future.length - 1].forecast} kg`}
                hint="proiecție regresie liniară"
              />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oneRmData.combined}>
                  <CartesianGrid stroke="oklch(0.27 0.014 250)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="oklch(0.65 0.015 250)" fontSize={11} />
                  <YAxis
                    stroke="oklch(0.65 0.015 250)"
                    fontSize={12}
                    domain={["auto", "auto"]}
                    tickFormatter={(v) => `${v}kg`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.21 0.014 250)",
                      border: "1px solid oklch(0.27 0.014 250)",
                      borderRadius: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} iconType="line" />
                  <ReferenceLine
                    x={oneRmData.points[oneRmData.points.length - 1].label}
                    stroke="oklch(0.65 0.015 250)"
                    strokeDasharray="3 3"
                    label={{
                      value: "Azi",
                      fill: "oklch(0.65 0.015 250)",
                      fontSize: 11,
                      position: "top",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="1RM real"
                    stroke="oklch(0.86 0.22 130)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "oklch(0.86 0.22 130)" }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    name="Tendință (regresie)"
                    stroke="oklch(0.7 0.18 35)"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="Predicție"
                    stroke="oklch(0.7 0.16 220)"
                    strokeWidth={2}
                    strokeDasharray="2 4"
                    dot={{ r: 3, fill: "oklch(0.7 0.16 220)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
              <Zap className="mr-1 inline h-3 w-3 text-primary" />
              1RM = media între formulele <strong>Brzycki</strong> și <strong>Epley</strong>,
              aplicate pe (reps + RIR). R² ={" "}
              <span className="font-mono">{(oneRmData.regression!.r2 * 100).toFixed(0)}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  hint,
  positive,
}: {
  label: string;
  value: string;
  hint?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-mono text-xl font-bold ${
          positive === true ? "text-success" : positive === false ? "text-destructive" : ""
        }`}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}
