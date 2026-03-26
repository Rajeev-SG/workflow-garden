import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "Workflow Garden",
  description:
    "A plain-language guide to an issue-driven AI workflow, with real projects, short guides, and an automated diary built from meaningful repository activity.",
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
