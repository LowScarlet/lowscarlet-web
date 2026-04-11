"use client";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import MainContent from "./MainContent";
import { usePanelStore } from "@/store/usePanelStore";
import { cn } from "@/libs/utils";

export default function RootLayout() {
  const { leftOpen, rightOpen } = usePanelStore();

  return (
    <div className={cn("flex justify-center rounded-xl w-full min-h-full text-white", leftOpen || rightOpen ? "bg-black/50" : "bg-[#101010]")}>
      <div className="flex">

        {/* LEFT */}
        {leftOpen && (
          <div className="top-0 sticky h-screen">
            <LeftPanel />
          </div>
        )}

        {/* MAIN */}
        <div className="flex-1 shadow-xl">
          <MainContent />
        </div>

        {/* RIGHT */}
        {rightOpen && (
          <div className="top-0 sticky h-screen">
            <RightPanel />
          </div>
        )}

      </div>
    </div>
  );
}