'use client'

import { use } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import Projects from "@/app/projects/_components/Projects";
import { FaRegFolder } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { getCategoryTitle } from "@/libs/utils";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function RightPanel({ params }: PageProps) {
  const { category } = use(params);
  const title = getCategoryTitle(category);

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
        <Projects category={category} />
      </div>
    </>
  );
}
