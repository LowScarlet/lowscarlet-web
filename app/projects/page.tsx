import Link from "next/link";
import Projects from "./_components/Projects";
import { IoMdClose } from "react-icons/io";
import { FaRegFolder } from "react-icons/fa";
import { getCategoryTitle } from "@/libs/utils";

export async function generateMetadata() {
  const title = getCategoryTitle("all");
  return {
    title: `${title} - LowScarlet`,
    description: "Explore all projects developed by Tegar Maulana Fahreza, ordered by newest first.",
  };
}

export default async function AllProjectsPage() {
  const title = getCategoryTitle("all");

  return (
    <div className="flex flex-col max-w-2xl">
      <div className="top-0 z-10 sticky flex justify-between items-center bg-[#101010] p-4">
        <h1 className="z-0 flex items-center space-x-2">
          <FaRegFolder />
          <span>{title}</span>
        </h1>
        <Link scroll={false} href="/" aria-label="Close category view">
          <IoMdClose className="text-2xl" />
        </Link>
      </div>
      <div className="space-y-10 px-4 py-2 text-gray-400 grow">
        <Projects category="all" />
      </div>
    </div>
  );
}
