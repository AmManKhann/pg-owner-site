"use client";

import { useState } from "react";

export default function ShareButtons({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(`Check out this PG website — ${url}`)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copy} className="btn btn-outline btn-md">
        {copied ? "✓ Copied!" : "🔗 Copy link"}
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md">
        💬 Share on WhatsApp
      </a>
    </div>
  );
}