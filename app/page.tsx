"use client";

import { useState } from "react";

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

    try {
      setLoading(true);
      setError("");
      setShortUrl("");
      setCopied(false);

      const response = await fetch(`${process.env.NEXT_PUBLIC}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const result = await response.text();
      setShortUrl(result.replace("Short URL: ", ""));
    } catch (err) {
      console.error(err);
      setError("Unable to shorten the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl py-12">
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Modern Link Management
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Shorten your links.
          </h1>

          <p className="mx-auto max-w-md text-base text-slate-400 sm:text-lg">
            Create ultra-fast, clean, and shareable links in seconds.
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80">
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
                  if (e.key === "Enter") {
                    handleShorten();
                  }
                }}
                className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <button
              onClick={handleShorten}
              disabled={loading}
              className="h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
            <p className="mt-4 text-sm font-medium text-rose-400 flex items-center gap-1.5">
              <span>⚠️</span> {error}
            </p>
          )}

          {/* Result Card */}
          {shortUrl && (
            <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Generated Link
              </p>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 break-all text-base sm:text-lg font-medium text-slate-100 hover:text-indigo-300 transition-colors"
                >
                  {shortUrl}
                </a>

                <button
                  onClick={handleCopy}
                  className={`h-11 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  {copied ? "✓ Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs tracking-wider uppercase text-slate-500">
          Fast • Secure • Reliable
        </p>
      </div>
    </main>
  );
}