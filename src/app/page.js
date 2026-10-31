import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-lg shadow-sm">
              D
            </span>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                DESH <span className="text-blue-600">Papers Hub</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Free Educational Past Papers
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="#papers-section"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hidden sm:inline-block"
            >
              Browse Papers
            </a>
            <Link
              href="/admin"
              className="text-xs font-semibold px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 pt-16 pb-8 border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-4">
              ✨ 100% Free Past Paper Resource Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Master Your Exams with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DESH Past Papers Hub
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Download high-quality G.C.E. O/L, A/L, Grade 5 Scholarship, Provincial, and Model exam past papers with marking schemes in high-speed PDF format.
            </p>

            {/* Quick stats pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
                <span>📚</span> <strong>{papers.length}</strong> Papers Available
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
                <span>⚡</span> High Speed R2 Cloud Storage
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs">
                <span>🎯</span> O/L, A/L & Grade 5
              </div>
            </div>
          </div>
        </div>

        {/* Papers Gallery with Filters & Modal */}
        <PapersGallery initialPapers={papers} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DESH Papers Hub. Empowering students everywhere.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin Upload
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
