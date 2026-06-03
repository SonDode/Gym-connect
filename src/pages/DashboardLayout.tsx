import { Outlet, Link, useLocation } from "react-router-dom";
import { Dumbbell, LogOut, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useClerk } from "@clerk/react";
import { WorkoutProvider, useWorkout } from "@/lib/workout-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardLayout() {
  return (
    <WorkoutProvider>
      <DashboardShell />
    </WorkoutProvider>
  );
}

function DashboardShell() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { active } = useWorkout();
  const { pathname } = useLocation();

  const tabs: Array<{ to: string; label: string; exact?: boolean }> = [
    { to: "/dashboard", label: "Istoric", exact: true },
    { to: "/dashboard/splits", label: "Rutine" },
    { to: "/dashboard/analytics", label: "Analize" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-display text-lg font-bold sm:inline">Gym-Connect</span>
          </Link>

          <Link to="/dashboard/workout" className="flex-1 md:flex-initial">
            <Button size="default" className="w-full font-semibold shadow-glow md:w-auto">
              <Play className="mr-2 h-4 w-4 fill-current" />
              {active ? "Continuă antrenamentul" : "Începe antrenament"}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  {user?.firstName?.[0]?.toUpperCase() ?? "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{user?.fullName ?? user?.firstName}</div>
                <div className="text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })}>
                <LogOut className="mr-2 h-4 w-4" />
                Deconectare
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
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
