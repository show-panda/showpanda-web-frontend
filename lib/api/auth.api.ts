import {
  clearTokens,
  readAccessToken,
  readRefreshToken,
  saveTokens,
} from "@/lib/auth-storage";
import type { AuthUser } from "@/lib/types/auth.type";

/**
 * Auth calls, made from the browser with the token from `localStorage`.
 *
 * They go to `/api/auth/*` (our own forwarder) rather than to the API host,
 * because the API doesn't allow cross-origin requests.
 */
type Result = {
  ok: boolean;
  /** `0` when the request never got out; `503` when the API is unreachable. */
  status: number;
  data: unknown;
};

const FAILED: Result = { ok: false, status: 401, data: null };

async function call(
  action: string,
  init: RequestInit = {},
  base = "/api/auth",
): Promise<Result> {
  try {
    const response = await fetch(`${base}${action ? `/${action}` : ""}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });

    return {
      ok: response.ok,
      status: response.status,
      data: await response.json().catch(() => null),
    };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

/** The API wraps payloads in `{ code, message, data }`. */
function unwrap(data: unknown) {
  const body = (data ?? {}) as Record<string, unknown>;

  return (body.data ?? body) as Record<string, unknown>;
}

function text(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

/** Only an explicit credential rejection ends the session. */
function isRejected(status: number) {
  return status === 400 || status === 401 || status === 403;
}

/** Swaps the refresh token for a new access token. Returns it, or null. */
async function requestRefresh(): Promise<{
  token: string | null;
  status: number;
}> {
  const refreshToken = readRefreshToken();

  if (!refreshToken) return { token: null, status: 401 };

  const { ok, status, data } = await call("refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  const accessToken = text(unwrap(data).accessToken);

  if (!ok || !accessToken) {
    // A refresh token the API rejects is unusable — end the session instead of
    // retrying it forever. A network blip leaves it alone.
    if (isRejected(status) && readRefreshToken() === refreshToken)
      clearTokens();

    return { token: null, status };
  }

  if (readRefreshToken() !== refreshToken) {
    return { token: null, status: 401 };
  }

  saveTokens(accessToken, text(unwrap(data).refreshToken) ?? undefined);

  return { token: accessToken, status };
}

let refreshPromise: ReturnType<typeof requestRefresh> | null = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = requestRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Calls a protected endpoint with the stored access token, refreshing it once
 * if the API says it has expired. Only once, so there is no refresh loop.
 */
export async function authorizedFetch(
  action: string,
  init: RequestInit = {},
  base = "/api/auth",
) {
  const storedToken = readAccessToken();
  const initial = storedToken
    ? { token: storedToken, status: 200 }
    : await refreshAccessToken();

  if (!initial.token) return { ...FAILED, status: initial.status };

  const send = (accessToken: string) =>
    call(
      action,
      {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${accessToken}` },
      },
      base,
    );

  const result = await send(initial.token);

  if (result.status !== 401) return result;

  const refreshed = await refreshAccessToken();

  return refreshed.token
    ? send(refreshed.token)
    : { ...FAILED, status: refreshed.status };
}

/** The signed-in user, or `user: null` with the status that explains why. */
export async function getMe() {
  const { ok, status, data } = await authorizedFetch("me");

  const raw = unwrap(data);

  // Ids come back as a string today, but a numeric id shouldn't break sign-in.
  const id =
    typeof raw.id === "string" || typeof raw.id === "number"
      ? String(raw.id)
      : null;

  const user: AuthUser | null =
    ok && id
      ? {
          id,
          name: text(raw.name),
          email: text(raw.email),
          profileImage: text(raw.profileImage),
        }
      : null;

  return { ok: ok && Boolean(user), status, user };
}

/** Best effort: the caller clears storage whatever the API answers. */
export async function logout() {
  const refreshToken = readRefreshToken();

  if (!refreshToken) return;

  await authorizedFetch("logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
