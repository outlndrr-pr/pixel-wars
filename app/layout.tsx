import './globals.css'
import type { Metadata } from 'next'
import { PixelWarProvider } from './contexts/PixelWarContext'
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Pixel War',
  description: 'A collaborative pixel art canvas',
  keywords: ["pixel", "place", "canvas", "collaboration", "team", "game", "r/place"],
  authors: [{ name: "Pixel War Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' https://pixel-wars-ab9f9.firebaseapp.com https://pixel-8k2n5fvdm-outlndrrs-projects.vercel.app" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}>
        <PixelWarProvider>
          {children}
        </PixelWarProvider>
      </body>
    </html>
  )
}
