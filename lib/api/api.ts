import "server-only";
import config from "../config";

/** Cache public data briefly; pass 0 for live data such as seat availability. */
async function get(endpoint: string, revalidate: number) {
  const response = await fetch(`${config.apiURL}${endpoint}`, {
    headers: { "X-Device-Source": "web", "Content-Type": "application/json" },
    next: { revalidate },
  });
  return response.json();
}

const api = { get };

export default api;
