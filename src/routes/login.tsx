import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Dumbbell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Autentificare — ForceLab" },
      { name: "description", content: "Accesează contul ForceLab." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard" });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Bun venit înapoi!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Eroare la autentificare");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">ForceLab</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Bun venit înapoi
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Continuă-ți progresul.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Parolă</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Ai uitat parola?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                  aria-label={showPwd ? "Ascunde parola" : "Arată parola"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full text-base font-semibold"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Autentificare"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nu ai cont?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Înregistrează-te
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
