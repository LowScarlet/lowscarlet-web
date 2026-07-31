import { getFullCvData } from "@/db/queries/cv";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import ProfileWebPage from "@/components/profile/ProfileWebPage";
import { Metadata } from "next";

export const revalidate = 0; // Always fresh data

export async function generateMetadata(): Promise<Metadata> {
  const data = await getFullCvData();
  return {
    title: `Full Profile & Experience - ${data.profile.fullName}`,
    description: "Web profile showcasing education, work experience, certifications, skills, volunteer activities, and languages with photo evidence.",
  };
}

export default async function ProfilePage() {
  const data = await getFullCvData();

  return (
    <div className="flex flex-col max-w-2xl">
      <div className="top-0 z-10 sticky flex justify-between items-center bg-[#101010] p-4">
        <h1 className="z-0 flex items-center space-x-2">
          <FaUserCheck />
          <span>Web Profile & Portfolio</span>
        </h1>
        <Link scroll={false} href="/" aria-label="Close profile view">
          <IoMdClose className="text-2xl" />
        </Link>
      </div>
      <div className="space-y-10 px-4 py-2 text-gray-400 grow">
        <ProfileWebPage data={data} />
      </div>
    </div>
  );
}
