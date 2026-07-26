'use client';

import Link from "next/link";
import { GoHeart } from "react-icons/go";
import { LuExpand } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

export default function SocialHeader() {
  return (
    <div className="flex justify-between items-center p-6 bg-[#090909] shrink-0 border-b border-neutral-900/40">
      <h1 className="flex items-center space-x-2">
        <GoHeart className="text-xl text-neutral-300" />
        <span>Visitor Social Center</span>
      </h1>
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => window.location.reload()}
          aria-label="Refresh page"
          className="cursor-pointer text-gray-400 hover:text-white transition duration-200"
        >
          <LuExpand />
        </button>
        <Link scroll={false} href="/" aria-label="Close social panel">
          <IoMdClose className="text-2xl text-gray-400 hover:text-white transition duration-200 flex items-center justify-center" />
        </Link>
      </div>
    </div>
  );
}
