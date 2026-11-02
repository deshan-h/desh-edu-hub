import { Geist, Geist_Mono, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";
import ThemeInitializer from "@/components/ThemeInitializer";
import PWAInstaller from "@/components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-sinhala",
  display: "swap",
});

export const metadata = {
  title: "DESH EduHub | Educational Resources",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSinhala.variable} min-h-full flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <ThemeInitializer />
        {children}
        <PWAInstaller />
      </body>
    </html>
  );
}
