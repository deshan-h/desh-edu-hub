"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import DeshEduHubLogo from "@/components/DeshEduHubLogo";
import PremiumSelect from "@/components/ui/PremiumSelect";

const CATEGORIES = ["O/L", "A/L", "Grade 5", "Provincial", "Model"];

const PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "North Western Province",
  "Sabaragamuwa Province",
  "Eastern Province",
  "Uva Province",
  "Northern Province",
  "North Central Province",
];

const PROVINCE_GRADES = [
  "Grade 11 (O/L)",
  "Grade 10",
  "Grade 9",
  "Grade 8",
  "Grade 7",
  "Grade 6",
  "Grade 12/13 (A/L)",
  "Grade 5",
];

const PROVINCE_TERMS = [
  "1st Term Test",
  "2nd Term Test",
  "3rd Term Test",
];

const MEDIUMS = ["Sinhala Medium", "English Medium", "Tamil Medium"];

const KNOWN_SUBJECTS = [
  { key: "Combined Mathematics", patterns: ["combined mathematics", "combined maths", "සංයුක්ත ගණිතය", "com maths"] },
  { key: "Mathematics", patterns: ["mathematics", "maths", "math", "ගණිතය"] },
  { key: "Science", patterns: ["science", "විද්‍යාව"] },
  { key: "Physics", patterns: ["physics", "භෞතික විද්‍යාව", "භෞතික"] },
  { key: "Chemistry", patterns: ["chemistry", "රසායන විද්‍යාව", "රසායන"] },
  { key: "Biology", patterns: ["biology", "ජීව විද්‍යාව", "ජීව"] },
  { key: "Agricultural Science", patterns: ["agricultural science", "agriculture", "කෘෂි විද්‍යාව", "කෘෂිකර්මය"] },
  { key: "English Language", patterns: ["english language", "general english", "english", "ඉංග්‍රීසි"] },
  { key: "Sinhala Language & Literature", patterns: ["sinhala language", "sinhala literature", "sinhala", "සිංහල සාහිත්‍යය", "සිංහල භාෂාව", "සිංහල"] },
  { key: "Tamil Language", patterns: ["tamil language", "tamil", "දෙමළ"] },
  { key: "History", patterns: ["history", "ඉතිහාසය"] },
  { key: "Geography", patterns: ["geography", "භූගෝල විද්‍යාව", "භූගෝලය"] },
  { key: "Civic Education", patterns: ["civic education", "civics", "පුරවැසි අධ්‍යාපනය", "පුරවැසි"] },
  { key: "Political Science", patterns: ["political science", "දේශපාලන විද්‍යාව", "දේශපාලන"] },
  { key: "Logic & Scientific Method", patterns: ["logic and scientific method", "logic", "තර්ක ශාස්ත්‍රය", "තර්කය"] },
  { key: "Economics", patterns: ["economics", "econ", "ආර්ථික විද්‍යාව", "ආර්ථික"] },
  { key: "Information & Communication Technology", patterns: ["information and communication technology", "information communication technology", "information technology", "ict", "it", "තොරතුරු තාක්ෂණය"] },
  { key: "Business & Accounting Studies", patterns: ["business and accounting studies", "business & accounting studies", "commerce", "ව්‍යාපාර හා ගිණුම්කරණ අධ්‍යයනය", "වාණිජ"] },
  { key: "Accounting", patterns: ["accounting", "acc", "ගිණුම්කරණය"] },
  { key: "Business Studies", patterns: ["business studies", "bs", "ව්‍යාපාර අධ්‍යයනය"] },
  { key: "Buddhism", patterns: ["buddhism", "බුද්ධ ධර්මය", "බුදු දහම"] },
  { key: "Buddhist Civilization", patterns: ["buddhist civilization", "බෞද්ධ ශිෂ්ටාචාරය"] },
  { key: "Christianity", patterns: ["christianity", "ක්‍රිස්තියානි ධර්මය", "ක්‍රිස්තු ධර්මය"] },
  { key: "Islam", patterns: ["islam", "ඉස්ලාම් ධර්මය"] },
  { key: "Hinduism", patterns: ["hinduism", "හින්දු ධර්මය"] },
  { key: "Health & Physical Education", patterns: ["health and physical education", "health & physical education", "health", "සෞඛ්‍යය"] },
  { key: "Art", patterns: ["art", "චිත්‍ර කලාව", "චිත්‍ර"] },
  { key: "Music", patterns: ["oriental music", "western music", "carnatic music", "music", "සංගීතය"] },
  { key: "Dancing", patterns: ["dancing", "නර්තනය"] },
  { key: "Drama & Theatre", patterns: ["drama and theatre", "drama & theatre", "drama", "නාට්‍ය හා රංග කලාව"] },
  { key: "Design & Technology", patterns: ["design and technology", "design & technology", "තාක්ෂණවේදය"] },
  { key: "Engineering Technology", patterns: ["engineering technology", "et", "ඉංජිනේරු තාක්ෂණවේදය"] },
  { key: "Bio Systems Technology", patterns: ["bio systems technology", "bst", "ජෛව පද්ධති තාක්ෂණවේදය"] },
  { key: "Science for Technology", patterns: ["science for technology", "sft", "තාක්ෂණවේදය සඳහා විද්‍යාව"] },
  { key: "Communication & Media Studies", patterns: ["communication and media studies", "communication & media studies", "media", "සන්නිවේදනය හා මාධ්‍ය අධ්‍යයනය"] },
  { key: "Home Economics", patterns: ["home economics", "ගෘහ විද්‍යාව"] },
];

export default function AdminDashboard({ initialPapers = [], initialUsers = [] }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "repository" | "add-paper" | "students"
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
  const [isFrozen, setIsFrozen] = useState(false); // Batch upload: Freeze Year, Level & Medium
  const [isDraggingOverForm, setIsDraggingOverForm] = useState(false);
  const dragCounter = useRef(0);
  const [autofillNotice, setAutofillNotice] = useState(null);

  // Data State
  const [papers, setPapers] = useState(initialPapers);
  const [users] = useState(initialUsers);

  // Background Upload Queue State
  const [uploadQueue, setUploadQueue] = useState([]);
  const [showQueueDropdown, setShowQueueDropdown] = useState(false);
  const queueDropdownRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Close queue dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (queueDropdownRef.current && !queueDropdownRef.current.contains(e.target)) {
        setShowQueueDropdown(false);
      }
    };
    if (showQueueDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showQueueDropdown]);

  // Cache Clear and Hard Refresh
  const handleClearCacheRefresh = async () => {
    setIsRefreshing(true);
    showToast({
      type: "info",
      title: "Clearing Cache & Refreshing...",
      message: "Purging browser caches, workers, and reloading latest data...",
      duration: 3000,
    });
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update();
        }
      }
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn("Cache clear error:", e);
    }
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("reload", Date.now().toString());
      window.location.href = url.toString();
    }, 300);
  };
  const isProcessingQueue = useRef(false);

  const activeUploadsCount = useMemo(() => {
    return uploadQueue.filter(
      (item) => item.status === "queued" || item.status === "processing"
    ).length;
  }, [uploadQueue]);

  // Floating Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showToast = ({ type = "info", title, message, duration = 4500 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Background Upload Queue Worker
  useEffect(() => {
    const nextItem = uploadQueue.find((item) => item.status === "queued");
    if (!nextItem || isProcessingQueue.current) return;

    isProcessingQueue.current = true;

    const processItem = async (item) => {
      const updateItem = (updates) => {
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, ...updates } : q))
        );
      };

      try {
        updateItem({
          status: "processing",
          progress: 25,
          stepLabel: "Attaching promotional poster...",
        });

        // Stage 2: Preparing Cloudflare R2 Upload payload
        const formPayload = new FormData();
        formPayload.append("file", item.file);
        formPayload.append("title", item.title);
        formPayload.append("category", item.category);
        formPayload.append("subject", item.subject);
        formPayload.append("year", item.year.toString());
        formPayload.append("has_answers", item.has_answers ? "true" : "false");

        updateItem({
          progress: 55,
          stepLabel: "Uploading document to Cloudflare R2...",
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formPayload,
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to upload document.");
        }

        // Stage 3: Success
        updateItem({
          status: "completed",
          progress: 100,
          stepLabel: "Published successfully",
          resultData: result.data,
        });

        if (result.data) {
          setPapers((prev) => [result.data, ...prev]);
        }

        showToast({
          type: "success",
          title: "Upload Completed!",
          message: `"${item.title}" is now live in the catalog.`,
        });
      } catch (err) {
        console.error("Queue upload error:", err);
        updateItem({
          status: "error",
          progress: 0,
          stepLabel: "Upload failed",
          errorMessage: err.message || "An unexpected error occurred.",
        });

        showToast({
          type: "error",
          title: "Upload Failed",
          message: `"${item.title}": ${err.message || "Failed to upload."}`,
        });
      } finally {
        isProcessingQueue.current = false;
      }
    };

    processItem(nextItem);
  }, [uploadQueue]);

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
      showToast({ type: "error", title: "Validation Error", message: "Paper title cannot be empty." });
      return;
    }
    if (!editFormData.subject.trim()) {
      setEditError("Subject cannot be empty.");
      showToast({ type: "error", title: "Validation Error", message: "Subject cannot be empty." });
      return;
    }
    if (!editFormData.year || isNaN(editFormData.year)) {
      setEditError("Please enter a valid year.");
      showToast({ type: "error", title: "Validation Error", message: "Please enter a valid academic year." });
      return;
    }

    // Check duplicate among other papers
    const duplicate = papers.find(
      (p) =>
        p.id !== editingPaper.id &&
        (p.title?.trim().toLowerCase() === editFormData.title.trim().toLowerCase() ||
          (p.category?.toLowerCase() === editFormData.category?.toLowerCase() &&
            p.subject?.trim().toLowerCase() === editFormData.subject.trim().toLowerCase() &&
            p.year?.toString().trim() === editFormData.year.toString().trim() &&
            Boolean(p.has_answers) === Boolean(editFormData.has_answers)))
    );

    if (duplicate) {
      const msg = `Another paper with these details already exists ("${duplicate.title}").`;
      setEditError(msg);
      showToast({ type: "warning", title: "Duplicate Paper Warning", message: msg });
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
      showToast({
        type: "success",
        title: "Paper Updated",
        message: `"${editFormData.title}" was updated successfully.`,
      });
    } catch (err) {
      setEditError(err.message || "Failed to save changes.");
      showToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to save changes.",
      });
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
  const fileInputRef = useRef(null);

  // Metrics
  const totalDownloads = useMemo(() => {
    return papers.reduce((sum, p) => sum + (Number(p.download_count) || 0), 0);
  }, [papers]);

  // Analytics: Category breakdown
  const categoryStats = useMemo(() => {
    const counts = { "O/L": 0, "A/L": 0, "Grade 5": 0, "Provincial": 0, "Model": 0 };
    papers.forEach((p) => {
      const cat = p.category || "O/L";
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      } else {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [papers]);

  // Analytics: Year breakdown (sorted descending)
  const yearStats = useMemo(() => {
    const counts = {};
    papers.forEach((p) => {
      const yr = p.year ? p.year.toString() : "Unknown";
      counts[yr] = (counts[yr] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .slice(0, 7);
  }, [papers]);

  // Analytics: Medium breakdown
  const mediumStats = useMemo(() => {
    let sinhala = 0;
    let english = 0;
    let tamil = 0;
    papers.forEach((p) => {
      const title = (p.title || "").toLowerCase();
      if (title.includes("english medium") || title.includes("(english)")) english++;
      else if (title.includes("tamil medium") || title.includes("(tamil)")) tamil++;
      else sinhala++;
    });
    const total = papers.length || 1;
    return {
      sinhala: { count: sinhala, pct: Math.round((sinhala / total) * 100) },
      english: { count: english, pct: Math.round((english / total) * 100) },
      tamil: { count: tamil, pct: Math.round((tamil / total) * 100) },
    };
  }, [papers]);

  // Analytics: Answers Coverage
  const answersCount = useMemo(() => {
    return papers.filter((p) => Boolean(p.has_answers)).length;
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
      showToast({
        type: "success",
        title: "Paper Deleted",
        message: `"${paper.title}" was permanently removed.`,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Delete Failed",
        message: err.message || "Failed to delete paper.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Upload Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Intelligent file name parser
  const parseFileNameDetails = (fileName) => {
    if (!fileName) return null;
    const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const lower = cleanName.toLowerCase();
    const details = {
      subject: null,
      year: null,
      medium: null,
      level: null,
      province: null,
      provinceGrade: null,
      term: null,
      hasAnswers: false,
    };

    // 1. Detect Answers / Marking Scheme
    if (
      lower.includes("answers") ||
      lower.includes("answer") ||
      lower.includes("marking") ||
      lower.includes("scheme") ||
      lower.includes("with answers") ||
      lower.includes("marking scheme") ||
      lower.includes("පිළිතුරු")
    ) {
      details.hasAnswers = true;
    }

    // 2. Detect 4-digit Year (1990 - 2099)
    const yearMatch = cleanName.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      details.year = yearMatch[1];
    }

    // 3. Detect Medium
    if (lower.includes("english medium") || lower.includes("english") || lower.includes("em") || lower.includes("eng")) {
      if (!lower.includes("general english") && !lower.includes("english language") && !lower.includes("english literature")) {
        details.medium = "English Medium";
      }
    }
    if (lower.includes("tamil medium") || lower.includes("tamil") || lower.includes("tm")) {
      if (!lower.includes("tamil language")) {
        details.medium = "Tamil Medium";
      }
    }
    if (lower.includes("sinhala medium") || lower.includes("sinhala") || lower.includes("sm") || lower.includes("සිංහල")) {
      if (!lower.includes("sinhala language") && !lower.includes("sinhala literature")) {
        details.medium = "Sinhala Medium";
      }
    }

    // 4. Detect Exam Level
    if (lower.includes("a/l") || lower.includes("al") || lower.includes("advanced level") || lower.includes("උසස් පෙළ")) {
      details.level = "A/L";
    } else if (lower.includes("o/l") || lower.includes("ol") || lower.includes("ordinary level") || lower.includes("සාමාන්‍ය පෙළ")) {
      details.level = "O/L";
    } else if (lower.includes("grade 5") || lower.includes("scholarship") || lower.includes("ශිෂ්‍යත්ව")) {
      details.level = "Grade 5";
    }

    // 5. Detect Province
    for (const p of PROVINCES) {
      const pLower = p.toLowerCase();
      const pShort = pLower.replace(" province", "");
      if (lower.includes(pLower) || lower.includes(pShort)) {
        details.province = p;
        break;
      }
    }

    // 6. Detect Term
    if (lower.includes("1st term") || lower.includes("first term") || lower.includes("1 term") || lower.includes("term 1")) {
      details.term = "1st Term Test";
    } else if (lower.includes("2nd term") || lower.includes("second term") || lower.includes("2 term") || lower.includes("term 2")) {
      details.term = "2nd Term Test";
    } else if (lower.includes("3rd term") || lower.includes("third term") || lower.includes("3 term") || lower.includes("term 3")) {
      details.term = "3rd Term Test";
    }

    // 7. Detect Grade
    for (const g of PROVINCE_GRADES) {
      const gNum = g.match(/Grade\s*(\d+)/i);
      if (gNum && lower.includes(`grade ${gNum[1]}`)) {
        details.provinceGrade = g;
        break;
      }
    }

    // 8. Detect Subject
    for (const subj of KNOWN_SUBJECTS) {
      for (const pat of subj.patterns) {
        const regex = new RegExp(`\\b${pat.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
        if (regex.test(cleanName)) {
          details.subject = subj.key;
          break;
        }
      }
      if (details.subject) break;
    }

    return details;
  };

  const autoFillFromFileName = (fileName) => {
    const details = parseFileNameDetails(fileName);
    if (!details) return;

    const detected = [];

    if (details.subject && (!formData.subject || !isFrozen)) {
      setFormData((prev) => ({ ...prev, subject: details.subject }));
      detected.push(`Subject: ${details.subject}`);
    }

    if (details.year && (!isFrozen || !formData.year)) {
      setFormData((prev) => ({ ...prev, year: details.year }));
      detected.push(`Year: ${details.year}`);
    }

    if (details.hasAnswers !== undefined) {
      setHasAnswers(details.hasAnswers);
      detected.push(`Answers: ${details.hasAnswers ? "Yes" : "No"}`);
    }

    if (details.medium && !isFrozen) {
      setMedium(details.medium);
      detected.push(`Medium: ${details.medium}`);
    }

    if (details.province) {
      setPaperSubTab("province");
      setProvince(details.province);
      detected.push(`Province: ${details.province}`);
      if (details.provinceGrade) setProvinceGrade(details.provinceGrade);
      if (details.term) setProvinceTerm(details.term);
    } else if (details.level) {
      if (paperSubTab === "passpaper") {
        setPasspaperLevel(details.level);
        detected.push(`Level: ${details.level}`);
      } else if (paperSubTab === "model") {
        setModelLevel(details.level);
        detected.push(`Level: ${details.level}`);
      }
    }

    if (detected.length > 0) {
      const noticeText = `Auto-detected: ${detected.join(" • ")}`;
      setAutofillNotice(noticeText);
      showToast({
        type: "info",
        title: "File Details Auto-filled",
        message: noticeText,
        duration: 4000,
      });
      setTimeout(() => setAutofillNotice(null), 7000);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const isPdf =
        selected.type === "application/pdf" ||
        selected.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        showToast({
          type: "error",
          title: "Invalid File Format",
          message: "Please choose a valid PDF document (.pdf).",
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setFile(selected);
      autoFillFromFileName(selected.name);
    }
  };

  const handleClearForm = () => {
    setFormData((prev) => ({
      subject: "",
      year: isFrozen ? prev.year : new Date().getFullYear().toString(),
    }));
    setFile(null);
    if (!isFrozen) {
      setHasAnswers(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setAutofillNotice(null);
    showToast({
      type: "info",
      title: "Form Cleared",
      message: isFrozen ? "Subject and File cleared. Frozen settings preserved." : "Form reset to default settings.",
      duration: 3000,
    });
  };

  const getComputedCategory = () => {
    if (paperSubTab === "passpaper") return passpaperLevel;
    if (paperSubTab === "model") return "Model";
    if (paperSubTab === "province") return "Provincial";
    return "O/L";
  };

  const generatePaperTitle = () => {
    const subj = formData.subject.trim() || "Subject";
    const yr = formData.year?.toString().trim() || new Date().getFullYear().toString();

    if (paperSubTab === "passpaper") {
      const levelLabel =
        passpaperLevel === "O/L"
          ? "G.C.E. O/L"
          : passpaperLevel === "A/L"
          ? "G.C.E. A/L"
          : "Grade 5 Scholarship";
      return `${yr} ${levelLabel} ${subj} Past Paper (${medium})`;
    } else if (paperSubTab === "model") {
      const levelLabel =
        modelLevel === "General"
          ? ""
          : modelLevel === "Grade 5"
          ? "Grade 5"
          : `G.C.E. ${modelLevel}`;
      return `${yr} ${levelLabel ? levelLabel + " " : ""}${subj} Model Paper (${medium})`;
    } else if (paperSubTab === "province") {
      return `${yr} ${province} ${provinceGrade} ${subj} ${provinceTerm} (${medium})`;
    }
    return `${yr} ${subj} Past Paper`;
  };

  const checkDuplicatePaper = (title, category, subject, year, hasAns) => {
    if (!subject || !year) return null;
    const cleanTitle = title.trim().toLowerCase();
    const cleanSubj = subject.trim().toLowerCase();
    const cleanYr = year.toString().trim();

    const existing = papers.find((p) => {
      const sameTitle = p.title?.trim().toLowerCase() === cleanTitle;
      const sameMeta =
        p.category?.toLowerCase() === category.toLowerCase() &&
        p.subject?.trim().toLowerCase() === cleanSubj &&
        p.year?.toString().trim() === cleanYr &&
        Boolean(p.has_answers) === Boolean(hasAns);

      return sameTitle || sameMeta;
    });

    if (existing) {
      return {
        isDuplicate: true,
        existingPaper: existing,
        message: `A paper with these details ("${existing.title}") already exists in the catalog.`,
      };
    }

    return null;
  };

  const duplicateCheck = useMemo(() => {
    const finalTitle = generatePaperTitle();
    const finalCategory = getComputedCategory();
    return checkDuplicatePaper(
      finalTitle,
      finalCategory,
      formData.subject,
      formData.year,
      hasAnswers
    );
  }, [
    formData.subject,
    formData.year,
    paperSubTab,
    passpaperLevel,
    modelLevel,
    province,
    provinceGrade,
    provinceTerm,
    medium,
    hasAnswers,
    papers,
  ]);

  // Drag and drop handlers over entire form
  const handleFormDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOverForm(true);
    }
  };

  const handleFormDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDraggingOverForm(false);
    }
  };

  const handleFormDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleFormDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDraggingOverForm(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const isPdf =
        droppedFile.type === "application/pdf" ||
        droppedFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        showToast({
          type: "error",
          title: "Invalid File Type",
          message: "Please drop a valid PDF document (.pdf).",
        });
        return;
      }

      setFile(droppedFile);
      autoFillFromFileName(droppedFile.name);
    }
  };

  // Submit Handler: Enqueue upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      showToast({
        type: "error",
        title: "Missing Subject",
        message: "Please enter or select a subject name.",
      });
      return;
    }

    if (!formData.year || isNaN(formData.year) || formData.year < 1990 || formData.year > 2099) {
      showToast({
        type: "error",
        title: "Invalid Year",
        message: "Please enter a valid 4-digit academic year (1990 - 2099).",
      });
      return;
    }

    if (!file) {
      showToast({
        type: "error",
        title: "Missing PDF Document",
        message: "Please select or drop a PDF past paper file to upload.",
      });
      return;
    }

    const finalTitle = generatePaperTitle();
    const finalCategory = getComputedCategory();

    // Check duplicate
    if (duplicateCheck?.isDuplicate) {
      showToast({
        type: "warning",
        title: "Duplicate Paper Warning",
        message: duplicateCheck.message,
      });
      return;
    }

    const queuedItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      file,
      title: finalTitle,
      category: finalCategory,
      subject: formData.subject.trim(),
      year: formData.year.toString().trim(),
      has_answers: hasAnswers,
      status: "queued",
      stepLabel: "In Queue...",
      progress: 5,
      createdAt: Date.now(),
    };

    setUploadQueue((prev) => [...prev, queuedItem]);

    showToast({
      type: "success",
      title: "Added to Upload Queue",
      message: `"${finalTitle}" added to queue. Uploading in background.`,
      duration: 4000,
    });

    // Reset subject & file; retain frozen fields
    setFormData((prev) => ({
      subject: "",
      year: isFrozen ? prev.year : new Date().getFullYear().toString(),
    }));
    if (!isFrozen) {
      setHasAnswers(false);
    }
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setAutofillNotice(null);
  };

  const handleRetryUpload = (itemId) => {
    setUploadQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: "queued", progress: 5, stepLabel: "In Queue...", errorMessage: null }
          : item
      )
    );
  };

  const handleClearCompletedQueue = () => {
    setUploadQueue((prev) =>
      prev.filter((item) => item.status === "queued" || item.status === "processing")
    );
    showToast({
      type: "info",
      title: "Queue Cleared",
      message: "Completed and failed items removed from queue.",
      duration: 3000,
    });
  };

  // Reusable With Answers Toggle Component
  const renderWithAnswersToggle = () => (
    <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 flex items-center justify-between gap-3 shadow-2xs">
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
              With Answers / Marking Scheme
            </span>
            {hasAnswers && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {hasAnswers
              ? "Answers included with this paper. 'With Answers' badge will be highlighted."
              : "Question paper only (no answers / marking scheme attached)."}
          </p>
        </div>
      </div>

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ================= LEFT SIDEBAR (MAIN TABS WITH COLLAPSE TOGGLE) ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 lg:static ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Brand Header with Collapse Toggle */}
          <div className={`border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300 ${
            isSidebarCollapsed ? "p-3 flex flex-col items-center gap-3" : "p-4"
          }`}>
            <div className="flex items-start justify-between w-full">
              <div className={isSidebarCollapsed ? "mx-auto flex flex-col items-center" : ""}>
                <Link href="/" className="flex items-center gap-2.5 group" title="DESH Edu Hub">
                  <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0">
                    <Image
                      src="/desh-eduhub-logo.png"
                      alt="DESH EduHub Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="font-black text-sm text-slate-900 dark:text-white whitespace-nowrap tracking-tight">
                      DESH Edu Hub
                    </span>
                  )}
                </Link>

                {/* Administrator Online Status right under Logo */}
                {!isSidebarCollapsed && (
                  <div className="mt-2 pl-0.5 flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Administrator
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                )}
              </div>

              {/* Close Mobile Button */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>

              {/* Desktop Collapse / Expand Toggle Button */}
              {!isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Collapse Sidebar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* When collapsed, show the Expand button centered */}
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer mt-1"
                title="Expand Sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Side Tabs */}
          <div className={`space-y-1.5 transition-all duration-300 ${isSidebarCollapsed ? "p-2" : "p-4"}`}>
            {!isSidebarCollapsed && (
              <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 animate-in fade-in duration-200">
                Main Menu
              </p>
            )}

            {/* Tab 1: Dashboard */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("dashboard");
                setMobileSidebarOpen(false);
              }}
              title="Dashboard Overview"
              className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSidebarCollapsed
                  ? "w-11 h-11 mx-auto justify-center p-0"
                  : "justify-between px-3.5 py-2.5"
              } ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </div>
            </button>

            {/* Tab 2: Add Paper (Directly under Dashboard) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("add-paper");
                setMobileSidebarOpen(false);
              }}
              title="Add Examination Paper"
              className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSidebarCollapsed
                  ? "w-11 h-11 mx-auto justify-center p-0"
                  : "justify-between px-3.5 py-2.5"
              } ${
                activeTab === "add-paper"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {!isSidebarCollapsed && <span>Add Paper</span>}
              </div>
            </button>

            {/* Tab 3: Past Papers Repository */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("repository");
                setMobileSidebarOpen(false);
              }}
              title={`Past Papers Repository (${papers.length})`}
              className={`relative w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSidebarCollapsed
                  ? "w-11 h-11 mx-auto justify-center p-0"
                  : "justify-between px-3.5 py-2.5"
              } ${
                activeTab === "repository"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {!isSidebarCollapsed && <span>Repository</span>}
              </div>
              {!isSidebarCollapsed ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === "repository"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {papers.length}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>

            {/* Tab 4: Students */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("students");
                setMobileSidebarOpen(false);
              }}
              title={`Registered Students (${users.length})`}
              className={`relative w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSidebarCollapsed
                  ? "w-11 h-11 mx-auto justify-center p-0"
                  : "justify-between px-3.5 py-2.5"
              } ${
                activeTab === "students"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {!isSidebarCollapsed && <span>Students</span>}
              </div>
              {!isSidebarCollapsed ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === "students"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {users.length}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-400" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ================= RIGHT MAIN AREA (NAVBAR + CONTENT) ================= */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Floating Top Navbar Across Remaining Width */}
        <div className="sticky top-1 sm:top-2 z-40 w-full px-2 sm:px-4 max-w-[99.5%] mx-auto transition-all duration-300">
          <header className="relative w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl border border-white/60 dark:border-white/10 shadow-xl shadow-slate-900/[0.04] dark:shadow-black/50 px-3 sm:px-5 h-15 sm:h-17 flex items-center justify-between gap-3">
            
            {/* Luminous Top Rim */}
            <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

            {/* Left: Mobile Sidebar Hamburger + Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Open Sidebar Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white capitalize tracking-tight">
                  {activeTab === "dashboard" && "Dashboard Overview"}
                  {activeTab === "repository" && `Past Papers Repository (${papers.length})`}
                  {activeTab === "add-paper" && "Upload Past Paper"}
                  {activeTab === "students" && `Registered Students (${users.length})`}
                </h2>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Admin
                </div>
              </div>
            </div>

            {/* Right: Upload Queue Dropdown, Hard Refresh, ThemeToggle, View Public Site, Sign Out */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Upload Queue Dropdown Popover */}
              <div className="relative" ref={queueDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowQueueDropdown(!showQueueDropdown)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
                    activeUploadsCount > 0
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20"
                      : uploadQueue.length > 0
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-white/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/90"
                  }`}
                  title="View Upload Queue"
                >
                  <svg className={`w-4 h-4 ${activeUploadsCount > 0 ? "animate-bounce" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="hidden md:inline">Queue</span>
                  {uploadQueue.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      activeUploadsCount > 0
                        ? "bg-amber-500 text-white animate-pulse"
                        : "bg-emerald-500 text-white"
                    }`}>
                      {activeUploadsCount > 0 ? activeUploadsCount : uploadQueue.length}
                    </span>
                  )}
                </button>

                {/* Floating Upload Queue Dropdown Popover */}
                {showQueueDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/20 dark:shadow-black/70 animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right overflow-hidden flex flex-col max-h-[75vh]">
                    {/* Top luminous cyan rim */}
                    <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

                    {/* Popover Header */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Upload Queue</span>
                          {activeUploadsCount > 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {activeUploadsCount > 0
                            ? `${activeUploadsCount} paper${activeUploadsCount > 1 ? "s" : ""} uploading in background`
                            : "All queued papers processed"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {uploadQueue.some((q) => q.status === "completed" || q.status === "error") && (
                          <button
                            type="button"
                            onClick={handleClearCompletedQueue}
                            className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            Clear Finished
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowQueueDropdown(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Popover Body */}
                    <div className="p-3 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar max-h-80">
                      {uploadQueue.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                          <p className="text-2xl mb-1">📥</p>
                          <p className="text-xs font-bold">No papers in queue.</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            New uploads will progress here smoothly in background.
                          </p>
                        </div>
                      ) : (
                        uploadQueue.map((item) => (
                          <div key={item.id} className="pt-2.5 first:pt-0 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                                  {item.category} • {item.year}
                                </span>
                                <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                                item.status === "completed"
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                  : item.status === "processing"
                                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse"
                                  : item.status === "error"
                                  ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}>
                                {item.status === "completed" && "✓ Done"}
                                {item.status === "processing" && "Uploading..."}
                                {item.status === "error" && "✕ Failed"}
                                {item.status === "queued" && "Queued"}
                              </span>
                            </div>

                            {(item.status === "processing" || item.status === "queued") && (
                              <div className="space-y-1">
                                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400">
                                  {item.stepLabel}
                                </p>
                              </div>
                            )}

                            {item.status === "error" && (
                              <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-200 dark:border-rose-900">
                                <span className="text-[10px] truncate max-w-[200px]">{item.errorMessage}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRetryUpload(item.id)}
                                  className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] hover:bg-rose-700 cursor-pointer"
                                >
                                  Retry
                                </button>
                              </div>
                            )}

                            {item.status === "completed" && item.resultData?.file_url && (
                              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                                <span>Attached Poster & Saved</span>
                                <a
                                  href={item.resultData.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                >
                                  Open PDF ↗
                                </a>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cache Clear & Hard Refresh Button */}
              <button
                type="button"
                onClick={handleClearCacheRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition shadow-2xs cursor-pointer"
                title="Clear Cache & Hard Refresh"
              >
                <svg className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : "opacity-70"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden xl:inline">Hard Refresh</span>
              </button>

              {/* Dark Mode Toggle */}
              <div className="shrink-0">
                <ThemeToggle />
              </div>

              {/* View Public Site Link */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-2xs"
                title="View Public Site (Opens in new tab)"
              >
                <span>Public Site</span>
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition cursor-pointer shadow-2xs"
                title="Sign Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>
        </div>

        {/* ================= MAIN CONTENT WRAPPER ================= */}
        <main className="flex-1 w-full px-2 sm:px-4 max-w-[99.5%] mx-auto mt-4 sm:mt-5 pb-20">
          {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Welcome to Administrator Management Portal
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">
                  Manage past papers repository, view real-time download analytics, and monitor student registrations.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("add-paper")}
                  className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload New Paper</span>
                </button>
                <button
                  onClick={() => setActiveTab("repository")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition cursor-pointer"
                >
                  View Repository
                </button>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Papers
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {papers.length}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    Live in Catalog
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Downloads
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {totalDownloads.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                    Student Downloads
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Registered Students
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {users.length}
                  </p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                    Student Profiles
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Upload Queue
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {activeUploadsCount}
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                    {activeUploadsCount > 0 ? "Uploading in Background" : "All Tasks Finished"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Modern Interactive Analytics & Distribution Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              
              {/* Widget 1: Category Distribution Breakdown */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Curriculum Category Distribution
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Breakdown of papers across examination categories
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    {papers.length} Papers
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "G.C.E. Ordinary Level (O/L)", key: "O/L", color: "bg-blue-500", text: "text-blue-600" },
                    { label: "G.C.E. Advanced Level (A/L)", key: "A/L", color: "bg-purple-500", text: "text-purple-600" },
                    { label: "Grade 5 Scholarship", key: "Grade 5", color: "bg-amber-500", text: "text-amber-600" },
                    { label: "Provincial Term Tests", key: "Provincial", color: "bg-emerald-500", text: "text-emerald-600" },
                    { label: "Model Papers", key: "Model", color: "bg-rose-500", text: "text-rose-600" },
                  ].map((cat) => {
                    const count = categoryStats[cat.key] || 0;
                    const pct = papers.length > 0 ? Math.round((count / papers.length) * 100) : 0;

                    return (
                      <div key={cat.key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                            <span>{cat.label}</span>
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Widget 2: Academic Year Distribution Bar Chart */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Academic Timeline Volume
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Historical past paper archiving volume by academic year
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Recent Years
                    </span>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="pt-6 pb-2">
                    {yearStats.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-10">No year distribution data available.</p>
                    ) : (
                      <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
                        {(() => {
                          const maxCount = Math.max(...yearStats.map(([, c]) => c), 1);
                          return yearStats.map(([yr, count]) => {
                            const barHeight = Math.max(12, Math.round((count / maxCount) * 100));

                            return (
                              <div key={yr} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {count}
                                </span>
                                <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden p-0.5 flex flex-col justify-end h-full">
                                  <div
                                    className="w-full bg-gradient-to-t from-blue-600 via-indigo-600 to-cyan-400 rounded-lg transition-all duration-500 group-hover:brightness-110 shadow-xs"
                                    style={{ height: `${barHeight}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 font-mono">
                                  {yr}
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Archived across Sri Lankan national curriculum</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("repository")}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    View in Repository ↗
                  </button>
                </div>
              </div>

              {/* Widget 3: Medium Breakdown & Answers Scheme Ratio */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Curriculum Medium & Answer Keys
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Language medium coverage and marking schemes
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    {Math.round((answersCount / (papers.length || 1)) * 100)}% With Answers
                  </span>
                </div>

                {/* Medium Multi-segmented Track */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Medium Distribution</span>
                    <span className="text-[11px] text-slate-400">Sinhala • English • Tamil</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-0.5 gap-0.5">
                    <div
                      className="h-full bg-blue-500 rounded-l-full transition-all duration-500"
                      style={{ width: `${mediumStats.sinhala.pct}%` }}
                      title={`Sinhala: ${mediumStats.sinhala.count} (${mediumStats.sinhala.pct}%)`}
                    />
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${mediumStats.english.pct}%` }}
                      title={`English: ${mediumStats.english.count} (${mediumStats.english.pct}%)`}
                    />
                    <div
                      className="h-full bg-amber-500 rounded-r-full transition-all duration-500"
                      style={{ width: `${mediumStats.tamil.pct}%` }}
                      title={`Tamil: ${mediumStats.tamil.count} (${mediumStats.tamil.pct}%)`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400">Sinhala Medium</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">{mediumStats.sinhala.count}</span>
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">{mediumStats.sinhala.pct}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400">English Medium</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">{mediumStats.english.count}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{mediumStats.english.pct}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400">Tamil Medium</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">{mediumStats.tamil.count}</span>
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{mediumStats.tamil.pct}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget 4: Cloud Infrastructure & System Health */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        System & Cloud Infrastructure Health
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Cloudflare R2, Supabase Database & Worker Status
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      All Operational
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Cloudflare R2</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">Storage & CDN Edge</p>
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">99.99% Uptime</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Supabase DB</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">PostgreSQL Edge</p>
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1">&lt; 15ms Latency</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">PDF Watermark</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">pdf-lib Engine</p>
                      <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mt-1">Active</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Edge Caching</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-[10px] text-slate-500">Next.js Turbopack</p>
                      <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 mt-1">Optimized</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 text-right">
                  System Version 2.0 • Secured Admin Session
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPOSITORY TABLE */}
        {activeTab === "repository" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header & Filters */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">
                  Past Papers Repository ({papers.length})
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Search, edit metadata, view or permanently remove published examination papers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search by title, subject, year..."
                    className="w-60 sm:w-72 px-3.5 py-2 pl-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Category Filter */}
                <PremiumSelect
                  value={tableCategory}
                  onChange={setTableCategory}
                  size="sm"
                  className="w-48 sm:w-56"
                  options={[
                    { value: "All", label: "All Categories" },
                    { value: "O/L", label: "G.C.E. O/L", badge: "O/L" },
                    { value: "A/L", label: "G.C.E. A/L", badge: "A/L" },
                    { value: "Grade 5", label: "Grade 5 Scholarship", badge: "G5" },
                    { value: "Provincial", label: "Provincial Term Tests", badge: "Prov" },
                    { value: "Model", label: "Model Papers", badge: "Model" },
                  ]}
                />

                <button
                  onClick={() => setActiveTab("add-paper")}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Paper</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4">Year</th>
                      <th className="py-3.5 px-4">Answers</th>
                      <th className="py-3.5 px-4">Downloads</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredPapers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400">
                          No papers found matching the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPapers.map((paper) => (
                        <tr key={paper.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-sm truncate">
                            {paper.title}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              {paper.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {paper.subject}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {paper.year}
                          </td>
                          <td className="py-3.5 px-4">
                            {paper.has_answers ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                Answers
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                            {paper.download_count || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <a
                              href={paper.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold transition inline-block"
                            >
                              PDF ↗
                            </a>
                            <button
                              onClick={() => handleOpenEdit(paper)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePaper(paper)}
                              disabled={deletingId === paper.id}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold transition cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === paper.id ? "..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADD PAPER FORM (FULL PAGE ALIGNED) */}
        {activeTab === "add-paper" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Form Header Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">
                  Add Examination Past Paper
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Attach PDF documents with automated promotional poster generation, Cloudflare R2 hosting, and smart metadata indexing.
                </p>
              </div>

              {/* Sub-tab Switchers */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setPaperSubTab("passpaper")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    paperSubTab === "passpaper"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Standard Past Papers
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSubTab("model")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    paperSubTab === "model"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Model Papers
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSubTab("province")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    paperSubTab === "province"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Provincial Term Tests
                </button>
              </div>
            </div>

            {/* Main Form Container with Drag & Drop Overlay */}
            <div
              onDragEnter={handleFormDragEnter}
              onDragLeave={handleFormDragLeave}
              onDragOver={handleFormDragOver}
              onDrop={handleFormDrop}
              className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-7 transition-all"
            >
              {/* Full-Form Drag & Drop Blur Overlay */}
              {isDraggingOverForm && (
                <div className="absolute inset-0 z-30 rounded-3xl bg-slate-950/70 backdrop-blur-md border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center text-white pointer-events-none animate-in fade-in duration-200">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 text-3xl font-black mb-3 animate-bounce">
                    ↓
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-cyan-300 uppercase">
                    Drop PDF Past Paper Here
                  </h3>
                  <p className="text-sm text-cyan-100 font-semibold mt-1">
                    Release to attach file and auto-fill details
                  </p>
                </div>
              )}

              {/* Form Controls Header: Freeze & Clear */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {/* Freeze Settings Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isFrozen;
                      setIsFrozen(next);
                      showToast({
                        type: next ? "info" : "warning",
                        title: next ? "Settings Frozen" : "Settings Unfrozen",
                        message: next
                          ? "Academic Year, Level, and Medium will be preserved across uploads."
                          : "Batch upload freeze turned off.",
                        duration: 3500,
                      });
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      isFrozen
                        ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/20"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    <span>{isFrozen ? "❄ Frozen (Batch Mode)" : "❄ Freeze Settings"}</span>
                  </button>

                  {/* Clear Form */}
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    <span>Clear Form</span>
                  </button>
                </div>

                {/* Auto-fill Notice Pill */}
                {autofillNotice && (
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    <span>✨</span>
                    <span>{autofillNotice}</span>
                  </div>
                )}
              </div>

              {/* Form Element */}
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                
                {/* SUB-TAB 1: STANDARD PAST PAPERS */}
                {paperSubTab === "passpaper" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Exam Level */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Examination Level <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={passpaperLevel}
                          onChange={setPasspaperLevel}
                          options={[
                            { value: "O/L", label: "G.C.E. Ordinary Level (O/L)", badge: "O/L" },
                            { value: "A/L", label: "G.C.E. Advanced Level (A/L)", badge: "A/L" },
                            { value: "Grade 5", label: "Grade 5 Scholarship", badge: "Grade 5" },
                          ]}
                        />
                      </div>

                      {/* Academic Year */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          min="1990"
                          max="2099"
                          required
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      {/* Medium */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Medium <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={medium}
                          onChange={setMedium}
                          options={MEDIUMS.map((m) => ({
                            value: m,
                            label: m,
                            badge: m.includes("Sinhala") ? "SM" : m.includes("English") ? "EM" : "TM",
                          }))}
                        />
                      </div>
                    </div>

                    {/* Subject Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Subject Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g. Science, Mathematics, Information Technology, Physics"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: MODEL PAPERS */}
                {paperSubTab === "model" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Model Level */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Target Level <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={modelLevel}
                          onChange={setModelLevel}
                          options={[
                            { value: "A/L", label: "G.C.E. Advanced Level (A/L)", badge: "A/L" },
                            { value: "O/L", label: "G.C.E. Ordinary Level (O/L)", badge: "O/L" },
                            { value: "Grade 5", label: "Grade 5 Scholarship", badge: "Grade 5" },
                            { value: "General", label: "General Model Paper", badge: "General" },
                          ]}
                        />
                      </div>

                      {/* Academic Year */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          min="1990"
                          max="2099"
                          required
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      {/* Medium */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Medium <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={medium}
                          onChange={setMedium}
                          options={MEDIUMS.map((m) => ({
                            value: m,
                            label: m,
                            badge: m.includes("Sinhala") ? "SM" : m.includes("English") ? "EM" : "TM",
                          }))}
                        />
                      </div>
                    </div>

                    {/* Subject Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Subject Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g. Combined Mathematics, Chemistry, Biology, Economics"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: PROVINCIAL TERM TESTS */}
                {paperSubTab === "province" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Province */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={province}
                          onChange={setProvince}
                          options={PROVINCES.map((p) => ({
                            value: p,
                            label: p,
                            badge: "Province",
                          }))}
                        />
                      </div>

                      {/* Grade */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Grade / Level <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={provinceGrade}
                          onChange={setProvinceGrade}
                          options={PROVINCE_GRADES.map((g) => ({
                            value: g,
                            label: g,
                            badge: g.includes("11") || g.includes("12") ? "Secondary" : "Junior",
                          }))}
                        />
                      </div>

                      {/* Term */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Term Test <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={provinceTerm}
                          onChange={setProvinceTerm}
                          options={PROVINCE_TERMS.map((t) => ({
                            value: t,
                            label: t,
                            badge: "Term",
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Academic Year */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          min="1990"
                          max="2099"
                          required
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>

                      {/* Medium */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Medium <span className="text-red-500">*</span>
                        </label>
                        <PremiumSelect
                          value={medium}
                          onChange={setMedium}
                          options={MEDIUMS.map((m) => ({
                            value: m,
                            label: m,
                            badge: m.includes("Sinhala") ? "SM" : m.includes("English") ? "EM" : "TM",
                          }))}
                        />
                      </div>

                      {/* Subject Input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Subject Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="e.g. Science, Mathematics, English"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* With Answers Toggle */}
                {renderWithAnswersToggle()}

                {/* Generated Title Preview */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                      Generated Catalog Title
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {generatePaperTitle()}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Category: {getComputedCategory()}
                  </span>
                </div>

                {/* Duplicate Warning Alert */}
                {duplicateCheck?.isDuplicate && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <span className="font-bold block">Duplicate Paper Warning:</span>
                      <span>{duplicateCheck.message}</span>
                    </div>
                  </div>
                )}

                {/* PDF File Picker Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Attach PDF Document <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition ${
                      file
                        ? "border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
                        : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/50"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="application/pdf,.pdf"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    {file ? (
                      <div>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Click or drag another file to replace</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Click to browse or drop PDF past paper here
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Only PDF documents supported. Automatic subject & year detection included.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={Boolean(duplicateCheck?.isDuplicate)}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Add to Upload Queue</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED STUDENTS */}
        {activeTab === "students" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">
                  Registered Students ({users.length})
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student profiles registered on DESH EduHub.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-slate-400">
                          No registered students found in database.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                              {u.full_name ? u.full_name[0].toUpperCase() : "S"}
                            </div>
                            <span>{u.full_name || "Anonymous Student"}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.email || "-"}</td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.phone || "-"}</td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingPaper && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Edit Paper Metadata
              </h3>
              <button
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Paper Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <PremiumSelect
                    value={editFormData.category}
                    onChange={(val) => setEditFormData({ ...editFormData, category: val })}
                    options={CATEGORIES.map((c) => ({
                      value: c,
                      label: c,
                      badge: c,
                    }))}
                  />
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
                    onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.subject}
                  onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    With Answers / Marking Scheme
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    {editFormData.has_answers ? "Active answers badge." : "No answers attached."}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editFormData.has_answers}
                  onClick={() => setEditFormData({ ...editFormData, has_answers: !editFormData.has_answers })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    editFormData.has_answers ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
                      editFormData.has_answers ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                <span>R2 Storage Document:</span>
                <a
                  href={editingPaper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Open PDF ↗
                </a>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={updatingPaper}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPaper}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {updatingPaper ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FLOATING TOAST NOTIFICATION STACK ================= */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/40"
                : toast.type === "warning"
                ? "bg-amber-950/90 border-amber-500/40 text-amber-100 shadow-amber-950/40"
                : "bg-slate-900/90 border-cyan-500/40 text-cyan-100 shadow-cyan-950/40"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                  ✓
                </div>
              )}
              {toast.type === "error" && (
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-black">
                  ✕
                </div>
              )}
              {toast.type === "warning" && (
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                  !
                </div>
              )}
              {toast.type === "info" && (
                <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-black">
                  ℹ
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-black tracking-tight">{toast.title}</h5>
              <p className="text-[11px] opacity-90 mt-0.5 break-words leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/50 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
