"use client";

import React, { useState, useEffect } from "react";
import CapsuleList from "@/features/capsules/components/CapsuleList";
import { getPublicCapsulesAction, getMyCapsulesAction } from "@/features/capsules/actions";
import { ClientCapsule } from "@/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useMain } from "@/app/context/MainContext";

export default function HomePage() {
  const {
    vibeFilter,
    setVibeFilter,
    activeSubTab,
    setActiveSubTab,
    searchQuery,
    refreshCounter,
    setSelectedCapsule,
    setIsCreateOpen
  } = useMain();

  const [capsules, setCapsules] = useState<ClientCapsule[]>([]);
  const [publicPage, setPublicPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data capsules
  const loadCapsules = async (pageToLoad = 1, shouldAppend = false) => {
    setIsLoading(true);
    try {
      if (activeSubTab === "global") {
        const publicRes = await getPublicCapsulesAction(pageToLoad);
        if (publicRes.success && publicRes.data) {
          const { capsules: newCapsules, hasMore: more } = publicRes.data;
          setCapsules((prev) => shouldAppend ? [...prev, ...newCapsules] : newCapsules);
          setHasMore(more);
          setPublicPage(pageToLoad);
        }
      } else if (activeSubTab === "history") {
        const myRes = await getMyCapsulesAction();
        if (myRes.success && myRes.data) {
          setCapsules(myRes.data);
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCapsules(1, false);
  }, [activeSubTab, vibeFilter, refreshCounter]);

  // Listen to resonate success events from the detail modal (rendered in layout)
  useEffect(() => {
    const handleResonateSuccessEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ capsuleId: string; newCount: number }>;
      const { capsuleId, newCount } = customEvent.detail;
      setCapsules((prev) =>
        prev.map((c) => (c.id === capsuleId ? { ...c, resonateCount: newCount } : c))
      );
    };

    window.addEventListener("resonateSuccess", handleResonateSuccessEvent);
    return () => {
      window.removeEventListener("resonateSuccess", handleResonateSuccessEvent);
    };
  }, []);

  // Real-time search & vibe filter di client-side
  const filteredCapsules = capsules.filter((c) => {
    const matchesSearch = c.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVibe = vibeFilter === "All" || c.vibe === vibeFilter;
    return matchesSearch && matchesVibe;
  });

  const handleLoadMore = () => {
    loadCapsules(publicPage + 1, true);
  };

  return (
    <div className="space-y-4">
      {/* Tab Explore Sub-Bar (Mobile & Tablet only) */}
      <div className="flex flex-col gap-3 px-2 py-3 sm:px-4 lg:hidden">
        {/* Sub-tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-800 rounded-2xl border border-slate-200/10 dark:border-slate-700/50">
          <button
            onClick={() => setActiveSubTab("global")}
            className={cn(
              "py-2.5 text-center text-xs font-bold rounded-xl transition-all",
              activeSubTab === "global"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            Global Feed
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={cn(
              "py-2.5 text-center text-xs font-bold rounded-xl transition-all",
              activeSubTab === "history"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            My History
          </button>
        </div>

        {/* Vibe Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide -mx-2 px-2">
          {["All", "Career & Study", "Love & Self", "Random"].map((v) => (
            <button
              key={v}
              onClick={() => setVibeFilter(v)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95",
                vibeFilter === v
                  ? "bg-blue-900 dark:bg-blue-800 text-white shadow-sm"
                  : "bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-between mb-6">
        <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          {activeSubTab === "global" ? "Manifest Feed" : "My Capsule History"}
        </h2>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
          Menampilkan {filteredCapsules.length} kapsul
        </span>
      </div>

      {isLoading && capsules.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 p-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "h-56 min-h-[200px] bg-slate-100/80 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-[2rem] p-5 flex flex-col justify-between animate-pulse",
                i === 1 ? "col-span-2 sm:col-span-1" : "col-span-1"
              )}
            >
              {/* Top Header */}
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="size-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              {/* Middle Content */}
              <div className="space-y-3 my-3">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
              {/* Bottom Footer */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <CapsuleList
            capsules={filteredCapsules}
            onCardClick={(capsule) => setSelectedCapsule(capsule)}
            onAddFirstClick={() => setIsCreateOpen(true)}
            isHistoryTab={activeSubTab === "history"}
          />
          {activeSubTab === "global" && hasMore && (
            <button
              onClick={handleLoadMore}
              className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Muat Lebih Banyak</span>
              <Sparkles className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
