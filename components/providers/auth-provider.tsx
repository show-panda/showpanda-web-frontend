"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AUTH_LOGOUT_EVENT } from "@/lib/api/api";
import {
  type AuthUser,
  fetchCurrentUser,
  logout as logoutRequest,
  startGoogleAuth,
} from "@/lib/api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  /** Kick off the Google OAuth redirect. Navigates away from the app. */
  signInWithGoogle: () => void;
  /** Revoke the session, clear tokens, and route to sign-in. */
  signOut: () => Promise<void>;
  /** Re-read the session from `/auth/me` (e.g. after the OAuth callback). */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SIGN_IN_PATH = "/sign-in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    // `fetchCurrentUser` resolves to null when there's no token, so state is
    // always updated after the await (never synchronously inside an effect).
    const me = await fetchCurrentUser();
    setUser(me);
    setStatus(me ? "authenticated" : "unauthenticated");
  }, []);

  // Hydrate the session on mount. The async wrapper keeps the state updates
  // inside refresh()'s post-await callback rather than the effect body.
  useEffect(() => {
    void (async () => {
      await refresh();
    })();
  }, [refresh]);

  // The request layer fires this when a silent refresh fails: the session is
  // gone, so drop the user and send them to sign-in.
  useEffect(() => {
    const onForcedLogout = () => {
      setUser(null);
      setStatus("unauthenticated");
      router.push(SIGN_IN_PATH);
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, onForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onForcedLogout);
  }, [router]);

  const signOut = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setStatus("unauthenticated");
    router.push(SIGN_IN_PATH);
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      signInWithGoogle: startGoogleAuth,
      signOut,
      refresh,
    }),
    [user, status, signOut, refresh],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>.");
  return ctx;
}
