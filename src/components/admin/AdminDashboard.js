"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const CATEGORIES = ["O/L", "A/L", "Grade 5", "Provincial", "Model"];

const PROVINCES = [
  { name: "Western Province", sinhala: "බස්නාහිර පළාත" },
  { name: "Central Province", sinhala: "මධ්‍යම පළාත" },
  { name: "Southern Province", sinhala: "දකුණු පළාත" },
  { name: "North Western Province", sinhala: "වයඹ පළාත" },
  { name: "Sabaragamuwa Province", sinhala: "සබරගමුව පළාත" },
  { name: "Eastern Province", sinhala: "නැගෙනහිර පළාත" },
  { name: "Uva Province", sinhala: "ඌව පළාත" },
  { name: "Northern Province", sinhala: "උතුරු පළාත" },
  { name: "North Central Province", sinhala: "උතුරු මැද පළාත" },
];

export default function AdminDashboard({ initialPapers = [], initialUsers = [] }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "add-paper"
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sub-tab state for Add Papers
  const [paperSubTab, setPaperSubTab] = useState("passpaper"); // "passpaper" | "model" | "province"

  // Sub-tab specific configuration states
  const [passpaperLevel, setPasspaperLevel] = useState("O/L");
  const [modelLevel, setModelLevel] = useState("A/L");
  const [province, setProvince] = useState("Western Province");
  const [provinceTerm, setProvinceTerm] = useState("3rd Term Test");
  const [provinceGrade, setProvinceGrade] = useState("Grade 11 (O/L)");
  const [medium, setMedium] = useState("Sinhala Medium");
  const [hasAnswers, setHasAnswers] = useState(false);

  // Data State
  const [papers, setPapers] = useState(initialPapers);
  const [users] = useState(initialUsers);

  // Filter / Search for Papers Table
  const [tableSearch, setTableSearch] = useState("");
  const [tableCategory, setTableCategory] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  // Edit Modal State
  const [editingPaper, setEditingPaper] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "O/L",
    subject: "",
    year: "",
    has_answers: false,
  });
  const [updatingPaper, setUpdatingPaper] = useState(false);
  const [editError, setEditError] = useState("");

  const handleOpenEdit = (paper) => {
    setEditingPaper(paper);
    setEditError("");
    const isAnswers =
      paper.has_answers === true ||
      paper.has_answers === "true" ||
      paper.title?.toLowerCase().includes("with answers") ||
      paper.title?.includes("පිළිතුරු");

    setEditFormData({
      title: paper.title || "",
      category: paper.category || "O/L",
      subject: paper.subject || "",
      year: paper.year?.toString() || "",
      has_answers: isAnswers,
    });
  };

  const handleCloseEdit = () => {
    setEditingPaper(null);
    setEditError("");
    setUpdatingPaper(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) {
      setEditError("Paper title cannot be empty.");
      return;
    }
    if (!editFormData.subject.trim()) {
      setEditError("Subject cannot be empty.");
      return;
    }
    if (!editFormData.year || isNaN(editFormData.year)) {
      setEditError("Please enter a valid year.");
      return;
    }

    setUpdatingPaper(true);
    setEditError("");

    try {
      const res = await fetch("/api/papers/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPaper.id,
          title: editFormData.title.trim(),
          category: editFormData.category,
          subject: editFormData.subject.trim(),
          year: editFormData.year,
          has_answers: editFormData.has_answers,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update paper.");
      }

      const updated = result.data;
      setPapers((prev) =>
        prev.map((p) => (p.id === editingPaper.id ? { ...p, ...updated } : p))
      );
      handleCloseEdit();
    } catch (err) {
      setEditError(err.message || "Failed to save changes.");
    } finally {
      setUpdatingPaper(false);
    }
  };

  // Upload Form State
  const [formData, setFormData] = useState({
    subject: "",
    year: new Date().getFullYear().toString(),
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: null, message: "", data: null });
  const fileInputRef = useRef(null);

  // Metrics
  const totalDownloads = useMemo(() => {
    return papers.reduce((sum, p) => sum + (Number(p.download_count) || 0), 0);
  }, [papers]);

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchesCategory =
        tableCategory === "All" ||
        p.category?.toLowerCase() === tableCategory.toLowerCase();
      const q = tableSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.subject?.toLowerCase().includes(q) ||
        p.year?.toString().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [papers, tableCategory, tableSearch]);

  // Logout handler
  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out of the Admin Portal?")) {
      try {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.reload();
      } catch (err) {
        console.error(err);
        window.location.reload();
      }
    }
  };

  // Delete Paper handler
  const handleDeletePaper = async (paper) => {
    if (!confirm(`Are you sure you want to permanently delete:\n"${paper.title}"?`)) {
      return;
    }

    setDeletingId(paper.id);
    try {
      const res = await fetch("/api/papers/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paper.id, fileUrl: paper.file_url }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete paper.");
      }

      setPapers((prev) => prev.filter((p) => p.id !== paper.id));
    } catch (err) {
      alert(`Error deleting paper: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Upload Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "application/pdf" &&
        !selectedFile.name.toLowerCase().endsWith(".pdf")
      ) {
        setUploadStatus({
          type: "error",
          message: "Please choose a valid PDF file.",
          data: null,
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      setUploadStatus({ type: null, message: "", data: null });
    }
  };

  // Determine effective category based on active sub-tab
  const getComputedCategory = () => {
    if (paperSubTab === "passpaper") return passpaperLevel;
    if (paperSubTab === "model") return "Model";
    if (paperSubTab === "province") return "Provincial";
    return "O/L";
  };

  // Helper to auto-generate title behind the scenes
  const generatePaperTitle = () => {
    const subj = formData.subject.trim() || "Subject";
    const yr = formData.year?.toString().trim() || new Date().getFullYear().toString();
    const ansTag = hasAnswers ? " (With Answers)" : "";

    if (paperSubTab === "passpaper") {
      const levelLabel =
        passpaperLevel === "O/L"
          ? "G.C.E. O/L"
          : passpaperLevel === "A/L"
          ? "G.C.E. A/L"
          : "Grade 5 Scholarship";
      return `${yr} ${levelLabel} ${subj} Past Paper (${medium})${ansTag}`;
    } else if (paperSubTab === "model") {
      const levelLabel =
        modelLevel === "General"
          ? ""
          : modelLevel === "Grade 5"
          ? "Grade 5"
          : `G.C.E. ${modelLevel}`;
      return `${yr} ${levelLabel ? levelLabel + " " : ""}${subj} Model Paper (${medium})${ansTag}`;
    } else if (paperSubTab === "province") {
      return `${yr} ${province} ${provinceGrade} ${subj} ${provinceTerm} (${medium})${ansTag}`;
    }
    return `${yr} ${subj} Past Paper${ansTag}`;
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      setUploadStatus({ type: "error", message: "Please enter a subject." });
      return;
    }
    if (!formData.year || isNaN(formData.year)) {
      setUploadStatus({ type: "error", message: "Please enter a valid year." });
      return;
    }
    if (!file) {
      setUploadStatus({ type: "error", message: "Please select a PDF document to upload." });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: "", data: null });

    const finalCategory = getComputedCategory();
    const finalTitle = generatePaperTitle();

    try {
      const data = new FormData();
      data.append("title", finalTitle);
      data.append("category", finalCategory);
      data.append("subject", formData.subject.trim());
      data.append("year", formData.year);
      data.append("has_answers", hasAnswers.toString());
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to upload the paper.");
      }

      setUploadStatus({
        type: "success",
        message: result.message || "Paper uploaded successfully!",
        data: result.data,
      });

      // Add to papers state so it reflects immediately in Dashboard
      if (result.data) {
        setPapers((prev) => [result.data, ...prev]);
      }

      // Reset form
      setFormData({
        subject: "",
        year: new Date().getFullYear().toString(),
      });
      setHasAnswers(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setUploadStatus({
        type: "error",
        message: err.message || "An unexpected error occurred. Please try again.",
        data: null,
      });
    } finally {
      setUploading(false);
    }
  };

  // Reusable With Answers Toggle Component for all 3 forms
  const renderWithAnswersToggle = () => (
    <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all shrink-0 ${
            hasAnswers
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
              : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          }`}
        >
          ✓
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              With Answers / Marking Scheme (පිළිතුරු සහිතයි)
            </span>
            {hasAnswers && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 animate-pulse">
                Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {hasAnswers
              ? "මෙම ප්‍රශ්න පත්‍රයේ පිළිතුරු ඇතුළත් කර ඇත (With Answers Badge එක Card එකේ දිස්වේ)"
              : "ප්‍රශ්න පත්‍රය පමණි (Answers නැත)"}
          </p>
        </div>
      </div>

      {/* Clickable Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={hasAnswers}
        onClick={() => setHasAnswers(!hasAnswers)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
          hasAnswers ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            hasAnswers ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0">
                <Image
                  src="/desh-eduhub-logo.png"
                  alt="DESH EduHub Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <p className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                  DESH EduHub Admin
                </p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  Management Hub
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Side Tabs */}
          <div className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Main Menu
            </p>

            {/* Tab 1: Dashboard */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span>Dashboard</span>
              </div>
            </button>

            {/* Tab 2: Past Papers Repository */}
            <button
              onClick={() => {
                setActiveTab("repository");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "repository"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Repository</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "repository"
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {papers.length}
              </span>
            </button>

            {/* Tab 3: Add Papers */}
            <button
              onClick={() => {
                setActiveTab("add-paper");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "add-paper"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Papers</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  activeTab === "add-paper"
                    ? "bg-white/20 text-white"
                    : "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                }`}
              >
                New
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Appearance
            </span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span>←</span>
            <span>View Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar - Dashboard & Repository */}
        {(activeTab === "dashboard" || activeTab === "repository") && (
          <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* Hamburger on mobile */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Open Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white capitalize">
                  {activeTab === "dashboard" ? "Dashboard Overview" : "Past Papers Repository"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTab === "dashboard"
                    ? "Monitor platform metrics, downloads, and student registrations."
                    : `Manage, search, edit details, and inspect all ${papers.length} past papers.`}
                </p>
              </div>
            </div>

            {/* Quick tab switcher on top right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === "add-paper" ? "dashboard" : "add-paper")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900/60 transition cursor-pointer"
              >
                <span>➕ Add Paper</span>
              </button>
            </div>
          </header>
        )}

        {/* Tab 1: DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <main className="p-4 sm:p-8 space-y-8 max-w-7xl">
            {/* Analytics Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Papers */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Papers
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {papers.length}
                  </p>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    Active in Catalog
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
                  📚
                </div>
              </div>

              {/* Card 2: Total Downloads */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Downloads
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {totalDownloads}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Recorded downloads
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl">
                  📥
                </div>
              </div>

              {/* Card 3: Registered Students */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Registered Students
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {users.length}
                  </p>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    WhatsApp Soft-Login
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">
                  👥
                </div>
              </div>

              {/* Card 4: Cloud Storage */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    R2 Cloud Storage
                  </p>
                  <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    Connected
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    CDN Online
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xl">
                  ⚡
                </div>
              </div>
            </div>

            {/* Quick Repository Overview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Recent Papers in Catalog
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing recently added papers. Click below to open the dedicated repository tab.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("repository")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer self-start sm:self-auto"
                >
                  <span>Open Full Repository ({papers.length})</span>
                  <span>→</span>
                </button>
              </div>

              {papers.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {papers.slice(0, 5).map((paper) => (
                    <div
                      key={paper.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
                          {paper.category}
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {paper.title}
                        </p>
                        {(paper.has_answers === true ||
                          paper.title?.toLowerCase().includes("with answers") ||
                          paper.title?.includes("පිළිතුරු")) && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                            Answers ✓
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-xs">
                        <span className="text-slate-400 text-[11px] mr-2">
                          📥 {paper.download_count || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(paper)}
                          className="px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900/60 rounded-lg transition cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <a
                          href={paper.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition"
                        >
                          PDF ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No papers uploaded yet.</p>
              )}
            </div>

            {/* Students List Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Registered Students ({users.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Students who registered their WhatsApp number to unlock downloads.
                  </p>
                </div>
              </div>

              {users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {users.slice(0, 9).map((u) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0">
                        {u.name ? u.name.charAt(0) : "S"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {u.whatsapp_number || u.whatsapp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No students registered yet.
                </p>
              )}
            </div>
          </main>
        )}

        {/* Tab 2: REPOSITORY VIEW (Dedicated Tab) */}
        {activeTab === "repository" && (
          <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
            {/* Papers Repository Full Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Past Papers Repository</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900">
                      {filteredPapers.length} of {papers.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Search, inspect, edit details, or delete papers in the active catalog.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search inside table */}
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search papers..."
                    className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Filter by Category */}
                  <select
                    value={tableCategory}
                    onChange={(e) => setTableCategory(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setActiveTab("add-paper")}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <span>➕ Add New</span>
                  </button>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-5">Paper Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Year</th>
                      <th className="py-3 px-4 text-center">Downloads</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPapers.length > 0 ? (
                      filteredPapers.map((paper) => (
                        <tr
                          key={paper.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white max-w-xs">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <span className="truncate">{paper.title}</span>
                              {(paper.has_answers === true ||
                                paper.title?.toLowerCase().includes("with answers") ||
                                paper.title?.includes("පිළිතුරු")) && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                                  Answers ✓
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                              {paper.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium">{paper.subject}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                            {paper.year}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                            {paper.download_count || 0}
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-2 whitespace-nowrap">
                            <a
                              href={paper.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition"
                            >
                              Open PDF ↗
                            </a>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(paper)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900/60 rounded-lg transition cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePaper(paper)}
                              disabled={deletingId === paper.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === paper.id ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500">
                          No papers found matching the search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* Tab 3: ADD PAPERS VIEW */}
        {activeTab === "add-paper" && (
          <main className="p-4 sm:p-8 max-w-5xl">
            {/* Page Title & Breadcrumbs - Exact match to screenshot */}
            <div className="flex items-center gap-3 mb-4">
              {/* Mobile hamburger button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs cursor-pointer"
                aria-label="Open Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Add Paper
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                <span>›</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  {paperSubTab === "passpaper"
                    ? "Passpaper"
                    : paperSubTab === "model"
                    ? "Model Paper"
                    : "Province Paper"}
                </span>
                <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">
                  ?
                </span>
              </div>
            </div>

            {/* Horizontal Underline Tabs Bar - Exact match to screenshot */}
            <div className="flex items-center gap-6 sm:gap-10 border-b border-slate-200 dark:border-slate-800 mb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setPaperSubTab("passpaper")}
                className={`pb-3 text-sm tracking-tight whitespace-nowrap transition-all cursor-pointer relative ${
                  paperSubTab === "passpaper"
                    ? "text-[#1e255e] dark:text-blue-400 font-bold"
                    : "text-[#556987] hover:text-[#1e255e] dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <span>Passpaper</span>
                {paperSubTab === "passpaper" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#1e255e] dark:bg-blue-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaperSubTab("model")}
                className={`pb-3 text-sm tracking-tight whitespace-nowrap transition-all cursor-pointer relative ${
                  paperSubTab === "model"
                    ? "text-[#1e255e] dark:text-blue-400 font-bold"
                    : "text-[#556987] hover:text-[#1e255e] dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <span>Model Paper</span>
                {paperSubTab === "model" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#1e255e] dark:bg-blue-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaperSubTab("province")}
                className={`pb-3 text-sm tracking-tight whitespace-nowrap transition-all cursor-pointer relative ${
                  paperSubTab === "province"
                    ? "text-[#1e255e] dark:text-blue-400 font-bold"
                    : "text-[#556987] hover:text-[#1e255e] dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                }`}
              >
                <span>Province Paper</span>
                {paperSubTab === "province" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#1e255e] dark:bg-blue-400" />
                )}
              </button>
            </div>

            {/* Feedback Alerts */}
            {uploadStatus.type === "error" && (
              <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-4 flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1 text-sm text-red-800 dark:text-red-300 font-medium">
                  {uploadStatus.message}
                </div>
                <button
                  type="button"
                  onClick={() => setUploadStatus({ type: null, message: "", data: null })}
                  className="text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {uploadStatus.type === "success" && (
              <div className="mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      {uploadStatus.message}
                    </p>
                    {uploadStatus.data?.file_url && (
                      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 break-all">
                        Public URL:{" "}
                        <a
                          href={uploadStatus.data.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold hover:text-emerald-900 dark:hover:text-emerald-200"
                        >
                          {uploadStatus.data.file_url}
                        </a>
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab("dashboard")}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      View in Dashboard →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadStatus({ type: null, message: "", data: null })}
                    className="text-emerald-500 hover:text-emerald-700 text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Upload Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 transition-colors duration-300">
              <form onSubmit={handleUploadSubmit} className="space-y-8">
                {/* SECTION 1: Academic & Examination Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {paperSubTab === "passpaper"
                      ? "Past Exam Details"
                      : paperSubTab === "model"
                      ? "Model Paper Details"
                      : "Provincial Evaluation Details"}
                  </h3>

                  {/* Sub-Tab 1: Passpaper Fields */}
                  {paperSubTab === "passpaper" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Exam Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={passpaperLevel}
                          onChange={(e) => setPasspaperLevel(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="O/L">සාමාන්‍ය පෙළ (G.C.E. O/L)</option>
                          <option value="A/L">උසස් පෙළ (G.C.E. A/L)</option>
                          <option value="Grade 5">5 ශ්‍රේණිය ශිෂ්‍යත්වය (Grade 5)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Medium
                        </label>
                        <select
                          value={medium}
                          onChange={(e) => setMedium(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Sinhala Medium">Sinhala Medium (සිංහල මාධ්‍ය)</option>
                          <option value="English Medium">English Medium (ඉංග්‍රීසි මාධ්‍ය)</option>
                          <option value="Tamil Medium">Tamil Medium (දෙමළ මාධ්‍ය)</option>
                        </select>
                      </div>

                      {/* With Answers Toggle inside Passpaper Form */}
                      <div className="md:col-span-2 pt-1">
                        {renderWithAnswersToggle()}
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 2: Model Paper Fields */}
                  {paperSubTab === "model" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Target Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={modelLevel}
                          onChange={(e) => setModelLevel(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="A/L">උසස් පෙළ (G.C.E. A/L)</option>
                          <option value="O/L">සාමාන්‍ය පෙළ (G.C.E. O/L)</option>
                          <option value="Grade 5">5 ශ්‍රේණිය (Grade 5)</option>
                          <option value="General">General / All Grades</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Medium
                        </label>
                        <select
                          value={medium}
                          onChange={(e) => setMedium(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Sinhala Medium">Sinhala Medium (සිංහල මාධ්‍ය)</option>
                          <option value="English Medium">English Medium (ඉංග්‍රීසි මාධ්‍ය)</option>
                          <option value="Tamil Medium">Tamil Medium (දෙමළ මාධ්‍ය)</option>
                        </select>
                      </div>

                      {/* With Answers Toggle inside Model Paper Form */}
                      <div className="md:col-span-2 pt-1">
                        {renderWithAnswersToggle()}
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 3: Province Paper Fields */}
                  {paperSubTab === "province" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Province (පළාත) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          {PROVINCES.map((prov) => (
                            <option key={prov.name} value={prov.name}>
                              {prov.name} ({prov.sinhala})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Grade / Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={provinceGrade}
                          onChange={(e) => setProvinceGrade(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Grade 11 (O/L)">Grade 11 (O/L - සාමාන්‍ය පෙළ)</option>
                          <option value="Grade 13 (A/L)">Grade 13 (A/L - උසස් පෙළ)</option>
                          <option value="Grade 12 (A/L)">Grade 12 (A/L)</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 8">Grade 8</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 6">Grade 6</option>
                          <option value="Grade 5">Grade 5</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Term Test (වාර විභාගය)
                        </label>
                        <select
                          value={provinceTerm}
                          onChange={(e) => setProvinceTerm(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="3rd Term Test">3rd Term Test (3 වන වාරය)</option>
                          <option value="2nd Term Test">2nd Term Test (2 වන වාරය)</option>
                          <option value="1st Term Test">1st Term Test (1 වන වාරය)</option>
                          <option value="Year End Evaluation">Year End Evaluation (අවසාන ඇගයීම)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Medium
                        </label>
                        <select
                          value={medium}
                          onChange={(e) => setMedium(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Sinhala Medium">Sinhala Medium (සිංහල මාධ්‍ය)</option>
                          <option value="English Medium">English Medium (ඉංග්‍රීසි මාධ්‍ය)</option>
                          <option value="Tamil Medium">Tamil Medium (දෙමළ මාධ්‍ය)</option>
                        </select>
                      </div>

                      {/* With Answers Toggle inside Province Paper Form */}
                      <div className="md:col-span-2 pt-1">
                        {renderWithAnswersToggle()}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: Paper Information */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    Paper Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label
                        htmlFor="paper-subject"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Subject (විෂයය) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="paper-subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={
                          paperSubTab === "passpaper"
                            ? "e.g. Science, Mathematics, English"
                            : paperSubTab === "model"
                            ? "e.g. Combined Mathematics, Physics"
                            : "e.g. Science, Information Technology"
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="paper-year"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Year (වර්ෂය) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="paper-year"
                        name="year"
                        type="number"
                        min="1990"
                        max="2099"
                        required
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="e.g. 2023"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  {/* Auto-Generated Title Live Preview */}
                  <div className="mt-3 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-slate-400 font-semibold shrink-0">Auto Title:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {generatePaperTitle()}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                      Auto Generated
                    </span>
                  </div>
                </div>

                {/* SECTION 3: Document Attachment */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    PDF Document
                  </h3>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      file
                        ? "border-blue-400 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-950/40"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      id="file"
                      name="file"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />

                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className={`w-10 h-10 mb-2 ${
                          file ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      {file ? (
                        <div className="text-sm">
                          <p className="font-bold text-slate-900 dark:text-white break-all">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF ready to upload
                          </p>
                          <span className="inline-block mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 underline">
                            Change file
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                            Click to browse or drag & drop past paper PDF
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            Only PDF documents are supported (Up to 50MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full sm:w-auto min-w-[200px] inline-flex justify-center items-center py-3 px-8 rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1e255e] hover:bg-[#161c48] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      "Upload Paper"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        )}

        {/* ================= EDIT PAST PAPER MODAL ================= */}
        {editingPaper && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
            onClick={handleCloseEdit}
          >
            <div
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold shadow-xs">
                    ✏️
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      Edit Past Paper Details
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Update title, subject, exam category, year, or answers state.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Error Alert */}
              {editError && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400">
                  {editError}
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Paper Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Paper Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* Category & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer font-bold"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1990"
                      max="2099"
                      required
                      value={editFormData.year}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, year: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-bold"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.subject}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, subject: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* With Answers Toggle */}
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        With Answers / Marking Scheme (පිළිතුරු සහිතයි)
                      </span>
                      {editFormData.has_answers && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {editFormData.has_answers
                        ? "With Answers badge will be displayed on this paper card."
                        : "Marking scheme / answers not included."}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editFormData.has_answers}
                    onClick={() =>
                      setEditFormData({
                        ...editFormData,
                        has_answers: !editFormData.has_answers,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      editFormData.has_answers
                        ? "bg-emerald-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
                        editFormData.has_answers ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* File Attachment Info */}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                  <span>Attached File (Cloudflare R2):</span>
                  <a
                    href={editingPaper.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Open PDF Document ↗
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    disabled={updatingPaper}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPaper}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {updatingPaper ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
