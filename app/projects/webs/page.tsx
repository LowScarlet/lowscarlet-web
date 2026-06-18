import Link from "next/link";
import Projects from "./components/Projects";
import { IoMdClose } from "react-icons/io";
import { FaRegFolder } from "react-icons/fa";

export const metadata = {
  title: "Web Applications & Projects - LowScarlet",
  description: "Explore web applications, utilities, and developer projects built by Tegar Maulana Fahreza.",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col max-w-2xl">
      <div className="top-0 z-10 sticky flex justify-between items-center bg-[#101010] p-4">
        <h1 className="z-0 flex items-center space-x-2"><FaRegFolder /><span>Web Applications</span></h1>
        <Link scroll={false} href="/"><IoMdClose className="text-2xl" /></Link>
      </div>
      <div className="space-y-10 px-4 py-2 text-gray-400 grow">
        <Projects category="webs" />
      </div>
    </div>
  );
}