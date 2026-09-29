"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { OwnerPublic } from "@/lib/types";
import ProfileForm from "./ProfileForm";
import BranchManager from "./BranchManager";

type Tab = "profile" | "branches";

function useDashboardOwner() {
  const [owner, setOwner] = useState<OwnerPublic | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setOwner(d.owner))
      .catch(() => setError("Could not load your account."));
  }, []);
  return { owner, error, setOwner };
}

export default function Dashboard() {
  const { owner, error: ownerError, setOwner } = useDashboardOwner();
  const [tab, setTab] = useState<Tab>("branches");

  if (!owner) {
    return (
      <div className="card mx-auto max-w-2xl p-10 text-center text-sm text-muted">
        {ownerError || "Loading your dashboard…"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {owner.name}
        </h1>
        {owner.website?.trim() ? (
          <Link
            href={owner.website.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-md"
          >
            View my website ↗
          </Link>
        ) : (
          <span
            aria-disabled="true"
            title="Paste your website link in Profile first"
            className="btn btn-accent btn-md cursor-not-allowed opacity-40"
          >
            View my website
          </span>
        )}
      </div>

      <div className="mb-6 flex gap-2 border-b border-border">
        {(
          [
            ["branches", "Branches"],
            ["profile", "Profile"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === key
                ? "border-primary text-primary-dark"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "branches" ? (
        <BranchManager />
      ) : (
        <ProfileForm owner={owner} onSaved={setOwner} />
      )}
    </div>
  );
}