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

      {/* 3. Compact Slim Footer (Exact Height Match with Navbar) */}
      <footer className="bg-white/65 dark:bg-slate-950/65 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          {/* Left: Brand copyright & quick links */}
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              © {new Date().getFullYear()} DESH EduHub
            </span>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                මුල් පිටුව
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Staff Access
              </Link>
            </div>
          </div>

          {/* Right: Developed By Pill (Image 2 Style) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
              Developed By
            </span>
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
