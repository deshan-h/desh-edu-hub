"use client";

import { useState, useRef } from "react";

const CATEGORIES = ["O/L", "A/L", "Grade 5", "Provincial", "Model"];

export default function AdminUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "O/L",
    subject: "",
    year: new Date().getFullYear().toString(),
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "", data: null });
  const fileInputRef = useRef(null);

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
        setStatus({
          type: "error",
          message: "Please choose a valid PDF file.",
          data: null,
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      setStatus({ type: null, message: "", data: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setStatus({ type: "error", message: "Please provide a title." });
      return;
    }
    if (!formData.subject.trim()) {
      setStatus({ type: "error", message: "Please specify a subject." });
      return;
    }
    if (!formData.year || isNaN(formData.year)) {
      setStatus({ type: "error", message: "Please enter a valid year." });
      return;
    }
    if (!file) {
      setStatus({
        type: "error",
        message: "Please select a PDF document to upload.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "", data: null });

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("category", formData.category);
      data.append("subject", formData.subject.trim());
      data.append("year", formData.year);
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to upload the paper.");
      }

      setStatus({
        type: "success",
        message: result.message || "Paper uploaded successfully!",
        data: result.data,
      });

      // Reset form
      setFormData({
        title: "",
        category: "O/L",
        subject: "",
        year: new Date().getFullYear().toString(),
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.message || "An unexpected error occurred. Please try again.",
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-3xl mx-auto">
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Admin Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            DESH Papers Hub
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload educational past papers and model exam materials to Cloudflare
            R2 & Supabase.
          </p>
        </div>

        {/* Feedback Alerts */}
        {status.type === "error" && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-600 mt-0.5 shrink-0"
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
            <div className="flex-1 text-sm text-red-800 font-medium">
              {status.message}
            </div>
            <button
              type="button"
              onClick={() => setStatus({ type: null, message: "", data: null })}
              className="text-red-500 hover:text-red-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {status.type === "success" && (
          <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900">
                  {status.message}
                </p>
                {status.data?.file_url && (
                  <p className="mt-1 text-xs text-emerald-700 break-all">
                    Public URL:{" "}
                    <a
                      href={status.data.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-emerald-900"
                    >
                      {status.data.file_url}
                    </a>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setStatus({ type: null, message: "", data: null })
                }
                className="text-emerald-500 hover:text-emerald-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Upload Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Paper Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. 2023 G.C.E. O/L Mathematics Past Paper (Part I & II)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white placeholder-slate-400"
                disabled={loading}
              />
            </div>

            {/* Category and Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  disabled={loading}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  min="1990"
                  max="2099"
                  required
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2023"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. Combined Mathematics, Science, English, Sinhala"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white placeholder-slate-400"
                disabled={loading}
              />
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Upload PDF Document <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  file
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
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
                  disabled={loading}
                />

                <div className="flex flex-col items-center justify-center">
                  <svg
                    className={`w-10 h-10 mb-2 ${
                      file ? "text-blue-600" : "text-slate-400"
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
                      <p className="font-semibold text-slate-800 break-all">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF selected
                      </p>
                      <span className="inline-block mt-2 text-xs font-semibold text-blue-600 underline">
                        Click to change file
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">
                      <p className="font-medium">
                        Click to browse or drag & drop past paper PDF
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Only PDF documents are supported
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-3 px-5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Uploading & Saving to Database...
                  </>
                ) : (
                  "Upload Past Paper"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

