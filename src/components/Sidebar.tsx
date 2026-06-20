"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Settings, Plus, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMain } from "@/app/context/MainContext";

interface SidebarProps {
  onAddClick: () => void;
  showInstallButton?: boolean;
  handleInstallClick?: () => void;
}

export default function Sidebar({
  onAddClick,
  showInstallButton = false,
  handleInstallClick,
}: SidebarProps) {
  const pathname = usePathname();
  const isExploreActive = pathname === "/";
  const isSettingsActive = pathname === "/settings";

  const { vibeFilter, setVibeFilter, activeSubTab, setActiveSubTab, stats } = useMain();
  const vibes = ["All", "Career & Study", "Love & Self", "Random"];

  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 justify-between select-none transition-colors duration-200">
      <div className="space-y-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/logo.png"
            alt="The Manifesting Capsule"
            width={40}
            height={40}
            className="rounded-xl object-contain shadow-sm"
          />
          <div>
            <h1 className="text-[17px] font-black tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
              The Manifesting Capsule
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
              Silent Sanctuary
            </span>
          </div>
        </Link>

        {/* Create Button */}
        <button
          onClick={onAddClick}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-blue-500/10 active:scale-95 transition-all"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>Drop Capsule</span>
        </button>

        {/* Navigation Tabs */}
        <div className="space-y-1.5">
          <Link
            href="/"
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-98",
              isExploreActive
                ? "bg-slate-50 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <Compass className="size-5" />
            <span>Explore Feed</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-98",
              isSettingsActive
                ? "bg-slate-50 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <Settings className="size-5" />
            <span>Settings</span>
          </Link>
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#D4AF37] hover:bg-slate-50/50 dark:hover:bg-slate-800/30 active:scale-98 transition-all"
            >
              <Smartphone className="size-5 text-[#D4AF37]" />
              <span>Unduh Aplikasi</span>
            </button>
          )}
        </div>

        {/* Sidebar sub-controls (only visible on explore tab) */}
        {isExploreActive && (
          <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Vibe Filters */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter Vibes
              </span>
              <div className="flex flex-col gap-1.5">
                {vibes.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVibeFilter(v)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                      vibeFilter === v
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tabs Global vs History */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Feed Section
              </span>
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setActiveSubTab("global")}
                  className={cn(
                    "py-1.5 text-center text-xs font-semibold rounded-lg transition-all",
                    activeSubTab === "global"
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350"
                  )}
                >
                  Global
                </button>
                <button
                  onClick={() => setActiveSubTab("history")}
                  className={cn(
                    "py-1.5 text-center text-xs font-semibold rounded-lg transition-all",
                    activeSubTab === "history"
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350"
                  )}
                >
                  History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Stats Counter (Desktop only) */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-3 shadow-inner">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Live Stats
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <span className="block text-sm font-black text-slate-800 dark:text-slate-100">{stats.total}</span>
            <span className="block text-[9px] text-slate-400 font-bold uppercase">Total</span>
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-black text-slate-800 dark:text-slate-100">{stats.unlocked}</span>
            <span className="block text-[9px] text-slate-400 font-bold uppercase">Open</span>
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-black text-slate-800 dark:text-slate-100">{stats.resonateCount}</span>
            <span className="block text-[9px] text-slate-400 font-bold uppercase">Vibes</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
