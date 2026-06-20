"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import CreateCapsuleForm from "@/features/capsules/components/CreateCapsuleForm";
import CapsuleDetailModal from "@/features/capsules/components/CapsuleDetailModal";
import SaveKeyModal from "@/features/capsules/components/SaveKeyModal";
import { getPublicCapsulesAction, getMyCapsulesAction } from "@/features/capsules/actions";
import { ClientCapsule } from "@/types";
import { AnimatePresence } from "framer-motion";
import { Smartphone } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { MainContext } from "@/app/context/MainContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { showInstallButton, isAlreadyInstalled, isStandalone, handleInstallClick } = usePWAInstall();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [selectedCapsule, setSelectedCapsule] = useState<ClientCapsule | null>(null);
  
  // Shared navigation states
  const [vibeFilter, setVibeFilter] = useState("All");
  const [activeSubTab, setActiveSubTab] = useState<"global" | "history">("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    resonateCount: 0,
  });

  const triggerRefresh = () => setRefreshCounter((prev) => prev + 1);

  // Fetch stats to sync dynamically
  const loadStats = async () => {
    try {
      const publicResStats = await getPublicCapsulesAction(1, 100);
      const myResStats = await getMyCapsulesAction();
      
      const allPublic = publicResStats.success && publicResStats.data ? publicResStats.data.capsules : [];
      const allMy = myResStats.success && myResStats.data ? myResStats.data : [];
      
      const uniqueMap = new Map<string, ClientCapsule>();
      allPublic.forEach((c) => uniqueMap.set(c.id, c));
      allMy.forEach((c) => uniqueMap.set(c.id, c));
      const allUnique = Array.from(uniqueMap.values());

      setStats({
        total: allUnique.length,
        unlocked: allUnique.filter((c) => !c.isLocked).length,
        resonateCount: allUnique.reduce((acc, c) => acc + c.resonateCount, 0),
      });
    } catch (err) {
      console.error("Gagal memuat stats:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshCounter]);

  const handleResonateSuccess = (capsuleId: string, newCount: number) => {
    // Increment stats locally to save network calls
    setStats((prev) => ({ ...prev, resonateCount: prev.resonateCount + 1 }));
    // Dispatch custom event to let children know resonate succeeded
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("resonateSuccess", { detail: { capsuleId, newCount } }));
    }
  };

  return (
    <MainContext.Provider
      value={{
        isCreateOpen,
        setIsCreateOpen,
        createdKey,
        setCreatedKey,
        selectedCapsule,
        setSelectedCapsule,
        vibeFilter,
        setVibeFilter,
        activeSubTab,
        setActiveSubTab,
        searchQuery,
        setSearchQuery,
        stats,
        setStats,
        refreshCounter,
        triggerRefresh,
      }}
    >
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        {/* Desktop Sidebar */}
        <Sidebar
          onAddClick={() => setIsCreateOpen(true)}
          showInstallButton={showInstallButton && !isAlreadyInstalled}
          handleInstallClick={handleInstallClick}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-28 lg:pb-8 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-950/20">
          {/* Header dengan Ghost Search */}
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Mobile PWA Install Banner */}
          {!isStandalone && (showInstallButton || isAlreadyInstalled) && (
            <div className="lg:hidden mt-3 mx-2 p-3 rounded-2xl bg-[#F3E5AB]/30 border border-[#F3E5AB]/60 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Smartphone className="size-4 text-[#D4AF37] shrink-0" />
                <span className="text-[11px] font-medium leading-tight">
                  {isAlreadyInstalled
                    ? "Aplikasi sudah terpasang. Buka dari Layar Utama Anda untuk pengalaman terbaik!"
                    : "Unduh aplikasi untuk akses lebih cepat & offline!"}
                </span>
              </div>
              {!isAlreadyInstalled && (
                <button
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#C8A96B] text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  Unduh
                </button>
              )}
            </div>
          )}

          {/* Dynamic Page Views */}
          <main className="flex-1 mt-4">{children}</main>
        </div>

        {/* Concave Bottom Navigation (Mobile & Tablet) */}
        <BottomNav
          onAddClick={() => setIsCreateOpen(true)}
        />

        {/* Modals & Sheets Container */}
        <AnimatePresence>
          {/* Create Capsule Bottom Sheet */}
          {isCreateOpen && (
            <CreateCapsuleForm
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onSuccess={(key) => {
                if (key) setCreatedKey(key);
                triggerRefresh();
              }}
            />
          )}

          {/* Save Key Modal */}
          {createdKey && (
            <SaveKeyModal
              accessKey={createdKey}
              isOpen={!!createdKey}
              onClose={() => setCreatedKey(null)}
            />
          )}

          {/* Capsule Detail Modal */}
          {selectedCapsule && (
            <CapsuleDetailModal
              initialCapsule={selectedCapsule}
              onClose={() => setSelectedCapsule(null)}
              onResonateSuccess={handleResonateSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </MainContext.Provider>
  );
}
