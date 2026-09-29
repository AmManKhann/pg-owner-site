import Link from "next/link";
import Image from "next/image";
import { MapPin, Wifi, UtensilsCrossed, IndianRupee, Film } from "lucide-react";
import type { Branch } from "@/lib/types";

const genderBadgeColors: Record<string, string> = {
  male: "bg-secondary/15 text-secondary border border-secondary/30",
  female: "bg-coral/15 text-coral border border-coral/30",
  unisex: "bg-primary/10 text-primary border border-primary/20",
};

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="w-3.5 h-3.5 text-secondary-light" />;
  if (lower.includes("food") || lower.includes("mess") || lower.includes("meal"))
    return <UtensilsCrossed className="w-3.5 h-3.5 text-secondary" />;
  return null;
}

interface OwnerBranchCardProps {
  ownerSlug: string;
  branch: Branch;
}

export default function OwnerBranchCard({ ownerSlug, branch }: OwnerBranchCardProps) {
  const prices = branch.pricing.map((p) => p.price).filter((n) => Number.isFinite(n) && n > 0);
  const priceMin = prices.length ? Math.min(...prices) : null;
  const priceMax = prices.length ? Math.max(...prices) : null;

  return (
    <Link href={`/o/${ownerSlug}/${branch.id}`} className="block">
      <div className="bg-surface rounded-xl border border-border overflow-hidden card-hover group">
        <div className="relative h-56 md:h-52 bg-surface overflow-hidden">
          {branch.images[0] ? (
            <Image
              src={branch.images[0]}
              alt={branch.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-bold text-primary/20 animate-float">
                {(branch.name || "P").charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              genderBadgeColors[branch.gender] ?? genderBadgeColors.unisex
            }`}
          >
            {branch.gender === "male" ? "Boys" : branch.gender === "female" ? "Girls" : "Co-ed"}
          </span>
          <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded">
            {branch.images.length} photos
          </span>
          {branch.videos.length > 0 && (
            <span className="absolute bottom-3 right-3 text-xs font-medium text-white/90 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1">
              <Film className="w-3 h-3" />
              {branch.videos.length} video{branch.videos.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1 group-hover:text-primary-light transition-colors">
                {branch.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">
                {[branch.locality, branch.city].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-xs text-muted">
              {branch.pricing.length > 0
                ? `${branch.pricing.length} sharing option${branch.pricing.length !== 1 ? "s" : ""}`
                : "Book directly"}
            </span>
            <span className="text-xs text-muted ml-auto">
              {branch.amenities.length} facilit{branch.amenities.length === 1 ? "y" : "ies"}
            </span>
          </div>

          {branch.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {branch.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 text-xs bg-surface-alt px-2 py-1 rounded-md text-muted border border-border"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
              {branch.amenities.length > 4 && (
                <span className="text-xs text-primary-light px-2 py-1 font-medium">
                  +{branch.amenities.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-secondary" />
              {priceMin !== null ? (
                <>
                  <span className="font-bold text-lg text-foreground">{priceMin.toLocaleString("en-IN")}</span>
                  {priceMax !== null && priceMax > priceMin && (
                    <span className="text-sm text-muted"> - {priceMax.toLocaleString("en-IN")}/mo</span>
                  )}
                  {priceMax === priceMin && <span className="text-sm text-muted">/mo</span>}
                </>
              ) : (
                <span className="text-sm text-muted">Ask owner</span>
              )}
            </div>
            <span className="text-sm font-medium text-primary-light group-hover:text-primary-light transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}