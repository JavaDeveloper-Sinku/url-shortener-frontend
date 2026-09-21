"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    if (!API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured.");
      setError("API configuration is missing. Please try again later.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShortUrl("");
      setCopied(false);

      console.log("API URL:", API_URL);

      const response = await fetch(`${API_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.text();

      const generatedUrl = result.replace("Short URL: ", "").trim();

      if (!generatedUrl) {
        throw new Error("Short URL was not returned by the server.");
      }

      setShortUrl(generatedUrl);
    } catch (err) {
      console.error("Shorten URL error:", err);
      setError("Unable to shorten the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setError("Unable to copy the link.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-slate-100">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl py-12">
        {/* Header */}
        <div className="mb-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>

            Modern Link Management
          </div>

          <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Shorten your links.
          </h1>

          <p className="mx-auto max-w-md text-base text-slate-400 sm:text-lg">
            Create ultra-fast, clean, and shareable links in seconds.
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleShorten();
                  }
                }}
                className="h-14 w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-base"
              />
            </div>

            <button
              onClick={handleShorten}
              disabled={loading}
              className="h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  Processing...
                </span>
              ) : (
                "Shorten URL"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-rose-400">
              <span>⚠️</span>
              {error}
            </p>
          )}

          {/* Result Card */}
          {shortUrl && (
            <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Generated Link
              </p>

              <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 break-all text-base font-medium text-slate-100 transition-colors hover:text-indigo-300 sm:text-lg"
                >
                  {shortUrl}
                </a>

                <button
                  onClick={handleCopy}
                  className={`h-11 rounded-xl border px-6 text-sm font-medium transition-all duration-200 ${
                    copied
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                      : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {copied ? "✓ Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs uppercase tracking-wider text-slate-500">
          Fast • Secure • Reliable
        </p>
      </div>
    </main>
  );
}
