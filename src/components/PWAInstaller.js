"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true); // default true until checked

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("PWA Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("Service Worker registration failed:", err);
          });
      }
    }

    // 2. Check if already installed / standalone
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsStandalone(isRunningStandalone);
    if (isRunningStandalone) return;

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    // 4. Check if dismissed recently
    try {
      const lastDismissed = localStorage.getItem("desh_pwa_dismissed");
      if (lastDismissed) {
        const timeDiff = Date.now() - parseInt(lastDismissed, 10);
        // Don't show again if dismissed within 3 days (3 * 24 * 60 * 60 * 1000)
        if (timeDiff < 259200000) {
          setDismissed(true);
        } else {
          setDismissed(false);
        }
      } else {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }

    // 5. Listen to beforeinstallprompt (Android / Desktop Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      window.pwaDeferredPrompt = e;
      window.dispatchEvent(new Event("pwa_ready_to_install"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 6. Listen to appinstalled event
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log("DESH Papers Hub PWA installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("desh_pwa_dismissed", Date.now().toString());
    } catch {}
  };

  if (isStandalone) return null;

  // Render bottom banner if installable or on iOS
  const showBanner = !dismissed && (isInstallable || isIOS);

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      {showBanner && (
        <aside
          aria-label="Install App"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-subtle"
        >
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 dark:border-blue-500/20 shadow-2xl shadow-blue-500/10 flex items-center gap-3.5">
            {/* Logo Icon */}
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-md">
              <Image
                src="/icon-192.png"
                alt="DESH Papers Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Banner Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>Install DESH Papers App</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  PWA
                </span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                නොමිලේ Past Papers ඉක්මණින්ම Download කරගන්න!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm transition transform active:scale-95 cursor-pointer"
              >
                Install
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* iOS Safari Installation Instruction Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <Image
                    src="/icon-192.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    iPhone / iPad එකට App එක දාගන්න
                  </h3>
                  <p className="text-[11px] text-slate-500">Apple Safari Guide</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Safari Browser එකේ පහළ ඇති <strong>Share (බෙදාගැනීමේ)</strong> අයිකනය (
                  <span className="inline-block px-1 bg-slate-100 dark:bg-slate-800 rounded">
                    ⎋
                  </span>
                  ) click කරන්න.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  පහළට scroll කර <strong>&quot;Add to Home Screen&quot; (➕)</strong> තෝරන්න.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  ඉහළ දකුණු කෙළවරේ ඇති <strong>&quot;Add&quot;</strong> button එක click කරන්න.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
            >
              තේරුණා (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

