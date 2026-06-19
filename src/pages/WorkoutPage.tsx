import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import {
  Check,
  Minus,
  Play,
  Plus,
  Timer,
  Trash2,
  X,
  Calculator,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWorkout } from "@/lib/workout-context";
import { useSplits } from "@/hooks/use-splits";
import { useSessions } from "@/hooks/use-sessions";
import { getExerciseById } from "@/data/exercises";
import { calculatePlates, predict1RM } from "@/lib/strength-math";
import { toast } from "sonner";

export function WorkoutPage() {
  const { active, finishWorkout, cancelWorkout, startWorkout, restRemaining, stopRest } = useWorkout();
  const navigate = useNavigate();
  const { splits } = useSplits();
  const { sessions } = useSessions();
  const [elapsed, setElapsed] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(active.startedAt).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!active) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Începe un antrenament</h1>
          <p className="mt-1 text-muted-foreground">Alege rutina pe care o vrei astăzi.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {splits.map((split) => (
            <button
              key={split.id}
              onClick={() => {
                const last = sessions.find((s) => s.splitId === split.id);
                startWorkout(split, last?.sets);
                toast.success(`Antrenament început: ${split.name}`);
              }}
              className="rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-glow"
            >
              <h3 className="font-display text-lg font-semibold">{split.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{split.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{split.exercises.length} exerciții</span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Play className="h-3 w-3 fill-current" />
                  Start
                </span>
              </div>
            </button>
          ))}
        </div>

        <Link to="/dashboard/splits">
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Creează rutină nouă
          </Button>
        </Link>
      </div>
    );
  }

  const groups = new Map<string, typeof active.sets>();
  active.sets.forEach((s) => {
    const arr = groups.get(s.exerciseId) ?? [];
    arr.push(s);
    groups.set(s.exerciseId, arr);
  });
  const groupArr = Array.from(groups.entries());

  const completedCount = active.sets.filter((s) => s.completed).length;
  const totalCount = active.sets.length;

  return (
    <div className="space-y-4 pb-24">
      {/* Sticky timer header */}
      <div className="sticky top-[124px] z-30 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:top-[120px] md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {active.splitName}
            </div>
            <div className="font-mono text-2xl font-bold">{formatTime(elapsed)}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-secondary px-3 py-1 text-sm">
              <span className="font-mono font-bold text-primary">{completedCount}</span>
              <span className="text-muted-foreground">/{totalCount}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCancelOpen(true)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {restRemaining > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-lg bg-primary/15 px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Timer className="h-4 w-4" />
              Pauză: {formatTime(restRemaining)}
            </div>
            <button onClick={stopRest} className="text-xs text-primary hover:underline">
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Exerciții */}
      <div className="space-y-4">
        {groupArr.map(([exId, sets]) => (
          <ExerciseBlock key={exId} exerciseId={exId} sets={sets} />
        ))}
      </div>

      {/* Finish */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-7xl">
          <Button
            onClick={() => {
              finishWorkout();
              toast.success("Antrenament salvat!");
              navigate("/dashboard");
            }}
            className="h-12 w-full text-base font-semibold"
            disabled={completedCount === 0}
          >
            <Check className="mr-2 h-5 w-5" />
            Finalizează antrenamentul ({completedCount} serii)
          </Button>
        </div>
      </div>

      {/* Dialog confirmare anulare */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renunți la antrenament?</AlertDialogTitle>
            <AlertDialogDescription>
              Progresul curent nu va fi salvat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuă antrenamentul</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                cancelWorkout();
                navigate("/dashboard");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Renunță
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ExerciseBlock({
  exerciseId,
  sets,
}: {
  exerciseId: string;
  sets: ReturnType<typeof useWorkout>["active"] extends infer T
    ? T extends { sets: infer S }
      ? S
      : never
    : never;
}) {
  const { addSet, updateSet, removeSet, toggleComplete, startRest } = useWorkout();
  const ex = getExerciseById(exerciseId);
  const [calcOpen, setCalcOpen] = useState<number | null>(null);

  if (!ex) return null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
        <div>
          <h3 className="font-display font-semibold">{ex.name}</h3>
          <div className="text-xs text-muted-foreground">
            {sets.filter((s) => s.completed).length}/{sets.length} serii
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {sets.map((s, i) => (
          <SetRow
            key={s.id}
            set={s}
            index={i}
            onUpdate={(patch) => updateSet(s.id, patch)}
            onComplete={() => {
              toggleComplete(s.id);
              if (!s.completed) {
                const isHeavy = ex.isCompound && s.weight >= 60;
                startRest(isHeavy ? 180 : 90);
              }
            }}
            onRemove={() => removeSet(s.id)}
            onOpenCalc={() => setCalcOpen(i)}
          />
        ))}
      </div>

      <div className="p-2">
        <Button variant="ghost" size="sm" onClick={() => addSet(exerciseId)} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          Adaugă serie
        </Button>
      </div>

      {calcOpen !== null && (
        <PlateCalc weight={sets[calcOpen].weight} onClose={() => setCalcOpen(null)} />
      )}
    </div>
  );
}

function SetRow({
  set,
  index,
  onUpdate,
  onComplete,
  onRemove,
  onOpenCalc,
}: {
  set: {
    id: string;
    weight: number;
    reps: number;
    rir: number;
    isWarmup: boolean;
    completed: boolean;
  };
  index: number;
  onUpdate: (patch: Partial<typeof set>) => void;
  onComplete: () => void;
  onRemove: () => void;
  onOpenCalc: () => void;
}) {
  const clampReps = (value: number) => Math.min(100, Math.max(1, Math.round(value)));
  const rm = predict1RM(set.weight, set.reps, set.rir);

  return (
    <div className={`px-3 py-3 transition-colors ${set.completed ? "bg-success/10" : ""}`}>
      {/* Rând 1: număr serie + greutate + repetări */}
      <div className="flex items-end gap-2">
        <div className="mb-2 w-5 shrink-0 text-center font-mono text-xs text-muted-foreground">
          {set.isWarmup ? "W" : index + 1}
        </div>

        {/* Greutate */}
        <label className="flex flex-1 flex-col gap-1">
          <span className="pl-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Greutate (kg)
          </span>
          <div className="flex items-center gap-1">
            <StepBtn onClick={() => onUpdate({ weight: Math.max(0, set.weight - 2.5) })}>
              <Minus className="h-4 w-4" />
            </StepBtn>
            <Input
              type="number"
              inputMode="decimal"
              value={set.weight}
              onChange={(e) => onUpdate({ weight: Number(e.target.value) })}
              className="h-9 w-full min-w-0 px-1 text-center font-mono"
            />
            <StepBtn onClick={() => onUpdate({ weight: set.weight + 2.5 })}>
              <Plus className="h-4 w-4" />
            </StepBtn>
          </div>
        </label>

        {/* Repetări */}
        <label className="flex flex-1 flex-col gap-1">
          <span className="pl-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Repetări
          </span>
          <div className="flex items-center gap-1">
            <StepBtn onClick={() => onUpdate({ reps: clampReps(set.reps - 1) })}>
              <Minus className="h-4 w-4" />
            </StepBtn>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              step={1}
              value={set.reps}
              onChange={(e) => onUpdate({ reps: clampReps(Number(e.target.value)) })}
              className="h-9 w-full min-w-0 px-1 text-center font-mono"
            />
            <StepBtn onClick={() => onUpdate({ reps: clampReps(set.reps + 1) })}>
              <Plus className="h-4 w-4" />
            </StepBtn>
          </div>
        </label>
      </div>

      {/* Rând 2: RIR + 1RM estimat + acțiuni */}
      <div className="mt-2.5 flex items-center gap-2 pl-7">
        <label className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            RIR
          </span>
          <select
            value={set.rir}
            onChange={(e) => onUpdate({ rir: Number(e.target.value) })}
            className="h-8 rounded-lg border border-border bg-input px-2 text-xs font-mono"
            title="Repetări în rezervă (Reps in Reserve)"
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                R{n}
              </option>
            ))}
          </select>
        </label>

        {!set.isWarmup && rm > 0 && (
          <span
            className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
            title="1RM estimat (Brzycki + Epley)"
          >
            ~{rm.toFixed(0)} kg
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onOpenCalc}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/70"
            title="Calculator discuri"
          >
            <Calculator className="h-4 w-4" />
          </button>
          <button
            onClick={onComplete}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
              set.completed
                ? "bg-success text-success-foreground"
                : "bg-primary/15 text-primary hover:bg-primary/25"
            }`}
            title={set.completed ? "Serie completată" : "Marchează seria completă"}
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive"
            title="Șterge seria"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/70"
    >
      {children}
    </button>
  );
}

function PlateCalc({ weight, onClose }: { weight: number; onClose: () => void }) {
  const result = calculatePlates(weight);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Discuri pe bară</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-surface p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Greutate țintă
            </div>
            <div className="font-mono text-3xl font-bold">{weight} kg</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="mb-2 flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              Per parte (bară 20kg)
            </div>
            {result.perSide.length === 0 ? (
              <div className="text-sm text-muted-foreground">Bară goală — sub 20kg</div>
            ) : (
              <div className="space-y-1">
                {result.perSide.map((p) => (
                  <div
                    key={p.weight}
                    className="flex items-center justify-between font-mono text-sm"
                  >
                    <span>{p.weight} kg</span>
                    <span className="font-bold">× {p.count}</span>
                  </div>
                ))}
              </div>
            )}
            {result.remainder > 0 && (
              <div className="mt-2 text-xs text-warning">
                +{result.remainder.toFixed(2)}kg neacoperit (achievable: {result.achievable}kg)
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
