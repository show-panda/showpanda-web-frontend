import "server-only";
// import { redirect } from "next/navigation";
import config from "../config";

const BASE_URL = config.apiURL;

interface FetchOptions extends RequestInit {
  data?: object;
  skipToken?: boolean;
  accessToken?: string;
  rawBody?: FormData;
  _retried?: boolean;
}

async function customFetch(endpoint: string, options: FetchOptions = {}) {
  const {
    data,
    headers: customHeaders,
    // skipToken,
    // accessToken,
    rawBody,
    // _retried,
    ...customConfig
  } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };
  if (!rawBody) headers["Content-Type"] = "application/json";
  headers["X-Device-Source"] = "web";

  //   if (!skipToken) {
  //     const token = accessToken || (await getUserAccessToken());
  //     if (token) headers["Authorization"] = `Bearer ${token}`;
  //   }

  const reqConfig: RequestInit = { ...customConfig, headers };
  if (rawBody) reqConfig.body = rawBody;
  else if (data) reqConfig.body = JSON.stringify(data);

  let body;
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, reqConfig);
    body = await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }

  //   // 401 → refresh once and replay. The shared refreshAccessToken handles
  //   // in-flight dedup and caches by old-refresh-token so concurrent 401s and
  //   // RSC-vs-middleware races don't double-spend a rotated token.
  //   if (
  //     body?.code === 401 &&
  //     body?.message === "Unauthorized" &&
  //     !skipToken &&
  //     !_retried
  //   ) {
  //     const refreshed = await refreshAccessToken(await getUserRefreshToken());

  //     if (refreshed) {
  //       return customFetch(endpoint, {
  //         ...options,
  //         accessToken: refreshed.accessToken,
  //         _retried: true,
  //       });
  //     }

  //     // Refresh genuinely failed → best-effort sign-out + redirect to /login.
  //     // The middleware's redirectAndClearAuth handles cookie clearing for the
  //     // contexts where it matters (cross-request). redirect() works in RSC,
  //     // server actions, and route handlers.
  //     await clearAuthSession();
  //     redirect("/login");
  //   }

  return body;
}

export function get(endpoint: string, options?: FetchOptions) {
  return customFetch(endpoint, { ...options, method: "GET" });
}

export function post(
  endpoint: string,
  data?: object | FormData,
  options?: FetchOptions,
) {
  const isFormData = data instanceof FormData;
  return customFetch(endpoint, {
    ...options,
    method: "POST",
    data: isFormData ? undefined : data,
    rawBody: isFormData ? data : undefined,
  });
}

export function put(endpoint: string, data: object, options?: FetchOptions) {
  return customFetch(endpoint, { ...options, method: "PUT", data });
}

export function patch(endpoint: string, data: object, options?: FetchOptions) {
  return customFetch(endpoint, { ...options, method: "PATCH", data });
}

export function del(endpoint: string, options?: FetchOptions) {
  return customFetch(endpoint, { ...options, method: "DELETE" });
}

const api = { get, post, put, patch, delete: del };

export default api;
