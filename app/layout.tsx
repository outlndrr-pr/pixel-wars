import './globals.css'
import './dark-theme.css'
import './force-dark.css'
import type { Metadata } from 'next'
import { PixelWarProvider } from './contexts/PixelWarContext'
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
    <html lang="en" className="dark">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' https://pixel-wars-ab9f9.firebaseapp.com https://pixel-8k2n5fvdm-outlndrrs-projects.vercel.app" />
        <meta httpEquiv="Access-Control-Allow-Origin" content="*" />
        <meta httpEquiv="Access-Control-Allow-Methods" content="GET, POST, PUT, DELETE, OPTIONS" />
        <meta httpEquiv="Access-Control-Allow-Headers" content="Content-Type, Authorization" />
      </head>
      <body className={cn(
        "min-h-screen font-sans antialiased",
        inter.variable
      )}>
        <main className="flex-1 container mx-auto py-4 md:py-6 lg:py-8">
          <PixelWarProvider>
            {children}
          </PixelWarProvider>
        </main>
      </body>
    </html>
  )
}
