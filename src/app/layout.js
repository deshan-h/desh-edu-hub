import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstaller from "@/components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DESH EduHub | නොමිලේ පසුගිය විභාග ප්‍රශ්න පත්‍ර",
  description:
    "ශ්‍රී ලංකාවේ සාමාන්‍ය පෙළ (O/L), උසස් පෙළ (A/L) සහ 5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාග පසුගිය ප්‍රශ්න පත්‍ර නොමිලේ Download කරගන්න.",
  manifest: "/manifest.webmanifest",
  applicationName: "DESH EduHub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DESH EduHub",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="si" suppressHydrationWarning className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DESH EduHub" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('desh_theme');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        {children}
        <PWAInstaller />
      </body>
    </html>
  );
}
