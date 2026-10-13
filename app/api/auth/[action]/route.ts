import { NextResponse, type NextRequest } from "next/server";

import config from "@/lib/config";

/**
 * Passes auth requests through to the NestJS API.
 *
 * The API has CORS disabled, so the browser can't call it directly. These go
 * through Next.js instead: same-origin for the browser, plain server-to-server
 * for the API. Once the API sends CORS headers this whole file can go, and
 * `lib/api/auth.api.ts` can point straight at it.
 */
const ACTIONS = ["me", "refresh", "logout"];

async function forward(request: NextRequest, action: string) {
  if (!ACTIONS.includes(action)) {
    return NextResponse.json({ message: "Unknown action" }, { status: 404 });
  }

  const authorization = request.headers.get("authorization");
  const body = request.method === "POST" ? await request.text() : undefined;

  let response: Response;

  try {
    response = await fetch(`${config.apiURL}/auth/${action}`, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        "X-Device-Source": "web",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: body || undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "API unreachable" }, { status: 503 });
  }

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

type RouteContext = { params: Promise<{ action: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return forward(request, (await params).action);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return forward(request, (await params).action);
}
