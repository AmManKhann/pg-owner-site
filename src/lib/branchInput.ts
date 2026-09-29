import type { Branch, Pricing } from "./types";

export interface BranchInput {
  name: string;
  gender: "male" | "female" | "unisex" | "";
  city: string;
  locality?: string;
  address: string;
  description?: string;
  amenities: string[];
  highlights?: string[];
  pricing: Pricing[];
  images: string[];
  videos: string[];
  lat: number | null;
  lng: number | null;
  mapsUrl?: string;
  whatsapp?: string;
  phone?: string;
}

export function parsePricingList(value: unknown): Pricing[] {
  if (!Array.isArray(value)) return [];
  const list: Pricing[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const type = String(row.type || "").trim();
    const price = Number(row.price);
    if (!type || !Number.isFinite(price) || price < 0) continue;
    const meals = typeof row.meals === "string" ? row.meals.trim() : "";
    list.push({ type, price: Math.round(price), meals: meals || undefined });
  }
  return list;
}

function cleanUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v || "").trim())
    .filter((v) => v.startsWith("/api/uploads/"));
}

function parseOptionalCoords(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function sanitizeBranchInput(body: Record<string, unknown>): BranchInput | { error: string } {
  const name = String(body.name || "").trim();
  const city = String(body.city || "").trim();
  const address = String(body.address || "").trim();

  if (!name) return { error: "Branch name is required." };
  if (!city) return { error: "City is required." };
  if (!address) return { error: "Address is required." };

  const lat = parseOptionalCoords(body.lat as unknown);
  const lng = parseOptionalCoords(body.lng as unknown);
  if (lat !== null && (lat < -90 || lat > 90)) return { error: "Latitude is out of range." };
  if (lng !== null && (lng < -180 || lng > 180)) return { error: "Longitude is out of range." };

  const gender = body.gender as Branch["gender"];
  return {
    name,
    gender: gender === "male" || gender === "female" || gender === "unisex" ? gender : "",
    city,
    locality: String(body.locality || "").trim() || undefined,
    address,
    description: String(body.description || "").trim() || undefined,
    amenities: Array.isArray(body.amenities)
      ? body.amenities.map((a) => String(a).trim()).filter(Boolean)
      : [],
    highlights: Array.isArray(body.highlights)
      ? body.highlights.map((h) => String(h).trim()).filter(Boolean)
      : undefined,
    pricing: parsePricingList(body.pricing),
    images: cleanUrls(body.images),
    videos: cleanUrls(body.videos),
    lat,
    lng,
    mapsUrl:
      typeof body.mapsUrl === "string" && body.mapsUrl.trim()
        ? body.mapsUrl.trim()
        : undefined,
    whatsapp: typeof body.whatsapp === "string" ? body.whatsapp.trim() || undefined : undefined,
    phone: typeof body.phone === "string" ? body.phone.trim() || undefined : undefined,
  };
}