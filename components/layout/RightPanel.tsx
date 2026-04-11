"use client";

import { usePanelStore } from "@/store/usePanelStore";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

export default function RightPanel() {
  const { rightContext, rightTitle } = usePanelStore();

  return (
    <div className="bg-black min-w-xl h-full">
      <div className="flex justify-between items-center p-4">
        {rightTitle || (<div>Unknown Menu</div>)} <Link scroll={false} href={"/"}><IoMdClose className="text-2xl" /></Link>
      </div>
      <div>
        {rightContext}
      </div>
    </div>
  );
}