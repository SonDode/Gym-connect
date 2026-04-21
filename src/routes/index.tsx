import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Dumbbell,
  LineChart,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gym-Connect — Antrenament inteligent de forță" },
      {
        name: "description",
        content:
          "Predicție 1RM, monitorizare RIR și grafice de progres bazate pe regresie liniară. Sport-science în buzunarul tău.",
      },
      { property: "og:title", content: "Gym-Connect — Antrenament inteligent" },
      {
        property: "og:description",
        content: "Sport science complet pentru sportivii care vor progres real.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Gym-Connect
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Autentificare
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Înregistrare gratuită
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Zap className="h-3.5 w-3.5" />
              Sport science · În timp real
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tighter md:text-7xl">
              Antrenamente fără{" "}
              <span className="text-gradient-primary">presupuneri</span>.
              <br />
              Doar progres măsurabil.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Gym-Connect îți transformă fiecare serie într-un punct de date.
              Predicție 1RM, monitorizare RIR și grafice de regresie liniară —
              construite pentru sportivi serioși care vor să elimine stagnarea.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-base font-semibold animate-pulse-glow">
                  Începe gratuit
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Am deja cont
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Demo card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-3xl border border-border bg-card p-2 shadow-elevated">
              <div className="rounded-2xl bg-gradient-surface p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-3">
                  <DemoStat
                    icon={<Target className="h-5 w-5" />}
                    label="1RM estimat"
                    value="142.5"
                    unit="kg"
                    delta="+5.2 kg / lună"
                  />
                  <DemoStat
                    icon={<Activity className="h-5 w-5" />}
                    label="Volum săptămânal"
                    value="12,840"
                    unit="kg"
                    delta="+8% vs. săpt. trecută"
                  />
                  <DemoStat
                    icon={<TrendingUp className="h-5 w-5" />}
                    label="Tendință forță"
                    value="↑ 4.1"
                    unit="kg / săpt."
                    delta="Progres consistent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Tot ce ai nevoie ca să devii{" "}
              <span className="text-gradient-primary">mai puternic</span>.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Patru piloni care transformă timpul petrecut în sală în adaptări
              fiziologice măsurabile.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<Brain />}
              title="Predicție 1RM avansată"
              text="Algoritmi Brzycki + Epley combinați cu valoarea RIR pentru a-ți estima maximul fără să mergi la eșec. Fără riscuri inutile."
            />
            <FeatureCard
              icon={<LineChart />}
              title="Regresie liniară pe progres"
              text="Trasăm dreapta de tendință a forței tale și extrapolăm performanța pentru următoarele 4 săptămâni."
            />
            <FeatureCard
              icon={<Target />}
              title="Monitorizare RIR (Reps in Reserve)"
              text="Cuantificăm efortul real al fiecărei serii. Stim când ești în zona optimă de hipertrofie și când e timpul de deload."
            />
            <FeatureCard
              icon={<Dumbbell />}
              title="Split-uri personalizate"
              text="Construiește-ți rutinele Push/Pull/Legs sau orice combinație. Bibliotecă cu zeci de exerciții, filtrabilă pe grupe musculare."
            />
            <FeatureCard
              icon={<Timer />}
              title="Smart rest timer"
              text="Cronometru automat de odihnă care pornește la finalul fiecărei serii, configurabil per exercițiu."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Calculator de discuri"
              text="Vezi instant ce discuri să încarci pe bară pentru greutatea țintă. Mai puțin calcul mental, mai mult focus pe ridicare."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Următorul tău PR e la o decizie distanță.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Începe să loghezi azi. Vezi tendința forței mâine.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" className="h-12 px-10 text-base font-semibold">
                Creează cont gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span>© {new Date().getFullYear()} ForceLab</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Termeni</a>
            <a href="#" className="hover:text-foreground">Confidențialitate</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DemoStat({
  icon,
  label,
  value,
  unit,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  delta: string;
}) {
  return (
    <div className="text-left">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-4xl font-bold">{value}</span>
        <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-1 text-xs font-medium text-success">{delta}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
