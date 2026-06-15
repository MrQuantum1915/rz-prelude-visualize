import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Prelude Tree Visualiser",
  description: "Visualise for prelude tree genereted by prologue-gen plugin in  Rizin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

