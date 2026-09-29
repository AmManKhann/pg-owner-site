"use client";

import { useState } from "react";
import type { OwnerPublic } from "@/lib/types";
import MediaUpload from "./MediaUpload";

const BRAND_COLORS = [
  "#d97706",
  "#0f9d8c",
  "#ff6f61",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#dc2626",
  "#334155",
];

const HEX = /^#[0-9a-fA-F]{6}$/;

interface ProfileFormProps {
  owner: OwnerPublic;
  onSaved: (owner: OwnerPublic) => void;
}

export default function ProfileForm({ owner, onSaved }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: owner.name || "",
    slug: owner.slug || "",
    tagline: owner.tagline || "",
    website: owner.website || "",
    about: owner.about || "",
    city: owner.city || "",
    address: owner.address || "",
    email: owner.email || "",
    phone: owner.phone || "",
    whatsapp: owner.whatsapp || "",
    brandName: owner.brandName || "",
    brandColor: HEX.test(owner.brandColor || "") ? owner.brandColor || "" : "#d97706",
    carousel: owner.carousel || [],
  });
  const [logo, setLogo] = useState<string[]>(owner.logo ? [owner.logo] : []);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logo: logo[0] || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not save." });
        return;
      }
      setMessage({ type: "ok", text: "Profile saved." });
      onSaved(data.owner);
    } catch {
      setMessage({ type: "err", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof typeof form, label: string, placeholder = "", row = false, type = "text") => (
    <div className={row ? "sm:col-span-2" : ""}>
      <label className="label" htmlFor={key}>
        {label}
      </label>
      <input
        id={key}
        type={type}
        className="input"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Name / PG brand", "e.g. Sunrise PGs")}
        {field("website", "Your website link", "https://your-site.com", false, "url")}
        {field("tagline", "Tagline", "Short line shown on your page", true)}
        {field("city", "Head city", "e.g. Jaipur")}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            type="text"
            className="input"
            placeholder="Full address shown in the site footer"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Contact email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        {field("phone", "Phone", "+91 98765 43210")}
        {field("whatsapp", "WhatsApp", "+91 98765 43210")}
        {field("brandName", "Logo name", "e.g. Ex-Army")}
        <div>
          <label className="label">Logo color</label>
          <div className="flex flex-wrap items-center gap-2">
            {BRAND_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select logo color ${c}`}
                onClick={() => setForm({ ...form, brandColor: c })}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  form.brandColor === c
                    ? "scale-110 border-foreground"
                    : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-primary">
              Custom
              <input
                type="color"
                aria-label="Custom logo color"
                className="h-7 w-9 cursor-pointer border-0 bg-transparent p-0"
                value={HEX.test(form.brandColor) ? form.brandColor : "#d97706"}
                onChange={(e) => setForm({ ...form, brandColor: e.target.value.toLowerCase() })}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="label">About</label>
        <textarea
          className="input min-h-24"
          placeholder="Tell visitors about your PG — food, vibe, distance to colleges/offices…"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Profile photo / logo</label>
        <MediaUpload kind="image" value={logo} onChange={(urls) => setLogo(urls.slice(-1))} />
      </div>

      <div>
        <label className="label">Swiping images (home slider)</label>
        <p className="mb-2 text-xs text-muted">
          Photos for the rotating slider on the home page. Add, remove or reorder them as you like.
        </p>
        <MediaUpload
          kind="image"
          value={form.carousel}
          reorder
          onChange={(urls) => setForm({ ...form, carousel: urls })}
        />
        {form.carousel.length === 0 && (
          <p className="mt-2 text-xs text-muted">
            Empty — the home slider will automatically show your branch photos.
          </p>
        )}
      </div>

      {message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            message.type === "ok" ? "bg-accent-soft text-accent" : "bg-danger/10 text-danger"
          }`}
        >
          {message.text}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn btn-primary btn-md">
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}