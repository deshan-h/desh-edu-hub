import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import PapersGallery from "@/components/PapersGallery";

export const dynamic = "force-dynamic";

async function getPapers() {
  try {
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching papers:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Failed to fetch papers:", err);
    return [];
  }
}

export default async function HomePage() {
  const papers = await getPapers();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Navbar with Brand, User Display & DarkMode Switch */}
      <Navbar />

      {/* 2. Main Area: Search Bar & Gallery */}
      <main className="flex-1">
        <PapersGallery initialPapers={papers} />
      </main>

      {/* 3. Modern Footer with Socials & DESH Digital Hub CTA */}
      <footer className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 py-6 sm:py-5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
          
          {/* Left: Brand copyright & quick links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              © {new Date().getFullYear()} DESH EduHub
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                මුල් පිටුව
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                Staff Access
              </Link>
            </div>
          </div>

          {/* Center: DESH Digital Hub CTA Button */}
          <div className="flex items-center justify-center">
            <a
              href="https://desh.s.gy/desh-digital-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-indigo-500/20 hover:scale-102 transition-all duration-200 cursor-pointer"
              title="ඩිජිටල් සේවාවන් ලබාගැනීමට DESH Digital Hub වෙත පිවිසෙන්න"
            >
              <span className="text-sm">⚡</span>
              <span>ඩිජිටල් සේවාවන් ලබාගන්න (DESH Digital Hub)</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
            </a>
          </div>

          {/* Right: Social Media Icons + Developed By Pill */}
          <div className="flex items-center justify-center md:justify-end gap-3.5 sm:gap-4 shrink-0">
            {/* Social Icons (WhatsApp, Facebook, YouTube) */}
            <div className="flex items-center gap-1.5">
              {/* WhatsApp */}
              <a
                href="https://desh.s.gy/whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all shadow-2xs hover:scale-105"
                title="WhatsApp හරහා සම්බන්ධ වන්න"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://desh.s.gy/facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/80 transition-all shadow-2xs hover:scale-105"
                title="Facebook පිටුවට පිවිසෙන්න"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://desh.s.gy/youtube"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/50 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800/80 transition-all shadow-2xs hover:scale-105"
                title="YouTube නාලිකාව නරඹන්න"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Developed By Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-slate-700 transition">
              <Image
                src="/desh-logo.png"
                alt="DESH Shield Logo"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              />
              <span className="font-black text-xs sm:text-sm tracking-wider text-slate-900 dark:text-white">
                DESH
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
