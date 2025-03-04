import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pixel War - Team-based Pixel Placing Canvas",
  description: "A collaborative pixel canvas where teams compete for territory by placing colored pixels, inspired by Reddit's r/Place.",
  keywords: ["pixel", "place", "canvas", "collaboration", "team", "game", "r/place"],
  authors: [{ name: "Pixel War Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
