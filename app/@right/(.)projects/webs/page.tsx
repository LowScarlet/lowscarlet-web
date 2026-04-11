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
    return null;
  }

  return (
    <>
      {/* Overlay (mobile & tablet < lg) */}
      <div className="lg:hidden z-40 fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Wrapper */}
      <div className="z-50 lg:static fixed inset-0 flex lg:flex justify-center">
        
        <div
          className="lg:top-0 lg:sticky flex flex-col bg-[#090909] shadow-lg lg:shadow-none rounded-2xl lg:rounded-none w-[90%] lg:min-w-lg max-w-md lg:max-w-lg h-[80vh] lg:h-svh"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6">
            <h1 className="flex items-center space-x-2">
              <FaRegFolder />
              <span>Web Applications</span>
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
            <Projects />
          </div>
        </div>
      </div>
    </>
  );
}