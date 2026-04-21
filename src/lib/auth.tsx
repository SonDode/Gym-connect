import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "forcelab.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    if (typeof window === "undefined") return;
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    if (!email.includes("@") || password.length < 6) {
      throw new Error("Credențiale invalide");
    }
    const u: AuthUser = {
      id: "user-" + email.split("@")[0],
      email,
      name: email.split("@")[0],
    };
    setUser(u);
    persist(u);
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      throw new Error("Date invalide");
    }
    const u: AuthUser = {
      id: "user-" + email.split("@")[0],
      email,
      name: name.trim(),
    };
    setUser(u);
    persist(u);
  };

  const logout = () => {
    setUser(null);
    persist(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
