import './globals.css';
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { CanvasProvider } from "@/context/CanvasContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pixel Wars - Collaborative Pixel Art',
  description: 'Join the battle and place pixels to create collaborative art with friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {/* Force client side rendering for consistency */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Set theme based on system preference
                const theme = localStorage.getItem('pixelWarsTheme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {
                console.error('Failed to initialize theme:', e);
              }
            `,
          }}
        />
        <CanvasProvider>
          {children}
        </CanvasProvider>
        {process.env.NODE_ENV === 'development' && <div id="debug-root" />}
      </body>
    </html>
  );
}
