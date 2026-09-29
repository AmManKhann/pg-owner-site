"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { MAX_IMAGES, MAX_VIDEOS } from "@/lib/media";

interface MediaUploadProps {
  kind: "image" | "video";
  value: string[];
  onChange: (urls: string[]) => void;
  reorder?: boolean;
}

async function removeFile(url: string) {
  const filename = url.split("/").pop();
  if (!filename) return;
  try {
    await fetch(`/api/uploads/${filename}`, { method: "DELETE" });
  } catch {
    // ignore
  }
}

export default function MediaUpload({ kind, value, onChange, reorder = false }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const max = kind === "image" ? MAX_IMAGES : MAX_VIDEOS;
  const accept = kind === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime,video/webm";

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    const roomLeft = max - value.length;
    const toUpload = Array.from(files).slice(0, roomLeft);
    if (Array.from(files).length > roomLeft) {
      setError(`You can add up to ${max}. Extra files were ignored.`);
    }
    if (toUpload.length === 0) return;

    setUploading(true);
    const added: string[] = [];
    for (const file of toUpload) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/uploads", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "Upload failed.");
          break;
        }
        if (data.url) added.push(data.url);
      } catch {
        setError("Upload failed. Check the file and try again.");
        break;
      }
    }
    setUploading(false);
    if (added.length > 0) onChange([...value, ...added]);
  }

  function handleRemove(url: string) {
    removeFile(url);
    onChange(value.filter((u) => u !== url));
  }

  function move(url: string, dir: number) {
    const i = value.indexOf(url);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= value.length) return;
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.splice(j, 0, item);
    onChange(next);
  }

  const reorderButtons = (url: string, i: number) =>
    reorder ? (
      <div className="absolute -left-2 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-0.5">
        <button
          type="button"
          aria-label="Move earlier"
          onClick={() => move(url, -1)}
          disabled={i === 0}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-[10px] font-bold text-muted shadow transition hover:text-primary disabled:opacity-30"
        >
          ▲
        </button>
        <button
          type="button"
          aria-label="Move later"
          onClick={() => move(url, 1)}
          disabled={i === value.length - 1}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-[10px] font-bold text-muted shadow transition hover:text-primary disabled:opacity-30"
        >
          ▼
        </button>
      </div>
    ) : null;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) =>
          kind === "image" ? (
            <div key={url} className="group relative">
              {reorderButtons(url, i)}
              <img
                src={url}
                alt=""
                className="h-20 w-20 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <div key={url} className="group relative w-32">
              {reorderButtons(url, i)}
              <video src={url} className="h-20 w-full rounded-lg border border-border bg-black object-cover" muted />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow"
                aria-label="Remove video"
              >
                ✕
              </button>
            </div>
          )
        )}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-xs text-muted transition hover:border-primary hover:text-primary"
          >
            {uploading ? (
              <span className="animate-pulse">Uploading…</span>
            ) : (
              <>
                <span className="text-xl leading-none">+</span>
                {kind === "image" ? "Add photo" : "Add video"}
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}