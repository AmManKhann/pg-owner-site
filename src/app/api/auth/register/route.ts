import { NextRequest, NextResponse } from "next/server";
import { createOwner, signSession } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";
import { toPublicOwner } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");
    const phone = String(body?.phone || "").trim() || undefined;
    const slug = String(body?.slug || "").trim() || undefined;

    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    const result = await createOwner({ name, email, password, phone, slug });
    if (result.error || !result.owner) {
      return NextResponse.json({ error: result.error || "Registration failed." }, { status: 400 });
    }

    const response = NextResponse.json(
      { owner: toPublicOwner(result.owner), redirect: "/dashboard", slug: result.owner.slug },
      { status: 201 }
    );
    response.cookies.set(SESSION_COOKIE, signSession(result.owner.id), SESSION_COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}