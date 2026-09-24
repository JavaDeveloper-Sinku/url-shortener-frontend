
"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Link2,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

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

      const generatedUrl = result
        .replace("Short URL: ", "")
        .trim();

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
    <main className="min-h-screen overflow-hidden bg-[#050806] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-45 top-[10%] h-105 w-105 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute -right-45 top-[35%] h-105 w-105 rounded-full bg-green-500/10 blur-[120px]" />

        <div className="absolute -bottom-50 left-[35%] h-100 w-100 rounded-full bg-emerald-400/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/6 bg-[#050806]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <Link2 className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                Tiny<span className="text-emerald-400">URL</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Link management
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-4 py-2 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-xs font-medium text-emerald-400">
              All systems operational
            </span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
          {/* Hero */}
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Simple. Fast. Powerful.
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
              Your links,
              <br />

              <span className="bg-linear-to-r from-emerald-300 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                simplified.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Transform long URLs into clean, memorable links.
              Fast, secure, and ready to share anywhere.
            </p>
          </div>

          {/* URL Shortener */}
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="group relative">
              {/* Green glow */}
              <div className="absolute -inset-1 rounded-[28px] bg-emerald-500/10 opacity-0 blur-xl transition-opacity duration-500 group-focus-within:opacity-100" />

              <div className="relative rounded-[28px] border border-white/8 bg-[#0b100d]/90 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {/* Input */}
                  <div className="relative flex-1">
                    <Link2 className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                    <input
                      type="url"
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
                      placeholder="Paste your long URL here..."
                      className="h-14 w-full rounded-2xl border border-white/[0.07] bg-[#070a08] pl-14 pr-5 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 sm:text-base"
                    />
                  </div>

                  {/* Button */}
                  <button
                    onClick={handleShorten}
                    disabled={loading}
                    className="h-14 rounded-2xl bg-emerald-500 px-7 font-semibold text-black shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        Processing
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Shorten URL
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Generated URL */}
            {shortUrl && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-400/15 bg-emerald-400/4 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Your shortened link
                      </span>
                    </div>

                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all text-base font-medium text-white transition-colors hover:text-emerald-400 sm:text-lg"
                    >
                      {shortUrl}
                    </a>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={handleCopy}
                      className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all ${
                        copied
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          : "border-white/8 bg-white/4 text-slate-300 hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-400"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>

                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 text-sm font-semibold text-slate-300 transition-all hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Secure redirects
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                Fast API
              </div>

              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" />
                Reliable infrastructure
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto mt-24 h-px max-w-5xl bg-linear-to-r from-transparent via-white/8 to-transparent" />

          {/* Features */}
          <div className="mt-20">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Built for simplicity
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need.
                <br />
                Nothing you don't.
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="Lightning fast"
                description="Generate short links through a lightweight Spring Boot backend with minimal overhead."
              />

              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Secure by design"
                description="Clean redirect handling and a backend architecture designed for reliable URL management."
              />

              <FeatureCard
                icon={<Link2 className="h-5 w-5" />}
                title="Easy to share"
                description="Create short, readable links that are easier to copy, remember, and share."
              />
            </div>
          </div>

          {/* CTA */}
          <div className="relative mt-24 overflow-hidden rounded-[30px] border border-emerald-400/10 bg-linear-to-br from-emerald-500/8 to-transparent p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <Link2 className="h-5 w-5 text-emerald-400" />
              </div>

              <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
                Make every link count.
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                Turn your long URLs into clean, professional links
                in seconds.
              </p>

              <button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="mt-7 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Shorten a link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-slate-600 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} TinyURL. Built with Spring Boot
            & Next.js.
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            API Connected
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400 transition-all duration-300 group-hover:bg-emerald-400/10">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
