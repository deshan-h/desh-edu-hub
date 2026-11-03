"use client";

import { useState, useEffect } from "react";
import PremiumSelect from "@/components/ui/PremiumSelect";

const CATEGORIES = [
  { value: "O/L", label: "G.C.E. Ordinary Level (O/L)", badge: "O/L" },
  { value: "A/L", label: "G.C.E. Advanced Level (A/L)", badge: "A/L" },
  { value: "Grade 5", label: "Grade 5 Scholarship (ශිෂ්‍යත්වය)", badge: "Gr 5" },
  { value: "Provincial", label: "Provincial Term Test (පළාත්)", badge: "Prov" },
  { value: "Model", label: "Model Paper (ආදර්ශ ප්‍රශ්න පත්‍ර)", badge: "Model" },
];

const MEDIUMS = [
  { value: "Sinhala Medium", label: "සිංහල මාධ්‍යය (Sinhala Medium)" },
  { value: "English Medium", label: "English Medium" },
  { value: "Tamil Medium", label: "தமிழ் (Tamil Medium)" },
];

const FEEDBACK_TYPES = [
  { value: "General Suggestion", label: "💡 සාමාන්‍ය යෝජනාවක් (Suggestion)" },
  { value: "Paper Error", label: "⚠️ ප්‍රශ්න පත්‍රයක දෝෂයක් (Paper / Answer Error)" },
  { value: "Website Improvement", label: "🚀 වෙබ් අඩවිය පිළිබඳ අදහසක් (Improvement)" },
  { value: "Appreciation", label: "❤️ ඇගයීමක් (Appreciation & Thanks)" },
];

export default function FeedbackRequestModal({
  isOpen,
  onClose,
  initialTab = "request",
  initialSubject = "",
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // "request" | "feedback"
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Request form fields
  const [category, setCategory] = useState("O/L");
  const [subject, setSubject] = useState(initialSubject || "");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [medium, setMedium] = useState("Sinhala Medium");
  const [extraDetails, setExtraDetails] = useState("");

  // Feedback form fields
  const [feedbackType, setFeedbackType] = useState("General Suggestion");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Submission state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState("");

  // Pre-fill user details from localStorage
  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess(false);
      setSubmittedData(null);
      if (initialSubject) setSubject(initialSubject);
      if (initialTab) setActiveTab(initialTab);

      try {
        const stored = localStorage.getItem("desh_user");
        if (stored) {
          const user = JSON.parse(stored);
          if (user.name) setName(user.name);
          if (user.whatsapp_number || user.whatsapp) {
            setWhatsapp(user.whatsapp_number || user.whatsapp);
          }
        }
      } catch (e) {
        console.warn("Could not read localStorage user:", e);
      }
    }
  }, [isOpen, initialTab, initialSubject]);

  // Handle ESC key and scroll locking
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanWhatsapp = whatsapp.trim();

    if (!cleanName) {
      setError("කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.");
      return;
    }

    if (!cleanWhatsapp || cleanWhatsapp.length < 8) {
      setError("කරුණාකර වලංගු WhatsApp අංකයක් ඇතුළත් කරන්න.");
      return;
    }

    if (activeTab === "request" && !subject.trim()) {
      setError("කරුණාකර ඔබට අවශ්‍ය විෂයය (Subject) ඇතුළත් කරන්න.");
      return;
    }

    if (activeTab === "feedback" && !feedbackMessage.trim()) {
      setError("කරුණාකර ඔබගේ අදහස හෝ ගැටළුව පැහැදිලි කරන්න.");
      return;
    }

    setLoading(true);

    const payload = {
      type: activeTab === "request" ? "paper_request" : "feedback",
      name: cleanName,
      whatsapp: cleanWhatsapp,
      category: activeTab === "request" ? category : feedbackType,
      subject: activeTab === "request" ? subject.trim() : "",
      year: activeTab === "request" ? year : "",
      medium: activeTab === "request" ? medium : "",
      message: activeTab === "request" ? extraDetails.trim() : feedbackMessage.trim(),
    };

    try {
      // 1. Submit to /api/requests
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok && !result.success) {
        throw new Error(result.error || "Submission failed.");
      }

      // 2. Save user to localStorage so they are automatically recognized
      const userData = {
        name: cleanName,
        whatsapp_number: cleanWhatsapp,
        whatsapp: cleanWhatsapp,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("desh_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("desh_user_updated"));

      // 3. Save to desh_my_requests for return-visit in-app notifications
      try {
        if (activeTab === "request") {
          const storedReqs = JSON.parse(localStorage.getItem("desh_my_requests") || "[]");
          const reqRecord = {
            id: result.data?.id || `req_${Date.now()}`,
            type: "paper_request",
            name: cleanName,
            whatsapp: cleanWhatsapp,
            category,
            subject,
            year: year ? year.toString() : "",
            medium,
            status: "pending",
            submittedAt: new Date().toISOString(),
          };
          // Prepend new request
          storedReqs.unshift(reqRecord);
          localStorage.setItem("desh_my_requests", JSON.stringify(storedReqs));
          window.dispatchEvent(new Event("desh_requests_updated"));
        }
      } catch (errReq) {
        console.warn("Could not save to desh_my_requests:", errReq);
      }

      setSubmittedData(payload);
      setSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "යම් ගැටළුවක් ඇති විය. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp formatted string for 1-click send
  const getWhatsAppMessageUrl = () => {
    if (!submittedData) return null;
    let text = "";
    if (submittedData.type === "paper_request") {
      text = `*New Past Paper Request - DESH Edu Hub*%0A` +
        `👤 *Name:* ${encodeURIComponent(submittedData.name)}%0A` +
        `📱 *WhatsApp:* ${encodeURIComponent(submittedData.whatsapp)}%0A` +
        `📚 *Exam/Level:* ${encodeURIComponent(submittedData.category)}%0A` +
        `📖 *Subject:* ${encodeURIComponent(submittedData.subject)}%0A` +
        `📅 *Year:* ${encodeURIComponent(submittedData.year)}%0A` +
        `🗣️ *Medium:* ${encodeURIComponent(submittedData.medium)}%0A` +
        (submittedData.message ? `📝 *Notes:* ${encodeURIComponent(submittedData.message)}` : "");
    } else {
      text = `*New Feedback / Issue - DESH Edu Hub*%0A` +
        `👤 *Name:* ${encodeURIComponent(submittedData.name)}%0A` +
        `📱 *WhatsApp:* ${encodeURIComponent(submittedData.whatsapp)}%0A` +
        `🏷️ *Type:* ${encodeURIComponent(submittedData.category)}%0A` +
        `💬 *Message:* ${encodeURIComponent(submittedData.message)}`;
    }
    return `https://wa.me/94770000000?text=${text}`; // Can be directed to official number
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden max-h-[92vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-5 sm:px-6 py-5 text-white shrink-0 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-xl shadow-xs">
                {activeTab === "request" ? "📄" : "💬"}
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black leading-tight">
                  {activeTab === "request" ? "ප්‍රශ්න පත්‍ර ඉල්ලීම (Request Paper)" : "අදහස් සහ ගැටළු (Feedback)"}
                </h3>
                <p className="text-[11px] text-blue-100 font-medium">
                  {activeTab === "request"
                    ? "ඔබට අවශ්‍ය ප්‍රශ්න පත්‍රය අපට දන්වන්න — කඩිනමින් එකතු කරන්නෙමු"
                    : "ඔබගේ වටිනා අදහස් සහ පද්ධතියේ ගැටළු අපට දන්වන්න"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Tab Switcher Pills */}
          {!success && (
            <div className="flex items-center gap-2 mt-4 p-1 rounded-2xl bg-black/20 backdrop-blur-md relative z-10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("request");
                  setError("");
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "request"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>📄 Request Paper</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("feedback");
                  setError("");
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "feedback"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>💬 Give Feedback</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {success ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/10 animate-bounce">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  {activeTab === "request"
                    ? "ප්‍රශ්න පත්‍ර ඉල්ලීම සාර්ථකව ලැබිණි!"
                    : "ඔබගේ අදහස සාර්ථකව යොමු විය!"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {activeTab === "request"
                    ? "අපගේ කණ්ඩායම මෙම ප්‍රශ්න පත්‍රය සොයා ඉක්මනින්ම DESH Edu Hub වෙත ඇතුළත් කිරීමට කටයුතු කරනු ඇත."
                    : "DESH Edu Hub වැඩිදියුණු කිරීමට ඔබ දැක්වූ සහයෝගයට බෙහෙවින්ම ස්තූතියි!"}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  හරි (Done)
                </button>
              </div>
            </div>
          ) : (
            /* Form Input State */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Student Identity Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  ඔබගේ තොරතුරු (Student Details)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ඔබගේ නම (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="උදා: කසුන් පෙරේරා"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp අංකය <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="07X XXXXXXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* TAB 1: REQUEST PAPER FIELDS */}
              {activeTab === "request" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        විභාගය / ශ්‍රේණිය (Category)
                      </label>
                      <PremiumSelect
                        value={category}
                        onChange={setCategory}
                        options={CATEGORIES}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        අවශ්‍ය වර්ෂය (Target Year)
                      </label>
                      <input
                        type="number"
                        min="2000"
                        max="2030"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        විෂයය (Subject) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="උදා: විද්‍යාව (Science), Combined Maths"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        මාධ්‍යය (Medium)
                      </label>
                      <PremiumSelect
                        value={medium}
                        onChange={setMedium}
                        options={MEDIUMS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      අමතර විස්තර (Optional Notes)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="උදා: 3 වන වාර විභාගය, බස්නාහිර පළාත, Marking Scheme එක සමඟ අවශ්‍යයි..."
                      value={extraDetails}
                      onChange={(e) => setExtraDetails(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: FEEDBACK FIELDS */}
              {activeTab === "feedback" && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      අදහසේ වර්ගය (Feedback Type)
                    </label>
                    <PremiumSelect
                      value={feedbackType}
                      onChange={setFeedbackType}
                      options={FEEDBACK_TYPES}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ඔබගේ පණිවිඩය (Message / Details) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="ඔබගේ අදහස, පද්ධතියේ දුටු ගැටළුව හෝ යෝජනාව මෙහි සටහන් කරන්න..."
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  අවලංගු කරන්න (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-blue-500/25 active:scale-95 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {loading
                      ? "යොමු වෙමින්..."
                      : activeTab === "request"
                      ? "Request එක යවන්න"
                      : "Feedback එක යවන්න"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

