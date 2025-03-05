import './globals.css'
import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Pixel Wars',
  description: 'A collaborative pixel art canvas game',
  keywords: ["pixel", "place", "canvas", "collaboration", "team", "game", "r/place"],
  authors: [{ name: "Pixel War Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Security headers should be configured in next.config.js instead */}
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased",
        inter.variable
      )}>
        {children}
      </body>
    </html>
  )
}
