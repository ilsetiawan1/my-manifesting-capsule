"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onAddClick: () => void;
}

export default function BottomNav({ onAddClick }: BottomNavProps) {
  const pathname = usePathname();
  const isExploreActive = pathname === "/";
  const isSettingsActive = pathname === "/settings";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex justify-center pointer-events-none">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-t border-slate-100/50 dark:border-slate-800 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] px-8 py-2 flex items-center justify-between pointer-events-auto rounded-t-[2.5rem] transition-colors duration-200">
        {/* Tab Explore */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all active:scale-95",
            isExploreActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Compass className="size-6" />
          <span className="text-[10px] tracking-wide">Explore</span>
        </Link>

        {/* Center Floating Action Button (FAB) dengan Concave space mock */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            onClick={onAddClick}
            className="flex items-center justify-center size-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 border-4 border-white dark:border-slate-900"
            aria-label="Tanam kapsul baru"
          >
            <Plus className="size-6 stroke-[3]" />
          </button>
        </div>

        {/* Spacer for FAB */}
        <div className="w-12 h-10 pointer-events-none" />

        {/* Tab Settings */}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all active:scale-95",
            isSettingsActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Settings className="size-6" />
          <span className="text-[10px] tracking-wide">Settings</span>
        </Link>
      </div>
    </div>
  );
}
