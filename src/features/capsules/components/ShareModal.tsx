"use client";

import React, { useRef, useState } from "react";
import { X, Download, Link as LinkIcon, Lock, Unlock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ClientCapsule } from "@/types";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface ShareModalProps {
  capsule: ClientCapsule;
  onClose: () => void;
}

export default function ShareModal({ capsule, onClose }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading("Sedang menyiapkan kartu cerita...");

    try {
      // Tunggu font & image load
      await new Promise((resolve) => setTimeout(resolve, 600));

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Resolusi tinggi untuk sharing
        backgroundColor: "#030712", // slate-950
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `manifesting-capsule-${capsule.id.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("✨ Gambar berhasil disimpan ke perangkat!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan gambar. Silakan coba lagi.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/capsule/${capsule.id}`;
    navigator.clipboard.writeText(url);
    toast.success("✅ Tautan kapsul disalin ke clipboard!");
  };

  const dateObj = new Date(capsule.unlockAt);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      {/* Share Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-sm overflow-visible z-10 flex flex-col items-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full transition-all active:scale-90 bg-white/10 hover:bg-white/20 text-white z-20"
        >
          <X className="size-5" />
        </button>

        {/* 9:16 Instagram Story Card Element (target for html2canvas) */}
        <div className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-950">
          <div
            ref={cardRef}
            className="relative w-full aspect-[9/16] bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-6 flex flex-col justify-between overflow-hidden select-none"
            style={{ width: "360px", height: "640px" }}
          >
            {/* Aurora Background Glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[60%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[60%] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
            <div className="absolute top-[30%] left-[20%] w-[80%] h-[40%] rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none" />

            {/* Header: App Watermark Logo (Top) */}
            <div className="flex items-center gap-2.5 z-10">
              <div className="relative size-8 rounded-lg overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center">
                <img
                  src="/logo/logo.png"
                  alt="Logo"
                  className="size-6 object-contain"
                />
              </div>
              <div>
                <h4 className="text-[10px] font-black tracking-widest text-white uppercase leading-none">
                  The Manifesting Capsule
                </h4>
                <span className="text-[8px] text-blue-300 font-medium tracking-wider uppercase mt-0.5 block">
                  Silent Sanctuary
                </span>
              </div>
            </div>

            {/* Middle: Bento Replica Card */}
            <div className="w-full bg-white/5 dark:bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2.2rem] p-5 shadow-2xl z-10 flex flex-col justify-between h-80 relative overflow-hidden">
              {/* Card Header Vibe */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[8px] font-bold uppercase tracking-wider">
                  {capsule.vibe}
                </span>
                <span className="text-[9px] text-white/50 font-medium">
                  {formattedDate}
                </span>
              </div>

              {/* Photo representation */}
              {capsule.photoUrl ? (
                <div className="w-full h-24 rounded-xl overflow-hidden mb-3 border border-white/10">
                  <img
                    src={capsule.photoUrl}
                    alt="Capsule photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-20 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-3">
                  <span className="text-[10px] text-white/30 italic">Terkunci dalam waktu...</span>
                </div>
              )}

              {/* Sender & Receiver Info */}
              <div className="flex flex-row items-center justify-between w-full border-b border-white/10 pb-2 mb-3 text-[10px] text-white/70">
                <div className="flex items-center gap-1 min-w-0">
                  <User className="size-3 text-white/40" />
                  <span className="truncate">Dari: <span className="font-semibold">{capsule.authorName || "Anonim"}</span></span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="truncate">Untuk: <span className="font-semibold">{capsule.targetName}</span></span>
                  <ArrowRight className="size-3 text-white/40" />
                </div>
              </div>

              {/* Status Message */}
              <div className="flex-1 flex flex-col justify-center mb-3">
                {capsule.isLocked ? (
                  <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <Lock className="size-3.5 text-blue-300 shrink-0" />
                    <span className="text-[9px] text-blue-200 leading-tight">
                      Kapsul ini tersegel dan baru dapat dibuka dalam {capsule.daysLeft} hari lagi.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                    <Unlock className="size-3.5 text-emerald-300 shrink-0" />
                    <span className="text-[9px] text-emerald-200 leading-tight">
                      Kapsul manifestasi ini telah terbuka sepenuhnya!
                    </span>
                  </div>
                )}
              </div>

              {/* Time progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[8px] text-white/60">
                  <span>Progress Kematangan:</span>
                  <span className="font-mono">{capsule.progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${capsule.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Watermark & Call To Action */}
            <div className="flex flex-col items-center gap-1 z-10">
              <span className="text-[9px] text-white/40 tracking-wider font-semibold">
                Kunci manifestasimu sendiri di:
              </span>
              <span className="text-xs font-bold text-white/90 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full tracking-wide">
                the-manifesting-capsule.vercel.app
              </span>
            </div>
          </div>
        </div>

        {/* Footer Modal Share Controls */}
        <div className="w-full flex gap-3 mt-4">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/80 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
          >
            <Download className="size-4" />
            <span>{isDownloading ? "Menyimpan..." : "Simpan Foto"}</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl border border-slate-700/50 active:scale-95 transition-all"
            aria-label="Salin Tautan"
          >
            <LinkIcon className="size-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
