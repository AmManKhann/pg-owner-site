import type { Branch } from "./types";
import { parseMapsCoords } from "./mapscoords";

function locationQuery(branch: Branch): string {
  if (typeof branch.lat === "number" && typeof branch.lng === "number") {
    return `${branch.lat},${branch.lng}`;
  }
  return [branch.address, branch.locality, branch.city].filter(Boolean).join(", ");
}

function resolvedCoords(branch: Branch): { lat: number; lng: number } | null {
  const fromUrl = parseMapsCoords(branch.mapsUrl ?? "");
  if (fromUrl) return fromUrl;
  if (typeof branch.lat === "number" && typeof branch.lng === "number") {
    return { lat: branch.lat, lng: branch.lng };
  }
  return null;
}

export function directionsUrl(branch: Branch): string {
  const coords = resolvedCoords(branch);
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
  }
  if (branch.mapsUrl && /^https?:\/\//i.test(branch.mapsUrl)) return branch.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery(branch))}`;
}

// Google Maps embed with satellite tiles (`t=k`) — the same "3D" look pgnearme uses.
export function threeDMapSrc(branch: Branch): string {
  const coords = resolvedCoords(branch);
  if (coords) {
    return `https://maps.google.com/maps?q=${coords.lat}%2C${coords.lng}&t=k&z=18&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery(branch))}&t=k&z=16&output=embed`;
}

export function formatINR(amount: number): string {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

export function branchShortAddress(branch: Branch): string {
  return [branch.address, branch.locality, branch.city].filter(Boolean).join(", ");
}

export function whatsappLink(phone: string | undefined, text: string): string | null {
  if (!phone) return null;
  const clean = phone.replace(/[^\d]/g, "").replace(/^91/, "");
  const full = String(clean).startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}