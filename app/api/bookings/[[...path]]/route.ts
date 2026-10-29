import { NextResponse, type NextRequest } from "next/server";
import config from "@/lib/config";

type Context = { params: Promise<{ path?: string[] }> };

async function forward(request: NextRequest, { params }: Context) {
  const path = (await params).path ?? [];
  const [first, second] = path;
  const valid =
    request.method === "GET"
      ? path.length === 0 ||
        (path.length === 1 && first !== "lock" && first !== "unlock")
      : path.length === 0 ||
        (path.length === 1 && (first === "lock" || first === "unlock")) ||
        (path.length === 2 && second === "cancel");

  if (!valid)
    return NextResponse.json(
      { message: "Unknown booking action" },
      { status: 404 },
    );

  try {
    const response = await fetch(
      `${config.apiURL}/bookings${path.map((part) => `/${encodeURIComponent(part)}`).join("")}`,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          "X-Device-Source": "web",
          ...(request.headers.get("authorization")
            ? { Authorization: request.headers.get("authorization")! }
            : {}),
        },
        body:
          request.method === "POST"
            ? (await request.text()) || undefined
            : undefined,
        cache: "no-store",
      },
    );

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "API unreachable" }, { status: 503 });
  }
}

export async function GET(request: NextRequest, context: Context) {
  return forward(request, context);
}

export async function POST(request: NextRequest, context: Context) {
  return forward(request, context);
}
