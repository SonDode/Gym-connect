import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, Trash2, Dumbbell, Search, Play, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSplits } from "@/hooks/use-splits";
import { useSessions } from "@/hooks/use-sessions";
import {
  EXERCISE_LIBRARY,
  MUSCLE_GROUP_LABELS,
  EQUIPMENT_LABELS,
  getExerciseById,
  type MuscleGroup,
  type EquipmentType,
} from "@/data/exercises";
import type { SplitTemplate, SplitExercise } from "@/types/workout";
import { useWorkout } from "@/lib/workout-context";
import { toast } from "sonner";

export function SplitsPage() {
  const { splits, upsertSplit, deleteSplit, loaded } = useSplits();
  const { sessions } = useSessions();
  const { startWorkout } = useWorkout();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<SplitTemplate | null>(null);

  if (!loaded) return <div className="text-muted-foreground">Se încarcă...</div>;

  const handleStart = (split: SplitTemplate) => {
    const lastSession = sessions.find((s) => s.splitId === split.id);
    startWorkout(split, lastSession?.sets);
    navigate("/dashboard/workout");
    toast.success(`Antrenament început: ${split.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Rutine</h1>
          <p className="mt-1 text-muted-foreground">Construiește-ți split-urile personalizate.</p>
        </div>
        <Button
          onClick={() =>
            setEditing({
              id: `split-${Date.now()}`,
              name: "",
              description: "",
              exercises: [],
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Rutină nouă
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {splits.map((split) => (
          <SplitCard
            key={split.id}
            split={split}
            onEdit={() => setEditing(split)}
            onDelete={async () => {
              try {
                await deleteSplit(split.id);
              } catch {
                toast.error("Eroare la ștergerea rutinei");
              }
            }}
            onStart={() => handleStart(split)}
          />
        ))}
      </div>

      {editing && (
        <SplitEditor
          split={editing}
          onClose={() => setEditing(null)}
          onSave={async (s) => {
            try {
              await upsertSplit(s);
              setEditing(null);
              toast.success("Rutină salvată");
            } catch {
              toast.error("Eroare la salvarea rutinei");
            }
          }}
        />
      )}
    </div>
  );
}

function SplitCard({
  split,
  onEdit,
  onDelete,
  onStart,
}: {
  split: SplitTemplate;
  onEdit: () => void;
  onDelete: () => void;
  onStart: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold">{split.name}</h3>
          {split.description && (
            <p className="mt-1 text-sm text-muted-foreground">{split.description}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Dumbbell className="h-3.5 w-3.5" />
        {split.exercises.length} exerciții
      </div>
      <div className="mt-3 space-y-1">
        {split.exercises.slice(0, 4).map((sx) => {
          const ex = getExerciseById(sx.exerciseId);
          return (
            <div key={sx.exerciseId} className="flex items-center justify-between text-sm">
              <span className="truncate">{ex?.name ?? sx.exerciseId}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {sx.targetSets} × {sx.targetRepRange}
              </span>
            </div>
          );
        })}
        {split.exercises.length > 4 && (
          <div className="text-xs text-muted-foreground">
            +{split.exercises.length - 4} exerciții
          </div>
        )}
      </div>
      <Button onClick={onStart} className="mt-4 w-full">
        <Play className="mr-2 h-4 w-4 fill-current" />
        Începe acum
      </Button>
    </div>
  );
}

function SplitEditor({
  split,
  onClose,
  onSave,
}: {
  split: SplitTemplate;
  onClose: () => void;
  onSave: (s: SplitTemplate) => Promise<void>;
}) {
  const [draft, setDraft] = useState<SplitTemplate>(split);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addExercise = (exerciseId: string) => {
    if (draft.exercises.some((e) => e.exerciseId === exerciseId)) return;
    setDraft({
      ...draft,
      exercises: [
        ...draft.exercises,
        { exerciseId, targetSets: 3, targetRepRange: "8-12", order: draft.exercises.length },
      ],
    });
    setPickerOpen(false);
  };

  const updateExercise = (exerciseId: string, patch: Partial<SplitExercise>) => {
    setDraft({
      ...draft,
      exercises: draft.exercises.map((e) => (e.exerciseId === exerciseId ? { ...e, ...patch } : e)),
    });
  };

  const removeExercise = (exerciseId: string) => {
    setDraft({
      ...draft,
      exercises: draft.exercises.filter((e) => e.exerciseId !== exerciseId),
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{split.name ? "Editează rutina" : "Rutină nouă"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nume</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Ex: Push (Piept · Triceps)"
            />
          </div>
          <div className="space-y-2">
            <Label>Descriere (opțional)</Label>
            <Input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Focus, indicații..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Exerciții ({draft.exercises.length})</Label>
              <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Adaugă
              </Button>
            </div>
            {draft.exercises.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Adaugă primele exerciții pentru această rutină.
              </div>
            )}
            <div className="space-y-2">
              {draft.exercises.map((sx) => {
                const ex = getExerciseById(sx.exerciseId);
                return (
                  <div
                    key={sx.exerciseId}
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 p-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {ex?.name ?? sx.exerciseId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ex && MUSCLE_GROUP_LABELS[ex.muscleGroup]}
                      </div>
                    </div>
                    <Input
                      type="number"
                      value={sx.targetSets}
                      onChange={(e) =>
                        updateExercise(sx.exerciseId, {
                          targetSets: Number(e.target.value),
                        })
                      }
                      className="h-9 w-16"
                      min={1}
                    />
                    <Input
                      value={sx.targetRepRange}
                      onChange={(e) =>
                        updateExercise(sx.exerciseId, {
                          targetRepRange: e.target.value,
                        })
                      }
                      className="h-9 w-20 font-mono"
                      placeholder="8-12"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeExercise(sx.exerciseId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Anulează
          </Button>
          <Button
            onClick={async () => {
              setSaving(true);
              await onSave(draft);
              setSaving(false);
            }}
            disabled={saving || !draft.name.trim() || draft.exercises.length === 0}
          >
            {saving ? "Se salvează..." : "Salvează"}
          </Button>
        </DialogFooter>

        {pickerOpen && (
          <ExercisePicker
            existing={new Set(draft.exercises.map((e) => e.exerciseId))}
            onPick={addExercise}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ExercisePicker({
  existing,
  onPick,
  onClose,
}: {
  existing: Set<string>;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [equip, setEquip] = useState<EquipmentType | "all">("all");

  const filtered = EXERCISE_LIBRARY.filter((e) => {
    if (muscle !== "all" && e.muscleGroup !== muscle) return false;
    if (equip !== "all" && e.equipmentType !== equip) return false;
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Alege un exercițiu</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută..."
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={muscle === "all"} onClick={() => setMuscle("all")}>
              Toate
            </FilterChip>
            {(Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[]).map((m) => (
              <FilterChip key={m} active={muscle === m} onClick={() => setMuscle(m)}>
                {MUSCLE_GROUP_LABELS[m]}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={equip === "all"} onClick={() => setEquip("all")}>
              Tot ech.
            </FilterChip>
            {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((e) => (
              <FilterChip key={e} active={equip === e} onClick={() => setEquip(e)}>
                {EQUIPMENT_LABELS[e]}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="-mx-6 flex-1 overflow-y-auto border-t border-border px-6 py-2">
          <div className="space-y-1">
            {filtered.map((ex) => {
              const taken = existing.has(ex.id);
              return (
                <button
                  key={ex.id}
                  disabled={taken}
                  onClick={() => onPick(ex.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors hover:bg-secondary/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{ex.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {MUSCLE_GROUP_LABELS[ex.muscleGroup]} · {EQUIPMENT_LABELS[ex.equipmentType]}
                    </div>
                  </div>
                  {taken && <span className="text-xs text-muted-foreground">Adăugat</span>}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Niciun exercițiu nu corespunde filtrelor.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {children}
    </button>
  );
}
