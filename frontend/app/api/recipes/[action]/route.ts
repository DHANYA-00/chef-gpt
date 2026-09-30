import { NextResponse } from "next/server";

export const maxDuration = 60;

const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://chef-gpt-eqo9.onrender.com";

const ALLOWED = new Set(["generate", "modify", "substitute", "rescue"]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (!ALLOWED.has(action)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/recipes/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const detail = data?.detail;
      return NextResponse.json(
        {
          error:
            typeof detail === "string"
              ? detail
              : "Some of the inputs were not valid. Please check and try again.",
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not reach the recipe service. Please try again." },
      { status: 502 }
    );
  }
}