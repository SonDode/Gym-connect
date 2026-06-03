import { Link } from "react-router-dom";
import { Calendar, Clock, Dumbbell, TrendingUp, Trophy } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { useSessions } from "@/hooks/use-sessions";
import { getExerciseById } from "@/data/exercises";
import { sessionVolume, predict1RM } from "@/lib/strength-math";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

export function HistoryPage() {
  const { sessions, loaded } = useSessions();

  if (!loaded) {
    return <div className="text-muted-foreground">Se încarcă...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
        <Dumbbell className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 font-display text-xl font-semibold">Niciun antrenament logat</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Începe prima ta sesiune și progresul tău va apărea aici.
        </p>
        <Link to="/dashboard/workout" className="mt-6 inline-block">
          <Button>Începe antrenament</Button>
        </Link>
      </div>
    );
  }

  // Stats top-row: total antrenamente, volum total, sesiune medie
  const totalVolume = sessions.reduce((s, sess) => s + sessionVolume(sess.sets), 0);
  const avgDuration = Math.round(
    sessions.reduce((s, sess) => s + sess.durationSeconds, 0) / sessions.length / 60,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Jurnalul tău</h1>
        <p className="mt-1 text-muted-foreground">{sessions.length} antrenamente înregistrate</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          label="Antrenamente"
          value={sessions.length.toString()}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Volum total"
          value={`${(totalVolume / 1000).toFixed(1)}t`}
          hint="kg ridicați"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Durată medie"
          value={`${avgDuration} min`}
        />
      </div>

      <div className="space-y-3">
        {sessions.map((sess) => (
          <SessionCard key={sess.id} session={sess} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function SessionCard({ session }: { session: ReturnType<typeof useSessions>["sessions"][number] }) {
  const [expanded, setExpanded] = useState(false);
  const volume = useMemo(() => sessionVolume(session.sets), [session]);

  // Grupare pe exerciții
  const byExercise = useMemo(() => {
    const map = new Map<string, typeof session.sets>();
    session.sets.forEach((s) => {
      const arr = map.get(s.exerciseId) ?? [];
      arr.push(s);
      map.set(s.exerciseId, arr);
    });
    return Array.from(map.entries());
  }, [session]);

  // PR-uri estimate (1RM max per exercițiu în această sesiune)
  const prCount = useMemo(() => {
    let count = 0;
    byExercise.forEach(([, sets]) => {
      const maxRm = Math.max(
        ...sets.filter((s) => !s.isWarmup).map((s) => predict1RM(s.weight, s.reps, s.rir)),
      );
      if (maxRm > 0) count++;
    });
    return count;
  }, [byExercise]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(session.date), "EEEE, d MMM", { locale: ro })}
          </div>
          <h3 className="mt-1 truncate font-display text-lg font-semibold">{session.splitName}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-sm">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Volum</div>
            <div className="font-mono font-semibold">{volume.toLocaleString("ro-RO")} kg</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Durată</div>
            <div className="font-mono font-semibold">
              {Math.round(session.durationSeconds / 60)} min
            </div>
          </div>
          {prCount > 0 && (
            <div className="hidden items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary md:flex">
              <Trophy className="h-3 w-3" />
              {prCount}
            </div>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-background/40 p-4">
          <div className="space-y-4">
            {byExercise.map(([exId, sets]) => {
              const ex = getExerciseById(exId);
              return (
                <div key={exId}>
                  <h4 className="mb-2 font-semibold">{ex?.name ?? exId}</h4>
                  <div className="space-y-1">
                    {sets.map((s, i) => (
                      <div
                        key={s.id}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                          s.isWarmup ? "text-muted-foreground" : "bg-secondary/50"
                        }`}
                      >
                        <span className="w-6 font-mono text-xs">{i + 1}</span>
                        <span className="font-mono font-semibold">{s.weight} kg</span>
                        <span className="text-muted-foreground">×</span>
                        <span className="font-mono font-semibold">{s.reps}</span>
                        {s.isWarmup ? (
                          <span className="ml-auto text-xs">Încălzire</span>
                        ) : (
                          <>
                            <span className="ml-auto text-xs text-muted-foreground">
                              RIR {s.rir}
                            </span>
                            <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                              ~{predict1RM(s.weight, s.reps, s.rir).toFixed(1)} kg 1RM
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
