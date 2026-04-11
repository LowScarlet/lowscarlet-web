'use client'

import Link from "next/link";
import Projects from "./components/Projects";
import { IoMdClose } from "react-icons/io";
import { FaRegFolder } from "react-icons/fa";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col max-w-2xl">
      <div className="top-0 sticky flex justify-between items-center p-4">
        <h1 className="flex items-center space-x-2"><FaRegFolder /><span>Web Applications</span></h1><Link scroll={false} href="/"><IoMdClose className="text-2xl" /></Link>
      </div>
      <div className="space-y-10 px-4 py-2 text-gray-400 grow">
        <Projects />
      </div>
    </div>
  );
}