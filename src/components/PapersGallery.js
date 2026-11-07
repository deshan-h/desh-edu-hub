"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import DownloadModal from "./DownloadModal";
import PdfViewerModal from "./PdfViewerModal";
import FeedbackRequestModal from "./FeedbackRequestModal";
import FloatingFeedbackButton from "./FloatingFeedbackButton";
import RequestedPaperAlert from "./RequestedPaperAlert";
import SearchBooksBackground from "./SearchBooksBackground";
import PremiumSelect from "@/components/ui/PremiumSelect";

// A/L Stream Options for Stream Filter Dropdown
export const STREAM_OPTIONS = [
  {
    value: "All",
    label: "සියලුම ධාරාවන් (All Streams)",
    sinhala: "සියලුම A/L විෂය ධාරා",
    short: "All Streams",
    badge: "All",
    icon: "🎓",
  },
  {
    value: "Arts",
    label: "Arts (Languages & Humanities)",
    sinhala: "කලා අංශය",
    short: "Arts",
    badge: "Arts",
    icon: "🎨",
  },
  {
    value: "Biological Science",
    label: "Biological Science (Bio)",
    sinhala: "ජීව විද්‍යා අංශය",
    short: "Bio",
    badge: "Bio",
    icon: "🔬",
  },
  {
    value: "Commerce",
    label: "Commerce (Business & Accounting)",
    sinhala: "වාණිජ අංශය",
    short: "Commerce",
    badge: "Commerce",
    icon: "📊",
  },
  {
    value: "Common General",
    label: "Common General (General English & GIT)",
    sinhala: "පොදු සාමාන්‍ය",
    short: "General",
    badge: "General",
    icon: "🌐",
  },
  {
    value: "Physical Science",
    label: "Physical Science (Combined Maths)",
    sinhala: "භෞතික විද්‍යා අංශය",
    short: "Maths",
    badge: "Maths",
    icon: "📐",
  },
  {
    value: "Technology",
    label: "Technology (ET / BST / SFT / ICT)",
    sinhala: "තාක්ෂණවේදය",
    short: "Tech",
    badge: "Tech",
    icon: "⚙️",
  },
];

// Grade Options for School Grades (Grade 1 - 11)
export const GRADE_OPTIONS = [
  {
    value: "All",
    label: "සියලුම ශ්‍රේණි (Grades 1 - 11)",
    sinhala: "1 සිට 11 දක්වා සියලුම ශ්‍රේණි",
    short: "All (Gr 1-11)",
    badge: "All",
    icon: "📚",
  },
  {
    value: "Grade 1",
    label: "Grade 1 (1 ශ්‍රේණිය)",
    sinhala: "1 ශ්‍රේණිය",
    short: "Grade 1",
    badge: "Gr 1",
    icon: "🌱",
  },
  {
    value: "Grade 2",
    label: "Grade 2 (2 ශ්‍රේණිය)",
    sinhala: "2 ශ්‍රේණිය",
    short: "Grade 2",
    badge: "Gr 2",
    icon: "🌿",
  },
  {
    value: "Grade 3",
    label: "Grade 3 (3 ශ්‍රේණිය)",
    sinhala: "3 ශ්‍රේණිය",
    short: "Grade 3",
    badge: "Gr 3",
    icon: "☘️",
  },
  {
    value: "Grade 4",
    label: "Grade 4 (4 ශ්‍රේණිය)",
    sinhala: "4 ශ්‍රේණිය",
    short: "Grade 4",
    badge: "Gr 4",
    icon: "🍀",
  },
  {
    value: "Grade 5",
    label: "Grade 5 (5 ශ්‍රේණිය)",
    sinhala: "5 ශ්‍රේණිය",
    short: "Grade 5",
    badge: "Gr 5",
    icon: "🎒",
  },
  {
    value: "Grade 6",
    label: "Grade 6 (6 ශ්‍රේණිය)",
    sinhala: "6 ශ්‍රේණිය",
    short: "Grade 6",
    badge: "Gr 6",
    icon: "📘",
  },
  {
    value: "Grade 7",
    label: "Grade 7 (7 ශ්‍රේණිය)",
    sinhala: "7 ශ්‍රේණිය",
    short: "Grade 7",
    badge: "Gr 7",
    icon: "📗",
  },
  {
    value: "Grade 8",
    label: "Grade 8 (8 ශ්‍රේණිය)",
    sinhala: "8 ශ්‍රේණිය",
    short: "Grade 8",
    badge: "Gr 8",
    icon: "📙",
  },
  {
    value: "Grade 9",
    label: "Grade 9 (9 ශ්‍රේණිය)",
    sinhala: "9 ශ්‍රේණිය",
    short: "Grade 9",
    badge: "Gr 9",
    icon: "📕",
  },
  {
    value: "Grade 10",
    label: "Grade 10 (10 ශ්‍රේණිය)",
    sinhala: "10 ශ්‍රේණිය",
    short: "Grade 10",
    badge: "Gr 10",
    icon: "📓",
  },
  {
    value: "Grade 11",
    label: "Grade 11 (11 ශ්‍රේණිය)",
    sinhala: "11 ශ්‍රේණිය",
    short: "Grade 11",
    badge: "Gr 11",
    icon: "📔",
  },
];

// Tier 1: Exam Levels & Secondary School Grades (Top Tier)
const LEVEL_CATEGORIES = [
  {
    id: "O/L",
    title: "සාමාන්‍ය පෙළ",
    sub: "(O/L)",
    label: "සාමාන්‍ය පෙළ (O/L)",
    shortLabel: "O/L",
  },
  {
    id: "A/L",
    title: "උසස් පෙළ",
    sub: "(A/L)",
    label: "උසස් පෙළ (A/L)",
    shortLabel: "A/L",
  },
  {
    id: "Grade 5",
    title: "ශිෂ්‍යත්වය",
    sub: "(Scholarship)",
    label: "ශිෂ්‍යත්වය (Scholarship)",
    shortLabel: "ශිෂ්‍යත්වය",
  },
  {
    id: "Grade 1-11",
    title: "1 - 11 ශ්‍රේණි",
    sub: "(Grades 1-11)",
    label: "1 - 11 ශ්‍රේණි (Grades 1-11)",
    shortLabel: "1 - 11 ශ්‍රේණි",
  },
];

// Tier 2: Sub-Tabs for National Exams: O/L, A/L, and Scholarship (Past Papers & Model Papers)
export const EXAM_SUB_TABS = [
  {
    id: "Past",
    label: "පසුගිය ප්‍රශ්න පත්‍ර (Past Papers)",
    shortLabel: "Pass Papers",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "Model",
    label: "ආදර්ශ ප්‍රශ්න පත්‍ර (Model Papers)",
    shortLabel: "Model Papers",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <circle cx="12" cy="12" r="5" strokeWidth={2} />
        <circle cx="12" cy="12" r="1.5" strokeWidth={2} fill="currentColor" />
      </svg>
    ),
  },
];

// Tier 2: Sub-Tabs for School Grades: 1 - 11 ශ්‍රේණි (Provincial Papers & Other Papers)
export const GRADE_SUB_TABS = [
  {
    id: "Provincial",
    label: "පළාත් විභාග ප්‍රශ්න පත්‍ර (Provincial Papers)",
    shortLabel: "Provincial Papers",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "Term",
    label: "වෙනත් ප්‍රශ්න පත්‍ර (Other Papers)",
    shortLabel: "වෙනත් ප්‍රශ්න පත්‍ර",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
];

// Helper to check if paper is a Provincial Department Paper
export const isProvincial = (paper) => {
  if (!paper) return false;
  const c = (paper.category || "").toLowerCase();
  const t = (paper.title || "").toLowerCase();
  const s = (paper.subject || "").toLowerCase();
  return (
    c === "provincial" ||
    c === "province" ||
    t.includes("provinc") ||
    t.includes("පළාත්") ||
    s.includes("පළාත්") ||
    t.includes("western") ||
    t.includes("central") ||
    t.includes("southern") ||
    t.includes("north western") ||
    t.includes("north central") ||
    t.includes("northern") ||
    t.includes("eastern") ||
    t.includes("uva") ||
    t.includes("sabaragamuwa") ||
    t.includes("බස්නාහිර") ||
    t.includes("දකුණු") ||
    t.includes("මධ්‍යම") ||
    t.includes("වයඹ") ||
    t.includes("උතුරු මැද") ||
    t.includes("ඌව") ||
    t.includes("සබරගමුව")
  );
};

// Helper to check if paper is Other / School Term Test / Evaluation Paper
export const isTermTest = (paper) => {
  if (!paper || isProvincial(paper)) return false;
  const c = (paper.category || "").toLowerCase();
  const t = (paper.title || "").toLowerCase();
  return (
    c === "other" ||
    c === "term" ||
    c === "term test" ||
    c === "school" ||
    t.includes("other") ||
    t.includes("වෙනත්") ||
    t.includes("term test") ||
    t.includes("1st term") ||
    t.includes("2nd term") ||
    t.includes("3rd term") ||
    t.includes("first term") ||
    t.includes("second term") ||
    t.includes("third term") ||
    t.includes("වාර") ||
    t.includes("වාර විභාග") ||
    t.includes("evaluation") ||
    t.includes("pre test") ||
    t.includes("assessment") ||
    t.includes("school")
  );
};

// Helper to check if paper is a Model Paper
export const isModel = (paper) => {
  if (!paper || isProvincial(paper)) return false;
  const c = (paper.category || "").toLowerCase();
  const t = (paper.title || "").toLowerCase();
  return c === "model" || t.includes("model") || t.includes("ආදර්ශ");
};

// Helper to extract Grade 1-11 badge if present
export const getPaperGrade = (paper) => {
  if (!paper) return null;
  if (paper.grade && typeof paper.grade === "string" && paper.grade.trim()) {
    return paper.grade.trim();
  }
  const text = `${paper.category || ""} ${paper.title || ""}`.toLowerCase();
  for (let g = 11; g >= 1; g--) {
    const reg = new RegExp(`(grade\\s*${g}\\b|${g}\\s*ශ්‍රේණිය)`, "i");
    if (reg.test(text)) {
      return `Grade ${g}`;
    }
  }
  return null;
};

// Helper to check if paper is an official National Exam paper (O/L, A/L, Scholarship)
export const isNationalExamPaper = (paper) => {
  if (!paper || isProvincial(paper) || isTermTest(paper)) return false;
  const c = (paper.category || "").toLowerCase();
  return c === "o/l" || c === "a/l" || c === "grade 5" || c === "scholarship";
};

// Helper to check if paper matches selected Paper Type / Sub-Tab
export const matchesPaperType = (paper, paperType, category = "O/L") => {
  if (paperType === "All") return true;

  if (category === "Grade 1-11" || category === "Grade 6-11" || category === "Junior") {
    if (paperType === "Provincial") {
      return isProvincial(paper);
    }
    if (paperType === "Term" || paperType === "Other") {
      return !isProvincial(paper);
    }
    return true;
  }

  // O/L, A/L, Grade 5
  if (paperType === "Model") {
    return isModel(paper) && !isProvincial(paper) && !isTermTest(paper);
  }
  if (paperType === "Past") {
    return !isModel(paper) && !isProvincial(paper) && !isTermTest(paper);
  }
  return true;
};

// Helper to check if paper matches selected Exam Level / Grade category
export const matchesLevel = (paper, level, selectedGrade = "All") => {
  if (level === "All") return true;
  const c = (paper.category || "").toLowerCase();
  const t = (paper.title || "").toLowerCase();

  const isProv = isProvincial(paper);
  const isOther = isTermTest(paper);

  if (level === "O/L") {
    if (isProv || isOther) return false;
    return (
      c === "o/l" ||
      ((c === "model" || isModel(paper)) &&
        (t.includes("o/l") || t.includes("ordinary level") || t.includes("සාමාන්‍ය පෙළ")))
    );
  }

  if (level === "A/L") {
    if (isProv || isOther) return false;
    return (
      c === "a/l" ||
      ((c === "model" || isModel(paper)) &&
        (t.includes("a/l") || t.includes("advanced level") || t.includes("උසස් පෙළ")))
    );
  }

  if (level === "Grade 5") {
    if (isProv || isOther) return false;
    return (
      c === "grade 5" ||
      c === "scholarship" ||
      ((c === "model" || isModel(paper)) &&
        (t.includes("grade 5") || t.includes("scholarship") || t.includes("ශිෂ්‍යත්ව")))
    );
  }

  if (
    level === "Grade 1-11" ||
    level === "Grade 6-11" ||
    level === "Grade 6-9" ||
    level === "Junior"
  ) {
    // Never allow official national exam past papers into Grade 1-11
    if (isNationalExamPaper(paper)) return false;

    // 1. All provincial papers belong to Grade 1-11
    if (isProv) {
      if (selectedGrade && selectedGrade !== "All") {
        const pGrade = getPaperGrade(paper);
        const gNum = selectedGrade.replace(/\D/g, "");
        const reg = new RegExp(`(grade\\s*${gNum}\\b|${gNum}\\s*ශ්‍රේණිය)`, "i");
        return (
          (pGrade && pGrade.toLowerCase().includes(selectedGrade.toLowerCase())) ||
          reg.test(t) ||
          (paper.grade && reg.test(paper.grade))
        );
      }
      return true;
    }

    // 2. All school term test / other papers belong to Grade 1-11
    if (isOther) {
      if (selectedGrade && selectedGrade !== "All") {
        const pGrade = getPaperGrade(paper);
        const gNum = selectedGrade.replace(/\D/g, "");
        const reg = new RegExp(`(grade\\s*${gNum}\\b|${gNum}\\s*ශ්‍රේණිය)`, "i");
        return (
          (pGrade && pGrade.toLowerCase().includes(selectedGrade.toLowerCase())) ||
          reg.test(t) ||
          (paper.grade && reg.test(paper.grade))
        );
      }
      return true;
    }

    // 3. Any paper explicitly for Grades 1 to 11
    const pGrade = getPaperGrade(paper);
    if (pGrade) {
      if (selectedGrade && selectedGrade !== "All") {
        return pGrade.toLowerCase().includes(selectedGrade.toLowerCase());
      }
      return true;
    }

    return false;
  }

  return false;
};


// Helper to determine or auto-detect A/L Stream
export const getPaperStream = (paper) => {
  if (paper.stream && typeof paper.stream === "string" && paper.stream.trim()) {
    return paper.stream.trim();
  }

  const s = `${paper.subject || ""} ${paper.title || ""}`.toLowerCase();

  // 1. Physical Science (Combined Maths / Physics)
  if (
    s.includes("combined maths") ||
    s.includes("combined mathematics") ||
    s.includes("com maths") ||
    s.includes("සංයුක්ත ගණිතය") ||
    s.includes("physics") ||
    s.includes("භෞතික විද්‍යා") ||
    s.includes("භෞතික") ||
    s.includes("physical science")
  ) {
    return "Physical Science";
  }

  // 2. Biological Science (Biology / Chemistry / Agriculture)
  if (
    s.includes("biology") ||
    s.includes("ජීව විද්‍යා") ||
    s.includes("chemistry") ||
    s.includes("රසායන විද්‍යා") ||
    s.includes("agricultural science") ||
    s.includes("agriculture") ||
    s.includes("කෘෂි විද්‍යා") ||
    s.includes("කෘෂිකර්ම") ||
    s.includes("bio science") ||
    s.includes("biological science")
  ) {
    return "Biological Science";
  }

  // 3. Commerce (Accounting / Business Studies / Economics)
  if (
    s.includes("accounting") ||
    s.includes("ගිණුම්කරණ") ||
    s.includes("ගිණුම්") ||
    s.includes("business studies") ||
    s.includes("ව්‍යාපාර අධ්‍යයන") ||
    s.includes("economics") ||
    s.includes("econ") ||
    s.includes("ආර්ථික විද්‍යා") ||
    s.includes("commerce") ||
    s.includes("වාණිජ")
  ) {
    return "Commerce";
  }

  // 4. Technology (ET / BST / SFT / ICT)
  if (
    s.includes("technology") ||
    s.includes("තාක්ෂණවේද") ||
    s.includes("engineering tech") ||
    s.includes("ඉංජිනේරු තාක්ෂණ") ||
    s.includes("et") ||
    s.includes("bio systems") ||
    s.includes("ජෛව පද්ධති") ||
    s.includes("bst") ||
    s.includes("science for tech") ||
    s.includes("sft") ||
    s.includes("information & comm") ||
    s.includes("information tech") ||
    s.includes("ict")
  ) {
    return "Technology";
  }

  // 5. Arts (Languages, History, Logic, Political Science, Buddhist Civilization, Media, etc.)
  if (
    s.includes("political") ||
    s.includes("දේශපාලන") ||
    s.includes("logic") ||
    s.includes("තර්ක ශාස්ත්‍ර") ||
    s.includes("තර්ක") ||
    s.includes("history") ||
    s.includes("ඉතිහාස") ||
    s.includes("geography") ||
    s.includes("භූගෝල") ||
    s.includes("sinhala lit") ||
    s.includes("සිංහල සාහිත්‍ය") ||
    s.includes("buddhist civ") ||
    s.includes("බෞද්ධ ශිෂ්ට") ||
    s.includes("christian civ") ||
    s.includes("media") ||
    s.includes("සන්නිවේදන") ||
    s.includes("drama") ||
    s.includes("නාට්‍ය") ||
    s.includes("music") ||
    s.includes("සංගීත") ||
    s.includes("art") ||
    s.includes("චිත්‍ර කලාව") ||
    s.includes("dancing") ||
    s.includes("නර්තන") ||
    s.includes("language") ||
    s.includes("කලා")
  ) {
    return "Arts";
  }

  // 6. Common General (General English, GIT, General Knowledge)
  if (
    s.includes("general english") ||
    s.includes("common general") ||
    s.includes("git") ||
    s.includes("general info") ||
    s.includes("සාමාන්‍ය දැනීම") ||
    s.includes("පොදු පරීක්ෂණ")
  ) {
    return "Common General";
  }

  return null;
};

// Helper for Stream Badge styling
export const getStreamBadgeConfig = (stream) => {
  if (!stream) return null;
  const s = stream.toLowerCase();

  if (s.includes("math") || s.includes("physical")) {
    return {
      label: "Physical Science",
      sinhala: "භෞතික විද්‍යා",
      icon: "📐",
      className: "bg-blue-50/90 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/90 dark:border-blue-800/60",
      dotColor: "bg-blue-500",
    };
  }
  if (s.includes("bio")) {
    return {
      label: "Biological Science",
      sinhala: "ජීව විද්‍යා",
      icon: "🔬",
      className: "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800/60",
      dotColor: "bg-emerald-500",
    };
  }
  if (s.includes("commerc") || s.includes("account") || s.includes("business")) {
    return {
      label: "Commerce",
      sinhala: "වාණිජ",
      icon: "📊",
      className: "bg-amber-50/90 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/90 dark:border-amber-800/60",
      dotColor: "bg-amber-500",
    };
  }
  if (s.includes("tech") || s.includes("engineering") || s.includes("bst") || s.includes("sft") || s.includes("et")) {
    return {
      label: "Technology",
      sinhala: "තාක්ෂණවේදය",
      icon: "⚙️",
      className: "bg-purple-50/90 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/90 dark:border-purple-800/60",
      dotColor: "bg-purple-500",
    };
  }
  if (s.includes("art") || s.includes("logic") || s.includes("polit") || s.includes("history")) {
    return {
      label: "Arts",
      sinhala: "කලා",
      icon: "🎨",
      className: "bg-rose-50/90 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/90 dark:border-rose-800/60",
      dotColor: "bg-rose-500",
    };
  }
  if (s.includes("general") || s.includes("common") || s.includes("git")) {
    return {
      label: "Common General",
      sinhala: "පොදු සාමාන්‍ය",
      icon: "🌐",
      className: "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300/80 dark:border-slate-700/80",
      dotColor: "bg-slate-400",
    };
  }
  return {
    label: stream,
    sinhala: stream,
    icon: "📚",
    className: "bg-indigo-50/90 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-800/60",
    dotColor: "bg-indigo-500",
  };
};

// Helper function to check if paper includes answers
const checkHasAnswers = (paper) => {
  if (paper.has_answers === true || paper.has_answers === "true") return true;
  if (!paper.title) return false;
  const t = paper.title.toLowerCase();
  return (
    t.includes("with answers") ||
    t.includes("answers") ||
    t.includes("marking scheme") ||
    t.includes("පිළිතුරු")
  );
};

export default function PapersGallery({ initialPapers = [] }) {
  const [papers, setPapers] = useState(initialPapers);
  const [selectedCategory, setSelectedCategory] = useState("O/L");
  const [selectedPaperType, setSelectedPaperType] = useState("Past");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [alStreamDropdownOpen, setAlStreamDropdownOpen] = useState(false);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const yearDropdownRef = useRef(null);
  const alStreamDropdownRef = useRef(null);
  const gradeDropdownRef = useRef(null);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target)) {
        setYearDropdownOpen(false);
      }
      if (alStreamDropdownRef.current && !alStreamDropdownRef.current.contains(e.target)) {
        setAlStreamDropdownOpen(false);
      }
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(e.target)) {
        setGradeDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setYearDropdownOpen(false);
        setAlStreamDropdownOpen(false);
        setGradeDropdownOpen(false);
      }
    };

    if (yearDropdownOpen || alStreamDropdownOpen || gradeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [yearDropdownOpen, alStreamDropdownOpen, gradeDropdownOpen]);
  const [searchQuery, setSearchQuery] = useState("");

  // Infinite Scroll Pagination State
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  // Auth / Modal State
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPaper, setPendingPaper] = useState(null);
  const [viewingPaper, setViewingPaper] = useState(null);

  // Paper Request & Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackInitialTab, setFeedbackInitialTab] = useState("request");
  const [feedbackInitialSubject, setFeedbackInitialSubject] = useState("");

  // Sync user with localStorage
  const loadUser = () => {
    try {
      const stored = localStorage.getItem("desh_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdate = () => loadUser();
    window.addEventListener("storage", handleUserUpdate);
    window.addEventListener("desh_user_updated", handleUserUpdate);

    // Sync search query with Navbar search bar
    const handleNavbarSearch = (e) => {
      setSearchQuery(e.detail || "");
    };
    window.addEventListener("desh_search_query", handleNavbarSearch);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("desh_user_updated", handleUserUpdate);
      window.removeEventListener("desh_search_query", handleNavbarSearch);
    };
  }, []);

  // Reset infinite scroll count when any filter or search changes
  useEffect(() => {
    setVisibleCount(15);
  }, [selectedCategory, selectedPaperType, selectedYear, selectedStream, selectedGrade, searchQuery]);

  // Compute unique years from papers
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        papers
          .map((p) => p.year)
          .filter(Boolean)
      )
    ).sort((a, b) => Number(b) - Number(a));
    return ["All", ...years];
  }, [papers]);

  // Category select handler (O/L, A/L, Grade 5, Grade 1-11)
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setAlStreamDropdownOpen(false);
    setGradeDropdownOpen(false);

    // Synchronize sub-tab based on category
    if (catId === "Grade 1-11" || catId === "Grade 6-11") {
      if (selectedPaperType !== "Provincial" && selectedPaperType !== "Term") {
        setSelectedPaperType("Provincial");
      }
    } else {
      if (selectedPaperType !== "Past" && selectedPaperType !== "Model") {
        setSelectedPaperType("Past");
      }
    }
  };

  // Determine which sub-tabs to show in Row 2 (Bottom Tier)
  const currentSubTabs =
    selectedCategory === "Grade 1-11" || selectedCategory === "Grade 6-11"
      ? GRADE_SUB_TABS
      : EXAM_SUB_TABS;

  // Dynamic counts for Sub-Tabs (Past/Model or Provincial/Term) matching current Level, Stream, Grade, and Year
  const typeCounts = useMemo(() => {
    const counts = { Past: 0, Model: 0, Provincial: 0, Term: 0 };

    papers.forEach((paper) => {
      if (!matchesLevel(paper, selectedCategory, selectedGrade)) return;

      // Filter counts by Stream when in A/L
      if (selectedCategory === "A/L" && selectedStream !== "All") {
        const paperStream = getPaperStream(paper);
        if (paperStream !== selectedStream) return;
      }

      if (selectedYear !== "All" && paper.year?.toString() !== selectedYear.toString()) return;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          paper.title?.toLowerCase().includes(q) ||
          paper.subject?.toLowerCase().includes(q) ||
          paper.year?.toString().includes(q);
        if (!match) return;
      }

      if (selectedCategory === "Grade 1-11" || selectedCategory === "Grade 6-11") {
        if (isProvincial(paper)) counts.Provincial++;
        else counts.Term++;
      } else {
        if (isModel(paper)) counts.Model++;
        else counts.Past++;
      }
    });
    return counts;
  }, [papers, selectedCategory, selectedStream, selectedGrade, selectedYear, searchQuery]);

  // Filtered papers (matching Level, Stream for A/L, Grade for Grade 1-11, Sub-Tab Type, Year, and Search Query)
  const filteredPapers = useMemo(() => {
    const isSearching = Boolean(searchQuery.trim());
    const query = searchQuery.toLowerCase().trim();

    const list = papers.filter((paper) => {
      const matchesSearch =
        !query ||
        paper.title?.toLowerCase().includes(query) ||
        paper.subject?.toLowerCase().includes(query) ||
        paper.year?.toString().includes(query);

      // When searching by keyword across all papers, don't restrict to current category/type unless matched
      const matchesCat = isSearching ? true : matchesLevel(paper, selectedCategory, selectedGrade);

      // Sub-tab type matching (Past/Model for O/L, A/L, Grade 5; Provincial/Term for Grade 1-11)
      const matchesType =
        isSearching || selectedCategory === "All" || selectedPaperType === "All"
          ? true
          : matchesPaperType(paper, selectedPaperType, selectedCategory);

      // Filter by Stream for A/L (only when not globally searching)
      if (!isSearching && selectedCategory === "A/L" && selectedStream !== "All") {
        const paperStream = getPaperStream(paper);
        if (paperStream !== selectedStream) return false;
      }

      const matchesYr =
        selectedYear === "All" ||
        paper.year?.toString() === selectedYear.toString();

      return matchesCat && matchesType && matchesYr && matchesSearch;
    });

    // Sort papers: Year descending first, then A/L Stream & Subject (A-Z), and O/L subjects alphabetically (A-Z)
    return list.sort((a, b) => {
      const yA = Number(a.year) || 0;
      const yB = Number(b.year) || 0;
      if (yB !== yA) return yB - yA;

      const isA_AL = selectedCategory === "A/L" || matchesLevel(a, "A/L");
      const isB_AL = selectedCategory === "A/L" || matchesLevel(b, "A/L");

      // 1. For A/L papers: 1. Stream-wise Alphabetical (A-Z), 2. Subject-wise Alphabetical (A-Z)
      if (isA_AL && isB_AL) {
        const streamA = getPaperStream(a) || "Other";
        const streamB = getPaperStream(b) || "Other";
        const streamCmp = streamA.localeCompare(streamB, undefined, { sensitivity: "base", numeric: true });
        if (streamCmp !== 0) return streamCmp;

        const subA = (a.subject || a.title || "").trim();
        const subB = (b.subject || b.title || "").trim();
        const subCmp = subA.localeCompare(subB, undefined, { sensitivity: "base", numeric: true });
        if (subCmp !== 0) return subCmp;
      }

      // 2. For O/L papers, sort alphabetically by subject name (A to Z)
      if (selectedCategory === "O/L" || (matchesLevel(a, "O/L") && matchesLevel(b, "O/L"))) {
        const subA = (a.subject || a.title || "").trim();
        const subB = (b.subject || b.title || "").trim();
        const cmp = subA.localeCompare(subB, undefined, { sensitivity: "base", numeric: true });
        if (cmp !== 0) return cmp;
      }

      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [papers, selectedCategory, selectedPaperType, selectedYear, selectedStream, selectedGrade, searchQuery]);

  // Infinite Scroll: Intersection Observer to reveal papers in batches of 15
  useEffect(() => {
    if (visibleCount >= filteredPapers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 15, filteredPapers.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: "250px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [visibleCount, filteredPapers.length]);

  // Listen for global notification events (View paper, Download paper, Open request modal)
  useEffect(() => {
    const handleViewEvent = (e) => {
      if (e.detail) setViewingPaper(e.detail);
    };
    const handleDownloadEvent = (e) => {
      if (e.detail) handleDownloadClick(e.detail);
    };
    const handleOpenRequestEvent = () => {
      setFeedbackInitialTab("request");
      setFeedbackInitialSubject("");
      setFeedbackModalOpen(true);
    };

    window.addEventListener("desh_view_paper", handleViewEvent);
    window.addEventListener("desh_download_paper", handleDownloadEvent);
    window.addEventListener("desh_open_request_modal", handleOpenRequestEvent);

    return () => {
      window.removeEventListener("desh_view_paper", handleViewEvent);
      window.removeEventListener("desh_download_paper", handleDownloadEvent);
      window.removeEventListener("desh_open_request_modal", handleOpenRequestEvent);
    };
  }, [papers, currentUser]);

  // Papers slice currently visible in the DOM
  const visiblePapers = useMemo(() => {
    return filteredPapers.slice(0, visibleCount);
  }, [filteredPapers, visibleCount]);

  // Group visible papers into a Year-by-Year Timeline in descending order (2026, 2025, 2024...)
  const timelineGroups = useMemo(() => {
    const grouped = {};

    // Sort papers descending by year, then A/L Stream & Subject (A-Z), and O/L Subject (A-Z)
    const sorted = [...visiblePapers].sort((a, b) => {
      const yA = Number(a.year) || 0;
      const yB = Number(b.year) || 0;
      if (yB !== yA) return yB - yA;

      const isA_AL = selectedCategory === "A/L" || matchesLevel(a, "A/L");
      const isB_AL = selectedCategory === "A/L" || matchesLevel(b, "A/L");

      // 1. For A/L papers: 1. Stream-wise Alphabetical (A-Z), 2. Subject-wise Alphabetical (A-Z)
      if (isA_AL && isB_AL) {
        const streamA = getPaperStream(a) || "Other";
        const streamB = getPaperStream(b) || "Other";
        const streamCmp = streamA.localeCompare(streamB, undefined, { sensitivity: "base", numeric: true });
        if (streamCmp !== 0) return streamCmp;

        const subA = (a.subject || a.title || "").trim();
        const subB = (b.subject || b.title || "").trim();
        const subCmp = subA.localeCompare(subB, undefined, { sensitivity: "base", numeric: true });
        if (subCmp !== 0) return subCmp;
      }

      // 2. When O/L, sort alphabetically (A-Z) by subject within the year
      if (selectedCategory === "O/L" || (matchesLevel(a, "O/L") && matchesLevel(b, "O/L"))) {
        const subA = (a.subject || a.title || "").trim();
        const subB = (b.subject || b.title || "").trim();
        const cmp = subA.localeCompare(subB, undefined, { sensitivity: "base", numeric: true });
        if (cmp !== 0) return cmp;
      }

      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    sorted.forEach((paper) => {
      const yr = paper.year ? paper.year.toString() : "Other";
      if (!grouped[yr]) {
        grouped[yr] = [];
      }
      grouped[yr].push(paper);
    });

    // Ensure strictly descending order
    const sortedYearKeys = Object.keys(grouped).sort((a, b) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return Number(b) - Number(a);
    });

    return sortedYearKeys.map((year) => ({
      year,
      papers: grouped[year],
    }));
  }, [visiblePapers, selectedCategory]);

  // Handle Download Click
  const handleDownloadClick = (paper) => {
    let user = currentUser;
    if (!user) {
      try {
        const stored = localStorage.getItem("desh_user");
        if (stored) {
          user = JSON.parse(stored);
          setCurrentUser(user);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (user && (user.whatsapp_number || user.whatsapp)) {
      triggerDownload(paper);
    } else {
      setPendingPaper(paper);
      setModalOpen(true);
    }
  };

  const triggerDownload = (paper) => {
    if (!paper?.file_url) return;
    window.open(paper.file_url, "_blank");

    // Increment count optimistically in UI
    if (paper.id) {
      setPapers((prev) =>
        prev.map((p) =>
          p.id === paper.id
            ? { ...p, download_count: (p.download_count || 0) + 1 }
            : p
        )
      );

      // Increment in database in background
      fetch("/api/papers/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id }),
      }).catch((e) => console.warn("Failed to record download count:", e));
    }
  };

  const handleModalSuccess = (savedUser) => {
    setCurrentUser(savedUser);
    setModalOpen(false);
    if (pendingPaper) {
      triggerDownload(pendingPaper);
    }
    setPendingPaper(null);
  };

  // Category badge styling
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "A/L":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/40";
      case "O/L":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/40";
      case "Grade 5":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/40";
      case "Provincial":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/40";
      case "Model":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/40";
      case "Other":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/40";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60";
    }
  };

  return (
    <div className="w-full">
      {/* 1. TOP HERO WITH BOOKS BACKGROUND DESIGN (Seamless & Fixed) */}
      <div className="relative overflow-visible z-20 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-blue-950/20 dark:to-transparent pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Books & Library Background Art */}
        <SearchBooksBackground />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* ================= Unified Merged 2-Tier Selection Frame (Matching Gallery Card Roundness: rounded-xl sm:rounded-2xl) ================= */}
          <div className="w-full max-w-4xl mx-auto rounded-xl sm:rounded-2xl border border-blue-500/50 dark:border-blue-400/35 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-xl shadow-blue-500/10 dark:shadow-black/70 relative mt-3 sm:mt-5 transition-all duration-300">
            {/* Subtle top inner glow highlight */}
            <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

            {/* Row 1: Top Tier (5 Columns: O/L, A/L, Scholarship, Grades 1-11, All Years - 2 Lines Per Tab) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-blue-500/30 dark:divide-blue-400/20 border-b border-blue-500/40 dark:border-blue-400/30 bg-slate-50/80 dark:bg-slate-950/60 rounded-t-xl sm:rounded-t-2xl relative z-20">
              {LEVEL_CATEGORIES.map((cat, idx) => {
                const isActive = selectedCategory === cat.id;

                // Special handling for A/L to include Stream Dropdown (2-Line layout)
                if (cat.id === "A/L") {
                  const currentStreamObj = STREAM_OPTIONS.find((s) => s.value === selectedStream);

                  return (
                    <div key={cat.id} ref={alStreamDropdownRef} className="relative sm:flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectCategory("A/L");
                          setAlStreamDropdownOpen((prev) => !prev);
                          setGradeDropdownOpen(false);
                          setYearDropdownOpen(false);
                        }}
                        className={`w-full min-h-[56px] sm:min-h-[62px] flex flex-col items-center justify-center gap-0.5 px-2 py-2 sm:py-2.5 text-center leading-tight transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black relative z-20 -mb-[1px] sm:-mb-[2px] shadow-sm rounded-tr-xl sm:rounded-tr-none"
                            : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-xs sm:text-[13px] font-bold sm:font-extrabold whitespace-nowrap leading-tight">
                          උසස් පෙළ
                        </span>
                        <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold sm:font-bold opacity-90 leading-tight">
                          <span className="truncate max-w-[85px] sm:max-w-none">
                            {selectedStream === "All"
                              ? "(A/L)"
                              : currentStreamObj?.short || selectedStream}
                          </span>
                          <svg
                            className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                              alStreamDropdownOpen ? "rotate-180" : ""
                            } ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      {/* A/L Stream Dropdown Menu (Floating Glass Popover) */}
                      {alStreamDropdownOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[260px] sm:min-w-[300px] w-max max-w-xs sm:max-w-md z-50 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-none border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/20 dark:shadow-black/70 animate-in fade-in-0 zoom-in-95 duration-150 origin-top overflow-hidden text-left">
                          <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent pointer-events-none" />

                          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                            <span>A/L විෂය ධාරාව (Stream)</span>
                            {selectedStream !== "All" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStream("All");
                                }}
                                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer lowercase font-medium text-[10px]"
                              >
                                reset
                              </button>
                            )}
                          </div>

                          <div className="max-h-64 overflow-y-auto space-y-1 p-0.5 custom-scrollbar mt-1">
                            {STREAM_OPTIONS.map((str) => {
                              const isSelected = selectedStream === str.value;
                              return (
                                <button
                                  key={str.value}
                                  type="button"
                                  onClick={() => {
                                    handleSelectCategory("A/L");
                                    setSelectedStream(str.value);
                                    setAlStreamDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-none text-xs font-bold transition-all cursor-pointer text-left select-none ${
                                    isSelected
                                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/30 font-black"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate min-w-0">
                                    <span className="text-base shrink-0">{str.icon}</span>
                                    <div className="truncate min-w-0">
                                      <div className="truncate font-bold leading-tight">{str.label}</div>
                                      <div
                                        className={`text-[10px] leading-tight truncate ${
                                          isSelected ? "text-purple-100" : "text-slate-400 dark:text-slate-500"
                                        }`}
                                      >
                                        {str.sinhala}
                                      </div>
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <svg
                                      className="w-3.5 h-3.5 shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Special handling for Grade 1-11 to include Grade Dropdown (2-Line layout)
                if (cat.id === "Grade 1-11" || cat.id === "Grade 6-11") {
                  const currentGradeObj = GRADE_OPTIONS.find((g) => g.value === selectedGrade);

                  return (
                    <div key={cat.id} ref={gradeDropdownRef} className="relative sm:flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectCategory("Grade 1-11");
                          setGradeDropdownOpen((prev) => !prev);
                          setAlStreamDropdownOpen(false);
                          setYearDropdownOpen(false);
                        }}
                        className={`w-full min-h-[56px] sm:min-h-[62px] flex flex-col items-center justify-center gap-0.5 px-2 py-2 sm:py-2.5 text-center leading-tight transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black relative z-20 -mb-[1px] sm:-mb-[2px] shadow-sm"
                            : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-xs sm:text-[13px] font-bold sm:font-extrabold whitespace-nowrap leading-tight">
                          1 - 11 ශ්‍රේණි
                        </span>
                        <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold sm:font-bold opacity-90 leading-tight">
                          <span className="truncate max-w-[85px] sm:max-w-none">
                            {selectedGrade === "All"
                              ? "(Grades 1-11)"
                              : currentGradeObj?.short || selectedGrade}
                          </span>
                          <svg
                            className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                              gradeDropdownOpen ? "rotate-180" : ""
                            } ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      {/* Grade 1-11 Dropdown Menu (Floating Glass Popover) */}
                      {gradeDropdownOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[240px] sm:min-w-[280px] w-max max-w-xs sm:max-w-md z-50 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-none border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/20 dark:shadow-black/70 animate-in fade-in-0 zoom-in-95 duration-150 origin-top overflow-hidden text-left">
                          <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />

                          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                            <span>ශ්‍රේණිය තෝරන්න (Select Grade)</span>
                            {selectedGrade !== "All" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGrade("All");
                                }}
                                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer lowercase font-medium text-[10px]"
                              >
                                reset
                              </button>
                            )}
                          </div>

                          <div className="max-h-64 overflow-y-auto space-y-1 p-0.5 custom-scrollbar mt-1">
                            {GRADE_OPTIONS.map((gr) => {
                              const isSelected = selectedGrade === gr.value;
                              return (
                                <button
                                  key={gr.value}
                                  type="button"
                                  onClick={() => {
                                    handleSelectCategory("Grade 1-11");
                                    setSelectedGrade(gr.value);
                                    setGradeDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-none text-xs font-bold transition-all cursor-pointer text-left select-none ${
                                    isSelected
                                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30 font-black"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate min-w-0">
                                    <span className="text-base shrink-0">{gr.icon}</span>
                                    <div className="truncate min-w-0">
                                      <div className="truncate font-bold leading-tight">{gr.label}</div>
                                      <div
                                        className={`text-[10px] leading-tight truncate ${
                                          isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                                        }`}
                                      >
                                        {gr.sinhala}
                                      </div>
                                    </div>
                                  </div>

                                  {isSelected && (
                                    <svg
                                      className="w-3.5 h-3.5 shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard 2-Line buttons for O/L and Grade 5 (Scholarship)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full min-h-[56px] sm:min-h-[62px] flex flex-col items-center justify-center gap-0.5 px-2 py-2 sm:py-2.5 text-center leading-tight sm:flex-1 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black relative z-20 -mb-[1px] sm:-mb-[2px] shadow-sm"
                        : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-slate-800/60"
                    } ${idx === 0 ? "rounded-tl-xl sm:rounded-tl-2xl" : ""}`}
                  >
                    <span className="text-xs sm:text-[13px] font-bold sm:font-extrabold whitespace-nowrap leading-tight">
                      {cat.title || cat.label}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold sm:font-bold opacity-90 whitespace-nowrap leading-tight">
                      {cat.sub || `(${cat.shortLabel})`}
                    </span>
                  </button>
                );
              })}

              {/* Year Selector integrated as 5th column in Row 1 (2-Line layout) */}
              <div ref={yearDropdownRef} className="relative col-span-2 sm:col-span-1 sm:flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setYearDropdownOpen((prev) => !prev);
                    setAlStreamDropdownOpen(false);
                    setGradeDropdownOpen(false);
                  }}
                  className={`w-full min-h-[56px] sm:min-h-[62px] flex flex-col items-center justify-center gap-0.5 px-2 py-2 sm:py-2.5 text-center leading-tight transition-all duration-200 cursor-pointer rounded-tr-none sm:rounded-tr-2xl ${
                    selectedYear !== "All"
                      ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black"
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="text-xs sm:text-[13px] font-bold sm:font-extrabold whitespace-nowrap leading-tight">
                    සියලුම වසර
                  </span>
                  <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold sm:font-bold opacity-90 leading-tight">
                    <span className="truncate max-w-[85px] sm:max-w-none">
                      {selectedYear === "All" ? "(All Years)" : `${selectedYear} විභාග`}
                    </span>
                    <svg
                      className={`w-3 h-3 shrink-0 transition-transform duration-200 ${
                        yearDropdownOpen ? "rotate-180" : ""
                      } ${selectedYear !== "All" ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Year Dropdown Menu (Floating Glass Popover) */}
                {yearDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[210px] w-max max-w-xs sm:max-w-sm z-50 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-none border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/20 dark:shadow-black/70 animate-in fade-in-0 zoom-in-95 duration-150 origin-top overflow-hidden text-left">
                    <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

                    <div className="max-h-60 overflow-y-auto space-y-1 p-0.5 custom-scrollbar">
                      {availableYears.map((yr) => {
                        const isSelected = selectedYear === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setSelectedYear(yr);
                              setYearDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-none text-xs font-bold transition-all cursor-pointer text-left select-none ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30 font-black"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate min-w-0">
                              <span className="truncate">
                                {yr === "All" ? "සියලුම වසර (All Years)" : `${yr} විභාග`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {yr === "2026" && (
                                <span
                                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                  }`}
                                >
                                  New
                                </span>
                              )}
                              {isSelected && (
                                <svg
                                  className="w-3.5 h-3.5 shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Bottom Tier (2 Equal Columns: 50% / 50% with Distinct Rich Violet / Purple Gradient) */}
            <div
              key={selectedCategory === "Grade 1-11" || selectedCategory === "Grade 6-11" ? "grade-tabs" : "exam-tabs"}
              className="grid grid-cols-2 divide-x divide-blue-500/30 dark:divide-blue-400/20 bg-white/40 dark:bg-slate-900/40 rounded-b-xl sm:rounded-b-2xl relative z-10 transition-all duration-300"
            >
              {currentSubTabs.map((type, idx) => {
                const isActive = selectedPaperType === type.id;
                const count = typeCounts[type.id] || 0;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedPaperType(type.id)}
                    className={`w-full min-h-[46px] sm:min-h-[50px] flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none leading-tight ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black relative z-20 -mt-[1px] sm:-mt-[2px] shadow-md shadow-purple-500/25"
                        : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/80 dark:hover:bg-slate-800/60"
                    } ${idx === 0 ? "rounded-bl-xl sm:rounded-bl-2xl" : "rounded-br-xl sm:rounded-br-2xl"}`}
                  >
                    <span className={`shrink-0 ${isActive ? "text-white" : "text-violet-500 dark:text-violet-400"}`}>
                      {type.icon}
                    </span>
                    <span className="hidden sm:inline whitespace-nowrap">{type.label}</span>
                    <span className="sm:hidden font-extrabold whitespace-nowrap">{type.shortLabel}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white border border-white/30 backdrop-blur-xs"
                          : "bg-slate-200/80 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border border-slate-300/50 dark:border-white/5"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PAPERS SECTION: ATTRACTIVE YEAR-BY-YEAR TIMELINE */}
      <section id="papers-section" className="pt-3 sm:pt-4 pb-12 max-w-[99.2%] 2xl:max-w-[99.5%] mx-auto px-3 sm:px-6 relative">
        {/* Timeline Content */}
        {timelineGroups.length > 0 ? (
          <div className="relative space-y-10 sm:space-y-12">
            {/* Glowing Vertical Timeline Spine (Desktop / Tablet) */}
            <div className="hidden sm:block absolute left-5 lg:left-6 top-6 bottom-10 w-1 bg-gradient-to-b from-cyan-500 via-blue-600 to-indigo-600 rounded-full opacity-40 dark:opacity-30 pointer-events-none" />

            {/* Year Groups Loop */}
            {timelineGroups.map((group) => {
              const is2026 = group.year === "2026";

              return (
                <div
                  key={group.year}
                  id={`timeline-year-${group.year}`}
                  className="relative sm:pl-16 lg:pl-20 scroll-mt-32 transition-all duration-300"
                >
                  {/* Timeline Milestone Node (Anchored to vertical line - No Blinking) */}
                  <div className="sm:absolute sm:left-0 sm:top-0 mb-3 sm:mb-0 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center font-black text-xs lg:text-sm shadow-md transition-all shrink-0 ${
                        is2026
                          ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 ring-4 ring-white dark:ring-slate-950"
                          : "bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-blue-500/20 ring-4 ring-white dark:ring-slate-950"
                      }`}
                    >
                      {is2026 ? "✨" : group.year.length === 4 ? group.year.slice(2) : "📅"}
                    </div>

                    {/* Mobile-only Year Title (next to milestone) */}
                    <div className="sm:hidden flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {group.year} විභාග ප්‍රශ්න පත්‍ර
                      </h3>
                      {is2026 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Year Header Bar */}
                  <div className="hidden sm:flex items-center justify-between gap-4 pb-2.5 mb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>{group.year} විභාග ප්‍රශ්න පත්‍ර</span>
                      </h3>

                      {is2026 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">
                          ✨ Latest • අලුත්ම එකතුව
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                        {group.papers.length} {group.papers.length === 1 ? "Paper" : "Papers"}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Year Milestone #{group.year}
                    </span>
                  </div>

                  {/* Cards Grid for this Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {group.papers.map((paper) => {
                      const isAL =
                        selectedCategory === "A/L" ||
                        paper.category === "A/L" ||
                        matchesLevel(paper, "A/L");
                      const paperStream = isAL ? getPaperStream(paper) : null;
                      const streamBadge = paperStream
                        ? getStreamBadgeConfig(paperStream)
                        : null;
                      const paperGrade = getPaperGrade(paper);

                      return (
                        <div
                          key={paper.id || paper.file_url}
                          className="group relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200 p-3 sm:p-3.5 flex flex-col justify-between"
                        >
                          <div>
                            {/* Top Bar: Category on Left, Stream (for A/L), Grade (for 6-9), Year on Right */}
                            <div className="flex items-center justify-between gap-1.5 mb-2">
                              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadge(
                                    paper.category
                                  )}`}
                                >
                                  {paper.category === "Other" ? "වෙනත් (Other)" : paper.category || "General"}
                                </span>

                                {/* Stream Badge for A/L papers */}
                                {streamBadge && (
                                  <span
                                    className={`inline-flex items-center gap-1 text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border shadow-2xs max-w-[145px] sm:max-w-none truncate ${streamBadge.className}`}
                                    title={`විෂය ධාරාව: ${streamBadge.label} (${streamBadge.sinhala})`}
                                  >
                                    <span className="text-[10.5px] leading-none shrink-0">{streamBadge.icon}</span>
                                    <span className="truncate">{streamBadge.label}</span>
                                  </span>
                                )}

                                {/* Grade Badge for School (Grades 1-11) papers */}
                                {paperGrade && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border shadow-2xs bg-amber-50/90 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/90 dark:border-amber-800/60"
                                    title={`ශ්‍රේණිය: ${paperGrade}`}
                                  >
                                    <span className="text-[10px] leading-none shrink-0">
                                      {GRADE_OPTIONS.find((g) => g.value === paperGrade)?.icon || "📚"}
                                    </span>
                                    <span>{paperGrade}</span>
                                  </span>
                                )}
                              </div>

                              <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                                {paper.year}
                              </span>
                            </div>

                          {/* Highlighted & Centered Subject Name */}
                          {paper.subject && (
                            <div className="my-2.5 flex items-center justify-center">
                              <div className="w-full text-center py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-blue-50/90 dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-blue-950/60 border border-blue-200/90 dark:border-blue-800/70 shadow-2xs group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:shadow-xs transition-all">
                                <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 drop-shadow-xs truncate block">
                                  {paper.subject}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Title */}
                          <h4 className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                            {paper.title}
                          </h4>

                          {/* With Answers Badge */}
                          {checkHasAnswers(paper) && (
                            <div className="mt-1.5 flex items-center">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-800/80 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>With Answers (පිළිතුරු සහිතයි)</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer / View & Download Actions */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                              </svg>
                              <span className="hidden sm:inline">PDF</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* View / Preview Button */}
                            <button
                              type="button"
                              onClick={() => setViewingPaper(paper)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all cursor-pointer"
                              title="View Paper in Modal"
                            >
                              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View</span>
                            </button>

                            {/* Download Button */}
                            <button
                              type="button"
                              onClick={() => handleDownloadClick(paper)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-2xs hover:shadow-blue-500/20 transition-all cursor-pointer"
                              title="Download PDF"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              );
            })}

            {/* Infinite Scroll Sentinel & Loader */}
            {visibleCount < filteredPapers.length ? (
              <div ref={loadMoreRef} className="py-8 flex flex-col items-center justify-center gap-2.5">
                <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse">
                  තවත් ප්‍රශ්න පත්‍ර පූරණය වෙමින් පවතී... (Loading more papers)
                </p>
              </div>
            ) : filteredPapers.length > 15 ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200/80 dark:border-slate-700/80">
                  <span>✨ සියලුම ප්‍රශ්න පත්‍ර පූරණය කර අවසන් (All {filteredPapers.length} papers loaded)</span>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              📂
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              ප්‍රශ්න පත්‍ර කිසිවක් හමු නොවීය
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              ඔබ සෙවූ නිර්ණායක වලට අදාළ ප්‍රශ්න පත්‍ර තවම ඇතුළත් කර නොමැත. වෙනත් විෂයක් හෝ වසරක් තෝරා බලන්න.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory("O/L");
                  setSelectedPaperType("Past");
                  setSelectedYear("All");
                  setSelectedStream("All");
                  setSearchQuery("");
                }}
                className="text-xs font-bold px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                සියලුම ප්‍රශ්න පත්‍ර පෙන්වන්න (Reset Filters)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedbackInitialTab("request");
                  setFeedbackInitialSubject(searchQuery);
                  setFeedbackModalOpen(true);
                }}
                className="text-xs font-bold px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📄 සොයන ප්‍රශ්න පත්‍රය Request කරන්න</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Feedback & Paper Request Action Button */}
        <FloatingFeedbackButton
          onClick={() => {
            setFeedbackInitialTab("request");
            setFeedbackInitialSubject("");
            setFeedbackModalOpen(true);
          }}
          onOpen={(tab) => {
            setFeedbackInitialTab(tab || "request");
            setFeedbackInitialSubject("");
            setFeedbackModalOpen(true);
          }}
        />

        {/* Floating In-App Return Visit Alert for Uploaded Requested Papers */}
        <RequestedPaperAlert
          papers={papers}
          onViewPaper={(paper) => setViewingPaper(paper)}
          onDownloadPaper={(paper) => handleDownloadClick(paper)}
        />

        {/* Paper Request & Feedback Modal */}
        <FeedbackRequestModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          initialTab={feedbackInitialTab}
          initialSubject={feedbackInitialSubject}
        />

        {/* Interactive PDF Viewer Modal */}
        <PdfViewerModal
          isOpen={Boolean(viewingPaper)}
          onClose={() => setViewingPaper(null)}
          paper={viewingPaper}
          onDownload={(paperToDownload) => {
            setViewingPaper(null);
            handleDownloadClick(paperToDownload);
          }}
        />

        {/* Soft Login Download Modal */}
        <DownloadModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setPendingPaper(null);
          }}
          onSuccess={handleModalSuccess}
          paperTitle={pendingPaper?.title}
        />
      </section>
    </div>
  );
}
