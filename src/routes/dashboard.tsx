import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useRouterState,
} from "@tanstack/react-router";
import { Dumbbell, LogOut, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { WorkoutProvider, useWorkout } from "@/lib/workout-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("forcelab.auth.user");
      if (!raw) {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <WorkoutProvider>
      <DashboardShell />
    </WorkoutProvider>
  );
}

function DashboardShell() {
  const { user, logout } = useAuth();
  const { active } = useWorkout();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const tabs = [
    { to: "/dashboard", label: "Istoric", exact: true },
    { to: "/dashboard/splits", label: "Rutine" },
    { to: "/dashboard/analytics", label: "Analize" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-display text-lg font-bold sm:inline">
              ForceLab
            </span>
          </Link>

          <Link to="/dashboard/workout" className="flex-1 md:flex-initial">
            <Button
              size="default"
              className="w-full font-semibold shadow-glow md:w-auto"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              {active ? "Continuă antrenamentul" : "Începe antrenament"}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Deconectare
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* TABS */}
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.to
                : pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`relative whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
