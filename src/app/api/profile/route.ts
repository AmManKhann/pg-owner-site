import { NextRequest, NextResponse } from "next/server";
import { toPublicOwner, updateOwnerProfile } from "@/lib/auth";
import { currentOwner } from "@/lib/session";

export async function PUT(request: NextRequest) {
  const owner = await currentOwner();
  if (!owner) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const result = await updateOwnerProfile(owner.id, {
    name: typeof body.name === "string" ? body.name : undefined,
    email: typeof body.email === "string" ? body.email : undefined,
    phone: typeof body.phone === "string" ? body.phone : undefined,
    whatsapp: typeof body.whatsapp === "string" ? body.whatsapp : undefined,
    website: typeof body.website === "string" ? body.website : undefined,
    tagline: typeof body.tagline === "string" ? body.tagline : undefined,
    about: typeof body.about === "string" ? body.about : undefined,
    city: typeof body.city === "string" ? body.city : undefined,
    address: typeof body.address === "string" ? body.address : undefined,
    logo: typeof body.logo === "string" ? body.logo : undefined,
    brandName: typeof body.brandName === "string" ? body.brandName : undefined,
    brandColor: typeof body.brandColor === "string" ? body.brandColor : undefined,
    carousel: Array.isArray(body.carousel)
      ? body.carousel.filter((u: unknown) => typeof u === "string")
      : undefined,
    slug: typeof body.slug === "string" ? body.slug : undefined,
  });

  if (result.error || !result.owner) {
    return NextResponse.json({ error: result.error || "Update failed." }, { status: 400 });
  }

  return NextResponse.json({ owner: toPublicOwner(result.owner) }, { status: 200 });
}