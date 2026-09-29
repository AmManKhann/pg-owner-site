import type { ReactNode } from "react";
import {
  Wifi,
  UtensilsCrossed,
  AirVent,
  WashingMachine,
  BatteryCharging,
  Camera,
  ShowerHead,
  Car,
  BedDouble,
  BookOpen,
  Dumbbell,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type IconComponent = (props: { className?: string }) => ReactNode;

function iconFor(amenity: string): { Icon: IconComponent; tint: string } | null {
  const lower = amenity.toLowerCase();
  const teal = "text-secondary";
  const amber = "text-primary";
  const coral = "text-coral";

  if (lower.includes("wifi")) return { Icon: Wifi as unknown as IconComponent, tint: "text-secondary-light" };
  if (lower.includes("food") || lower.includes("mess") || lower.includes("meal"))
    return { Icon: UtensilsCrossed as unknown as IconComponent, tint: teal };
  if (lower.includes("ac") || lower.includes("air") || lower.includes("cool"))
    return { Icon: AirVent as unknown as IconComponent, tint: amber };
  if (lower.includes("laundry") || lower.includes("washing"))
    return { Icon: WashingMachine as unknown as IconComponent, tint: amber };
  if (lower.includes("power") || lower.includes("backup") || lower.includes("inverter"))
    return { Icon: BatteryCharging as unknown as IconComponent, tint: coral };
  if (lower.includes("cctv") || lower.includes("camera") || lower.includes("security"))
    return { Icon: Camera as unknown as IconComponent, tint: coral };
  if (lower.includes("hot water") || lower.includes("shower"))
    return { Icon: ShowerHead as unknown as IconComponent, tint: amber };
  if (lower.includes("parking")) return { Icon: Car as unknown as IconComponent, tint: teal };
  if (lower.includes("bed") || lower.includes("furnished"))
    return { Icon: BedDouble as unknown as IconComponent, tint: teal };
  if (lower.includes("study") || lower.includes("book")) return { Icon: BookOpen as unknown as IconComponent, tint: amber };
  if (lower.includes("gym")) return { Icon: Dumbbell as unknown as IconComponent, tint: coral };
  if (lower.includes("caretaker") || lower.includes("guard"))
    return { Icon: ShieldCheck as unknown as IconComponent, tint: teal };
  return { Icon: Sparkles as unknown as IconComponent, tint: amber };
}

export function AmenityChips({ items, max = 6 }: { items: string[]; max?: number }) {
  const visible = items.slice(0, max);
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((amenity) => {
        const mapped = iconFor(amenity);
        return (
          <span
            key={amenity}
            className="inline-flex items-center gap-1.5 text-xs bg-surface-alt px-2.5 py-1 rounded-md text-muted border border-border"
          >
            {mapped && mapped.Icon && <mapped.Icon className={`w-3.5 h-3.5 ${mapped.tint}`} />}
            {amenity}
          </span>
        );
      })}
      {items.length > max && (
        <span className="text-xs text-primary-light px-2 py-1 font-medium">+{items.length - max} more</span>
      )}
    </div>
  );
}

export function FacilityGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {items.map((amenity) => {
        const mapped = iconFor(amenity);
        return (
          <div
            key={amenity}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt/60 px-4 py-3"
          >
            {mapped && mapped.Icon && <mapped.Icon className={`w-5 h-5 shrink-0 ${mapped.tint}`} />}
            <span className="text-sm font-medium">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}