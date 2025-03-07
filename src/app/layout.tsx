import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CanvasProvider } from "@/context/CanvasContext";
import { Analytics } from '@vercel/analytics/react';
import AuthProvider from '@/context/AuthProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixel Wars",
  description: "Place pixels and create art together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} grid-bg min-h-screen touch-manipulation`}>
        <AuthProvider>
          <CanvasProvider>
            {children}
            <Analytics />
          </CanvasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
