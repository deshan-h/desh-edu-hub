"use client";

import { useState, useRef, useEffect } from "react";

export default function PremiumSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  icon = null,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  disabled = false,
  size = "md", // "sm" | "md" | "pill"
  align = "left", // "left" | "right"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to { value, label, badge, icon, disabled }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.label ?? opt.name,
        label: opt.label !== undefined ? opt.label : opt.name ?? opt.value,
        triggerLabel: opt.triggerLabel,
        badge: opt.badge,
        icon: opt.icon,
        disabled: Boolean(opt.disabled),
      };
    }
    return { value: opt, label: opt };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  const isPill = size === "pill";
  const isSmall = size === "sm";

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-1.5 sm:gap-2.5 transition-all duration-200 cursor-pointer select-none text-left focus:outline-none ${isPill
            ? "px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold"
            : isSmall
              ? "px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold"
              : "px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold"
          } ${isOpen
            ? "ring-2 ring-blue-500/30 border-blue-500 dark:border-blue-400 bg-white dark:bg-slate-900 shadow-lg shadow-blue-500/10"
            : "border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 shadow-2xs"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${triggerClassName}`}
      >
        <div className="flex items-center gap-1 sm:gap-2 truncate min-w-0 flex-1">
          {icon && <span className="shrink-0">{icon}</span>}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span
            className={`truncate ${selectedOption
                ? "font-bold text-slate-900 dark:text-white"
                : "text-slate-400 dark:text-slate-500 font-medium"
              } ${triggerClassName.includes("text-white") ? "!text-white" : ""}`}
          >
            {selectedOption ? (selectedOption.triggerLabel ?? selectedOption.label) : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black shrink-0 ${
              triggerClassName.includes("text-white")
                ? "bg-white/20 text-white"
                : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
            }`}>
              {selectedOption.badge}
            </span>
          )}
        </div>

        {/* Animated Chevron */}
        <div
          className={`shrink-0 flex items-center justify-center transition-transform duration-200 ${
            isOpen
              ? "rotate-180 text-blue-600 dark:text-blue-400"
              : triggerClassName.includes("text-white")
              ? "text-white/80"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Floating Popover Options Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            align === "right"
              ? "right-0"
              : align === "center"
              ? "left-1/2 -translate-x-1/2"
              : "left-0"
          } top-full mt-2 min-w-[210px] w-max max-w-xs sm:max-w-sm z-50 p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 dark:shadow-black/70 animate-in fade-in-0 zoom-in-95 duration-150 origin-top overflow-hidden ${menuClassName}`}
        >
          {/* Subtle top luminous rim highlight */}
          <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

          <div className="max-h-60 overflow-y-auto space-y-1 p-0.5 custom-scrollbar">
            {normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);

              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left select-none ${opt.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : isSelected
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-black"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
  );
}

