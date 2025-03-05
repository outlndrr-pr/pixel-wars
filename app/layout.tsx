import './globals.css'
import './dark-theme.css'
import './force-dark.css'
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
    <html lang="en" className={`${inter.variable} scroll-smooth bg-[#fafafa] dark:bg-[#111111]`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'self' https://pixel-wars-ab9f9.firebaseapp.com https://pixel-8k2n5fvdm-outlndrrs-projects.vercel.app" />
        <meta httpEquiv="Access-Control-Allow-Origin" content="*" />
        <meta httpEquiv="Access-Control-Allow-Methods" content="GET, POST, PUT, DELETE, OPTIONS" />
        <meta httpEquiv="Access-Control-Allow-Headers" content="Content-Type, Authorization" />
      </head>
      <body className="min-h-screen font-sans antialiased bg-[#fafafa] dark:bg-[#111111] text-gray-900 dark:text-gray-100">
        <div className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8">
          <PixelWarProvider>
            {children}
          </PixelWarProvider>
        </div>
      </body>
    </html>
  )
}
