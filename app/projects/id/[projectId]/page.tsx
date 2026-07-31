import Link from "next/link";
import Projects from "@/app/projects/_components/Projects";
import { IoMdClose } from "react-icons/io";
import { FaRegFolder } from "react-icons/fa";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { projectId } = await params;
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (project) {
      return {
        title: `${project.title} - LowScarlet`,
        description: project.description?.slice(0, 160) || "Project detail",
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    title: "Project Detail - LowScarlet",
    description: "Explore project details by Tegar Maulana Fahreza.",
  };
}

export default async function IndividualProjectPage({ params }: PageProps) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col max-w-2xl">
      <div className="top-0 z-10 sticky flex justify-between items-center bg-[#101010] p-4">
        <h1 className="z-0 flex items-center space-x-2">
          <FaRegFolder />
          <span>Project Detail</span>
        </h1>
        <Link scroll={false} href="/" aria-label="Close project view">
          <IoMdClose className="text-2xl" />
        </Link>
      </div>
      <div className="space-y-10 px-4 py-2 text-gray-400 grow">
        <Projects projectId={projectId} />
      </div>
    </div>
  );
}
