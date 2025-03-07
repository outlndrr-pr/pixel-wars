import './globals.css';
import type { Metadata } from "next";
import { CanvasProvider } from "@/context/CanvasContext";

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
      <body className="grid-bg min-h-screen touch-manipulation">
        <CanvasProvider>
          {children}
        </CanvasProvider>
        {process.env.NODE_ENV === 'development' && <div id="debug-root" />}
      </body>
    </html>
  );
}
