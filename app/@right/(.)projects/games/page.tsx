'use client'

import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import Projects from "@/app/projects/webs/components/Projects";
import { FaRegFolder } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";

export default function RightPanel() {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="flex items-center space-x-2">
          <FaRegFolder />
          <span>Game Developments</span>
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer"
          >
            <LuExpand />
          </button>

          <Link scroll={false} href="/">
            <IoMdClose className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-10 px-6 py-2 overflow-y-auto text-gray-400 grow">
        <Projects category="games" />
      </div>
    </>
  );
}