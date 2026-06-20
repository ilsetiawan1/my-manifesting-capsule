"use client";

import React from "react";
import SyncPanel from "@/components/SyncPanel";
import { useMain } from "@/app/context/MainContext";
import { useRouter } from "next/navigation";

export default function SettingsClientPage() {
  const { triggerRefresh } = useMain();
  const router = useRouter();

  return (
    <div className="py-6">
      <SyncPanel
        onSyncSuccess={() => {
          triggerRefresh();
          router.push("/");
        }}
      />
    </div>
  );
}
