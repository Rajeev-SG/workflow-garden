import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "Workflow Garden",
  description:
    "A calm, plain-language guide to an issue-driven AI development workflow, with curated daily coding diary entries generated from local activity.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
