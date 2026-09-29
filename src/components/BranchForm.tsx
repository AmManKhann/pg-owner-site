"use client";

import { useState } from "react";
import type { Branch } from "@/lib/types";
import MediaUpload from "./MediaUpload";

const AMENITY_PRESETS = [
  "WiFi",
  "Food (3 meals)",
  "Food (2 meals)",
  "AC Rooms",
  "Laundry",
  "Power Backup",
  "CCTV",
  "Hot Water",
  "Housekeeping",
  "Gym",
  "Parking",
  "Room Service",
];

interface PricingRow {
  type: string;
  price: string;
  meals: string;
}

interface BranchFormProps {
  initial?: Branch | null;
  onDone: (branch: Branch) => void;
  onCancel: () => void;
}

const emptyPricing = (): PricingRow => ({ type: "", price: "", meals: "" });

export default function BranchForm({ initial, onDone, onCancel }: BranchFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    gender: initial?.gender || "",
    city: initial?.city || "",
    locality: initial?.locality || "",
    address: initial?.address || "",
    lat: initial?.lat != null ? String(initial.lat) : "",
    lng: initial?.lng != null ? String(initial.lng) : "",
    mapsUrl: initial?.mapsUrl || "",
    description: initial?.description || "",
  });
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities || []);
  const [amenityInput, setAmenityInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>(initial?.highlights || []);
  const [highlightInput, setHighlightInput] = useState("");
  const [pricing, setPricing] = useState<PricingRow[]>(
    initial && initial.pricing.length > 0
      ? initial.pricing.map((p) => ({ type: p.type, price: String(p.price), meals: p.meals || "" }))
      : [emptyPricing()]
  );
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [videos, setVideos] = useState<string[]>(initial?.videos || []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function addCustomAmenity() {
    const v = amenityInput.trim();
    if (!v) return;
    if (!amenities.includes(v)) setAmenities((prev) => [...prev, v]);
    setAmenityInput("");
  }

  function addHighlight() {
    const v = highlightInput.trim();
    if (!v) return;
    if (!highlights.includes(v)) setHighlights((prev) => [...prev, v]);
    setHighlightInput("");
  }

  function updatePricing(idx: number, field: keyof PricingRow, value: string) {
    setPricing((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
        amenities,
        highlights,
        pricing: pricing
          .filter((p) => p.type.trim() && p.price !== "")
          .map((p) => ({
            type: p.type.trim(),
            price: Number(p.price),
            meals: p.meals.trim() || undefined,
          })),
        images,
        videos,
      };
      const res = await fetch(initial ? `/api/branches/${initial.id}` : "/api/branches", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save branch.");
        return;
      }
      onDone(data.branch);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{initial ? "Edit branch" : "Add new branch"}</h3>
        <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
          Cancel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="bname">
            Branch name *
          </label>
          <input
            id="bname"
            className="input"
            placeholder="e.g. Sunrise PG - Malviya Nagar"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="bgender">
            Type
          </label>
          <select
            id="bgender"
            className="input"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select…</option>
            <option value="male">Boys PG</option>
            <option value="female">Girls PG</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="bcity">
            City *
          </label>
          <input
            id="bcity"
            className="input"
            placeholder="e.g. Jaipur"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="blocality">
            Area / Locality
          </label>
          <input
            id="blocality"
            className="input"
            placeholder="e.g. Jhotwara"
            value={form.locality}
            onChange={(e) => setForm({ ...form, locality: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="baddress">
          Full address *
        </label>
        <textarea
          id="baddress"
          className="input min-h-20"
          placeholder="House no, street, landmark, city, pincode"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
      </div>

      <div className="rounded-xl border border-border bg-surface-alt/50 p-4">
        <p className="mb-3 text-sm font-semibold">Location & directions</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="blat">
              Latitude
            </label>
            <input
              id="blat"
              type="number"
              step="any"
              className="input"
              placeholder="e.g. 24.5749"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="blng">
              Longitude
            </label>
            <input
              id="blng"
              type="number"
              step="any"
              className="input"
              placeholder="e.g. 73.7127"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="bmaps">
              Custom Google Maps link (optional)
            </label>
            <input
              id="bmaps"
              type="url"
              className="input"
              placeholder="Paste a maps.app.goo.gl link or use lat/lng"
              value={form.mapsUrl}
              onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">
          Add latitude & longitude, or a custom map link, so the <b>Get Directions</b> button opens
          Google Maps navigation straight to this branch. Tip: right-click any spot on Google Maps to
          copy its coordinates.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="bdesc">
          Description
        </label>
        <textarea
          id="bdesc"
          className="input min-h-20"
          placeholder="Rooms, food, beds available, nearby colleges / offices…"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_PRESETS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`btn btn-sm ${amenities.includes(a) ? "btn-primary" : "btn-outline"}`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="input max-w-xs"
            placeholder="Add custom amenity"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
          />
          <button type="button" onClick={addCustomAmenity} className="btn btn-outline btn-sm">
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="label">Highlights (shown below photos)</label>
        <div className="flex gap-2">
          <input
            className="input max-w-sm"
            placeholder="e.g. Study-friendly environment"
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHighlight();
              }
            }}
          />
          <button type="button" onClick={addHighlight} className="btn btn-outline btn-sm">
            Add
          </button>
        </div>
        {highlights.length > 0 && (
          <ul className="mt-3 space-y-2">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-surface-alt/60 px-3 py-2">
                <span className="text-sm">{h}</span>
                <button
                  type="button"
                  onClick={() => setHighlights((prev) => prev.filter((_, idx) => idx !== i))}
                  className="btn btn-ghost btn-sm text-danger"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Pricing / sharing</label>
          <button
            type="button"
            onClick={() => setPricing((prev) => [...prev, emptyPricing()])}
            className="btn btn-outline btn-sm"
          >
            + Add row
          </button>
        </div>
        <div className="space-y-2">
          {pricing.map((row, idx) => (
            <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_120px_1fr_auto]">
              <input
                className="input"
                placeholder="Type (e.g. Triple sharing)"
                value={row.type}
                onChange={(e) => updatePricing(idx, "type", e.target.value)}
              />
              <input
                className="input"
                type="number"
                placeholder="₹ price"
                value={row.price}
                onChange={(e) => updatePricing(idx, "price", e.target.value)}
              />
              <input
                className="input"
                placeholder="Meals (e.g. 3 meals)"
                value={row.meals}
                onChange={(e) => updatePricing(idx, "meals", e.target.value)}
              />
              {pricing.length > 1 && (
                <button
                  type="button"
                  onClick={() => setPricing((prev) => prev.filter((_, i) => i !== idx))}
                  className="btn btn-ghost btn-sm text-danger"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Photos ({images.length})</label>
        <MediaUpload kind="image" value={images} onChange={setImages} />
      </div>

      <div>
        <label className="label">Videos ({videos.length})</label>
        <MediaUpload kind="video" value={videos} onChange={setVideos} />
      </div>

      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn btn-primary btn-md">
          {saving ? "Saving…" : initial ? "Save changes" : "Add branch"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-outline btn-md">
          Cancel
        </button>
      </div>
    </form>
  );
}