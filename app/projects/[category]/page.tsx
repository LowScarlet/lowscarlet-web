import Link from "next/link";
import Projects from "../_components/Projects";
import { IoMdClose } from "react-icons/io";
import { FaRegFolder } from "react-icons/fa";
import { getCategoryTitle } from "@/libs/utils";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const title = getCategoryTitle(category);
  return {
    title: `${title} - LowScarlet`,
    description: `Explore ${title.toLowerCase()} developed by Tegar Maulana Fahreza.`,
  };
}

export default async function DynamicProjectsPage({ params }: PageProps) {
  const { category } = await params;
  const title = getCategoryTitle(category);

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
        <Projects category={category} />
      </div>
    </div>
  );
}
