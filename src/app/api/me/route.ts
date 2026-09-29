import { NextResponse } from "next/server";
import { toPublicOwner } from "@/lib/auth";
import { currentOwner } from "@/lib/session";

export async function GET() {
  const owner = await currentOwner();
  if (!owner) return NextResponse.json({ owner: null }, { status: 200 });
  return NextResponse.json({ owner: toPublicOwner(owner) }, { status: 200 });
}