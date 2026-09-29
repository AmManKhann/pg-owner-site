import { NextRequest, NextResponse } from "next/server";
import { getOwnerByEmail, getOwnerBySlug } from "@/lib/store";
import { signSession, toPublicOwner, verifyPassword } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

async function findByIdentifier(identifier: string) {
  const id = String(identifier || "").trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) return getOwnerByEmail(id);
  return getOwnerBySlug(id);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const identifier = String(body?.identifier || body?.email || "").trim();
    const password = String(body?.password || "");

    if (!identifier || !password) {
      return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    }

    const owner = await findByIdentifier(identifier);
    if (!owner || !verifyPassword(password, owner.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json(
      { owner: toPublicOwner(owner), redirect: "/dashboard" },
      { status: 200 }
    );
    response.cookies.set(SESSION_COOKIE, signSession(owner.id), SESSION_COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}