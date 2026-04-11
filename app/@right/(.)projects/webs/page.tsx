'use client'

import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { usePathname } from "next/navigation";
import Projects from "@/app/projects/webs/components/Projects";
import { FaRegFolder } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";

export default function RightPanel() {
  const pathname = usePathname();

  if (pathname === "/") {
    return undefined;
  }

  return (
    <div className="top-0 sticky flex flex-col bg-[#090909] min-w-lg max-w-lg h-svh">
      <div className="flex justify-between items-center bg-[#090909] p-6">
        <h1 className="flex items-center space-x-2"><FaRegFolder /><span>Web Applications</span></h1>
        <h1 className="flex space-x-2">
          <button onClick={() => window.location.reload()} className="cursor-pointer">
            <LuExpand />
          </button>
          <Link scroll={false} href="/"><IoMdClose className="text-2xl" /></Link>
        </h1>
      </div>
      <div className="space-y-10 px-6 py-2 overflow-y-auto text-gray-400 grow">
        <Projects />
      </div>
    </div>
  );
}