const BASE_URL = "https://api.hubapi.com";

export class HubSpotError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "HubSpotError";
  }
}

function getToken(): string {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new HubSpotError("HUBSPOT_ACCESS_TOKEN is not set");
  return token;
}

export async function hubspot<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const token = getToken();

  let url = `${BASE_URL}${path}`;
  if (params && method === "GET") {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body && method !== "GET" ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new HubSpotError(`HubSpot API error (${res.status}): ${text}`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function ok(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function err(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return {
    isError: true,
    content: [{ type: "text" as const, text: `Error: ${msg}` }],
  };
}
