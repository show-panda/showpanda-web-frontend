/**
 * Fetch-based API client. One `request()` does the work; `api.get/post/...`
 * are thin typed wrappers. The base URL comes from env via `lib/config` (no
 * hardcoded URLs); the access token (stored client-side after Google sign-in)
 * is attached automatically, and an expired one is refreshed transparently.
 */

import config from "@/lib/config";
import { ENDPOINTS } from "./endpoints";

export const DEFAULT_TIMEOUT_MS = 30_000;
/** localStorage key the (short-lived) access token is stored under. */
export const ACCESS_TOKEN_KEY = "access_token";
/** localStorage key the (long-lived) refresh token is stored under. */
export const REFRESH_TOKEN_KEY = "refresh_token";
/**
 * Browser event dispatched when a refresh attempt fails and the session can no
 * longer be recovered. The auth provider listens for this to drop the user and
 * redirect to sign-in (see `components/providers/auth-provider.tsx`).
 */
export const AUTH_LOGOUT_EVENT = "auth:logout";

// ── Types ───────────────────────────────────────────────────────────────────

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface RequestOptions<TBody = unknown> {
  headers?: Record<string, string>;
  params?: QueryParams;
  body?: TBody;
  /** Multipart upload payload; takes precedence over `body`. */
  formData?: FormData;
  /** Per-request timeout in ms (default `DEFAULT_TIMEOUT_MS`). */
  timeout?: number;
  /** Attach the auth token automatically (default `true`). */
  withAuth?: boolean;
  /** Explicit token, overriding automatic resolution. */
  token?: string;
  signal?: AbortSignal;
  /** Standard fetch cache mode. */
  cache?: RequestCache;
  /** Next.js caching hints — `fetch` is uncached by default in Next 16. */
  next?: { revalidate?: number | false; tags?: string[] };
  /**
   * Internal — opt this request out of the 401 → refresh → retry cycle. Set on
   * the refresh call itself (and the retry) so we never recurse.
   */
  _noRefresh?: boolean;
}

export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "SERVER_ERROR"
  | "HTTP_ERROR";

// ── Error model ───────────────────────────────────────────────────────────────

/** Single error type for every failure — branch on the stable `code`. */
export class ApiError<TData = unknown> extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly status = 0,
    readonly data?: TData,
    /** Field → messages map from a 422 response, when present. */
    readonly fieldErrors?: Record<string, string[] | string>,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static is(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}

const STATUS_MESSAGE: Record<number, string> = {
  400: "The request was invalid. Please check your input.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  422: "Some of the information provided is invalid.",
  429: "Too many requests. Please slow down and try again shortly.",
  500: "Something went wrong on our end. Please try again later.",
};

function codeForStatus(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 422) return "VALIDATION";
  return status >= 500 ? "SERVER_ERROR" : "HTTP_ERROR";
}

/** Build an `ApiError` from a non-2xx response and its parsed body. */
function httpError(status: number, body: unknown): ApiError {
  const b = (body ?? {}) as Record<string, unknown>;
  const message =
    (typeof b.message === "string" && b.message) ||
    (typeof b.error === "string" && b.error) ||
    STATUS_MESSAGE[status] ||
    `Request failed with status ${status}.`;
  const fieldErrors =
    b.errors && typeof b.errors === "object"
      ? (b.errors as Record<string, string[] | string>)
      : undefined;
  return new ApiError(codeForStatus(status), message, status, body, fieldErrors);
}

// ── Auth tokens (server + client, no client-bundle leakage) ──────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Client-only token storage. The OAuth callback persists both tokens here; the
 * request layer reads the access token to authorise calls and the refresh token
 * to silently renew an expired session.
 */
export const tokenStore = {
  getAccessToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
  getRefreshToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  setTokens: ({ accessToken, refreshToken }: AuthTokens) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  isAuthenticated: () =>
    typeof window !== "undefined" && !!localStorage.getItem(ACCESS_TOKEN_KEY),
};

// ── Silent token refresh (client only) ───────────────────────────────────────

/**
 * In-flight refresh, shared so a burst of concurrent 401s triggers exactly one
 * `POST /auth/refresh`. Resolves to `true` when fresh tokens were stored.
 */
let refreshInFlight: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return false;
  try {
    const { data } = await request<AuthTokens, { refreshToken: string }>(
      "POST",
      ENDPOINTS.auth.refresh,
      { body: { refreshToken }, withAuth: false, _noRefresh: true },
    );
    tokenStore.setTokens(data);
    return true;
  } catch {
    // Refresh token is dead — surrender the session and let the app react.
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
    return false;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildUrl(path: string, params?: QueryParams): string {
  const base = config.apiURL?.trim();
  if (!base) {
    throw new ApiError(
      "NETWORK_ERROR",
      "API base URL is not configured. Set NEXT_PUBLIC_API_URL_STAGE / _PROD.",
    );
  }
  const url = /^https?:\/\//i.test(path)
    ? path
    : `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  if (!params) return url;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined && item !== null) search.append(key, String(item));
    }
  }
  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

/** Strip prototype-pollution keys and `undefined` before serialising. */
function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== undefined && !["__proto__", "constructor", "prototype"].includes(k)) {
        out[k] = sanitize(v);
      }
    }
    return out;
  }
  return value;
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204 || res.headers.get("content-length") === "0") return null;
  const text = await res.text();
  if (!text) return null;
  return res.headers.get("content-type")?.includes("application/json")
    ? JSON.parse(text)
    : text;
}

// ── Core request ─────────────────────────────────────────────────────────────

/**
 * @typeParam T     Expected response body shape.
 * @typeParam TBody JSON request payload type.
 * @throws {ApiError} on network failure, timeout, or any non-2xx status.
 */
export async function request<T, TBody = unknown>(
  method: Method,
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<{ data: T; status: number; headers: Headers }> {
  const { params, body, formData, timeout = DEFAULT_TIMEOUT_MS, withAuth = true } = options;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (withAuth) {
    const token = options.token ?? tokenStore.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  // FormData sets its own multipart boundary, so don't touch Content-Type.
  let payload: BodyInit | undefined;
  if (formData) payload = formData;
  else if (body !== undefined && method !== "GET") {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(sanitize(body));
  }

  // Timeout via AbortSignal, combined with any caller signal.
  const timeoutSignal = AbortSignal.timeout(timeout);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutSignal])
    : timeoutSignal;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: payload,
      signal,
      cache: options.cache,
      next: options.next,
    } as RequestInit);
  } catch {
    if (timeoutSignal.aborted) {
      throw new ApiError("TIMEOUT", `Request timed out after ${timeout}ms.`);
    }
    throw new ApiError(
      "NETWORK_ERROR",
      "Unable to reach the server. Check your connection and try again.",
    );
  }

  const parsed = await parseBody(res).catch(() => null);

  // 401 → try a one-shot silent refresh, then replay the original request.
  // Guarded by `_noRefresh` (set on the refresh call and the replay) and by the
  // browser check, since refresh tokens only live in client storage.
  if (
    res.status === 401 &&
    withAuth &&
    !options._noRefresh &&
    typeof window !== "undefined" &&
    (await refreshSession())
  ) {
    return request<T, TBody>(method, path, {
      ...options,
      token: undefined, // re-resolve the freshly stored access token
      _noRefresh: true,
    });
  }

  if (!res.ok) throw httpError(res.status, parsed);
  return { data: parsed as T, status: res.status, headers: res.headers };
}

/**
 * Public API. Convenience methods return the parsed body; use `api.request`
 * when you also need `status`/`headers` (pagination, rate limits, …).
 */
export const api = {
  request,
  get: <T>(path: string, o?: Omit<RequestOptions, "body" | "formData">) =>
    request<T>("GET", path, o).then((r) => r.data),
  post: <T, B = unknown>(path: string, body?: B, o?: RequestOptions<B>) =>
    request<T, B>("POST", path, { ...o, body }).then((r) => r.data),
  put: <T, B = unknown>(path: string, body?: B, o?: RequestOptions<B>) =>
    request<T, B>("PUT", path, { ...o, body }).then((r) => r.data),
  patch: <T, B = unknown>(path: string, body?: B, o?: RequestOptions<B>) =>
    request<T, B>("PATCH", path, { ...o, body }).then((r) => r.data),
  delete: <T>(path: string, o?: Omit<RequestOptions, "body">) =>
    request<T>("DELETE", path, o).then((r) => r.data),
  upload: <T>(path: string, formData: FormData, o?: Omit<RequestOptions, "body" | "formData">) =>
    request<T>("POST", path, { ...o, formData }).then((r) => r.data),
};
