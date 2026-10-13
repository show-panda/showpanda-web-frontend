"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { getMe, logout } from "@/lib/api/auth.api";
import { rememberVisitedPath } from "@/lib/auth-return-path";
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
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [signingOut, setSigningOut] = useState(false);
  const revision = useRef(0);

  const applyUser = useCallback((next: AuthUser | null) => {
    revision.current += 1;
    setUser(next);
    setStatus(next ? "authenticated" : "unauthenticated");
  }, []);

  // Tracks where the user has been, so sign-in can send them back there.
  useEffect(() => {
    rememberVisitedPath(pathname);
  }, [pathname]);

  // Load the session once per page load. With no stored token this answers
  // 401 without making a request.
  useEffect(() => {
    let active = true;
    const startedAt = revision.current;

    getMe().then((result) => {
      if (!active || revision.current !== startedAt) return;

      if (!result.ok && result.status === 401) clearTokens();

      applyUser(result.user);
    });

    return () => {
      active = false;
    };
  }, [applyUser]);

  const signOut = useCallback(async () => {
    setSigningOut(true);

    await logout();

    clearTokens();
    applyUser(null);
    setSigningOut(false);

    router.replace("/sign-in");
  }, [applyUser, router]);

  const value = useMemo(
    () => ({ user, status, setUser: applyUser, signOut, signingOut }),
    [user, status, applyUser, signOut, signingOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
