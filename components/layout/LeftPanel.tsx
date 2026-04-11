"use client";

import { usePanelStore } from "@/store/usePanelStore";

export default function LeftPanel() {
  const { closeLeft, leftContext } = usePanelStore();

  return (
    <div className="bg-black min-w-xl h-full">
      <div className="p-4">
        <button onClick={closeLeft}>Close</button>
        <div>
          {leftContext}
        </div>
      </div>
    </div>
  );
}