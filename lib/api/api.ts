import "server-only";
import config from "../config";

/** Server-side GET requests to the booking API. */
async function get(endpoint: string) {
  const response = await fetch(`${config.apiURL}${endpoint}`, {
    headers: { "X-Device-Source": "web", "Content-Type": "application/json" },
  });
  return response.json();
}

const api = { get };

export default api;
