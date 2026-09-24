import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinyURL - Smart URL Shortener",
  description: "Shorten, track and optimize your links.",

  icons: {
    icon: "/icons8-link-48.png",
    shortcut: "/icons8-link-48.png",
    apple: "/icons8-link-48.png",
  },
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