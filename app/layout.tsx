import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Studio",
  description: "Draft breakthrough content across topics, formats, and media.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-neutral-900">{children}</body>
    </html>
  );
}
