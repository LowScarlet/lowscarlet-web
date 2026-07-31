'use client'

import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import Projects from "@/app/projects/_components/Projects";
import { FaRegFolder } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { getCategoryTitle } from "@/libs/utils";

export default function RightPanelAllProjects() {
  const title = getCategoryTitle("all");

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="flex items-center space-x-2">
          <FaRegFolder />
          <span>{title}</span>
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            aria-label="Refresh page"
            className="cursor-pointer"
          >
            <LuExpand />
          </button>

          <Link scroll={false} href="/" aria-label="Close project panel">
            <IoMdClose className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-10 px-6 py-2 overflow-y-auto text-gray-400 grow">
        <Projects category="all" />
      </div>
    </>
  );
}
