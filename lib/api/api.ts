import "server-only";
import config from "../config";

const BASE_URL = config.apiURL;

interface FetchOptions extends RequestInit {
  data?: object;
  rawBody?: FormData;
}

async function customFetch(endpoint: string, options: FetchOptions = {}) {
  const { data, headers: customHeaders, rawBody, ...requestConfig } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
    "X-Device-Source": "web",
  };
  if (!rawBody) headers["Content-Type"] = "application/json";

  const reqConfig: RequestInit = { ...requestConfig, headers };
  if (rawBody) reqConfig.body = rawBody;
  else if (data) reqConfig.body = JSON.stringify(data);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, reqConfig);
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
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
