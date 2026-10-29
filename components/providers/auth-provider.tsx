"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { getMe, logout } from "@/lib/api/auth.api";
import { clearTokens } from "@/lib/auth-storage";
import type { AuthUser } from "@/lib/types/auth.type";

/**
 * Client-side auth state: the user's profile, loaded from `/auth/me` using the
 * token in `localStorage`.
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  /** Seeds the state right after sign-in, saving a second `/auth/me` call. */
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
  signingOut: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [signingOut, setSigningOut] = useState(false);
  const revision = useRef(0);

  const applyUser = useCallback((next: AuthUser | null) => {
    revision.current += 1;
    setUser(next);
    setStatus(next ? "authenticated" : "unauthenticated");
  }, []);

  // Load the session once per page load. With no stored token this answers
  // 401 without making a request.
  useEffect(() => {
    let active = true;
    const startedAt = revision.current;

    async function loadSession() {
      try {
        const res = await getMe();
        if (!active || revision.current !== startedAt) return;

        if (!res.ok && res.status === 401) clearTokens();
        applyUser(res.user);
      } catch (error) {
        console.error("Error loading session:", error);
        if (active && revision.current === startedAt) applyUser(null);
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [applyUser]);

  const signOut = useCallback(async () => {
    setSigningOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      clearTokens();
      applyUser(null);
      setSigningOut(false);
      router.replace("/sign-in");
    }
  }, [applyUser, router]);

  return (
    <AuthContext.Provider
      value={{ user, status, setUser: applyUser, signOut, signingOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
