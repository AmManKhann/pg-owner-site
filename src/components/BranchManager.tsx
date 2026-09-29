"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import type { Branch } from "@/lib/types";
import BranchForm from "./BranchForm";

export default function BranchManager() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch("/api/branches", { signal: controller.signal })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (cancelled) return;
        if (data.branches) setBranches(data.branches);
        else setError(data.error || "Could not load branches.");
      })
      .catch((err) => {
        if (cancelled || (err && err.name === "AbortError")) return;
        setError("Could not load branches.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  async function handleDelete(branch: Branch) {
    if (!window.confirm(`Remove "${branch.name}"? Photos and videos of this branch will be deleted.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/branches/${branch.id}`, { method: "DELETE" });
      if (res.ok) {
        setBranches((prev) => prev.filter((b) => b.id !== branch.id));
      } else {
        setError("Could not delete branch.");
      }
    } catch {
      setError("Could not delete branch.");
    }
  }

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(branch: Branch) {
    setEditing(branch);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Branches</h2>
          <p className="text-sm text-muted">
            {branches.length} branch{branches.length === 1 ? "" : "es"} on your website
          </p>
        </div>
        <button onClick={startAdd} className="btn btn-primary btn-sm">
          + Add branch
        </button>
      </div>

      {!showForm && loading && (
        <div className="card p-8 text-center text-sm text-muted">Loading branches…</div>
      )}

      {!showForm && !loading && branches.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-medium">No branches yet</p>
          <p className="mt-1 text-sm text-muted">
            Add your first PG branch with photos, videos and location.
          </p>
          <button onClick={startAdd} className="btn btn-primary btn-md mt-4">
            + Add branch
          </button>
        </div>
      )}

      {!showForm && !loading && branches.length > 0 && (
        <div className="space-y-3">
          {branches.map((branch) => (
            <div key={branch.id} className="card flex items-center gap-4 p-4">
              {branch.images[0] ? (
                <img
                  src={branch.images[0]}
                  alt={branch.name}
                  className="h-16 w-16 rounded-lg border border-border object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-alt text-xl font-black text-muted">
                  {(branch.name || "?")[0].toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold">{branch.name}</h3>
                <p className="truncate text-sm text-muted">
                  {branch.city}
                  {branch.locality ? ` • ${branch.locality}` : ""} • {branch.images.length} photos •{" "}
                  {branch.videos.length} videos
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => startEdit(branch)} className="btn btn-outline btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(branch)} className="btn btn-ghost btn-sm text-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">{error}</p>
      )}

      {showForm && (
        <BranchForm
          initial={editing}
          onDone={(branch) => {
            setBranches((prev) => {
              const exists = prev.some((b) => b.id === branch.id);
              return exists ? prev.map((b) => (b.id === branch.id ? branch : b)) : [...prev, branch];
            });
            closeForm();
          }}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}