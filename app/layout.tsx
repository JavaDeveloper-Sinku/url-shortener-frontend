import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinyURL - Smart URL Shortener",
  description: "Shorten, track and optimize your links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}