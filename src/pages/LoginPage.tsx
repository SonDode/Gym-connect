import { SignIn } from "@clerk/react";
import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Gym-Connect</span>
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <SignIn routing="path" path="/login" fallbackRedirectUrl="/dashboard" />
      </main>
    </div>
  );
}
