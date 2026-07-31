import { getFullCvData } from "@/db/queries/cv";
import Link from "next/link";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import AtsCvContent from "@/components/cv/AtsCvContent";
import { Metadata } from "next";

import A4PaperWrapper from "@/components/cv/A4PaperWrapper";

export const revalidate = 0; // Always fresh from DB

function getFormattedDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getFullCvData();
  const dateStr = getFormattedDate();
  const title = `CV_ATS_${data.profile.fullName}_${dateStr}`;
  return {
    title,
  };
}

export default async function AtsCvPage() {
  const data = await getFullCvData();
  const { profile, educations, experiences, projects, certifications, volunteers, languages, skills } = data;
  const dateStr = getFormattedDate();
  const pageTitle = `CV_ATS_${profile.fullName}_${dateStr}`;

  return (
    <div className="min-h-screen bg-neutral-900 py-8 px-4 print:bg-white print:py-0 print:px-0 print:m-0 print:min-h-0 print:w-full">

      <A4PaperWrapper variant="ats">
        <AtsCvContent
          profile={profile}
          educations={educations}
          experiences={experiences}
          projects={projects}
          certifications={certifications}
          volunteers={volunteers}
          languages={languages}
          skills={skills}
        />
      </A4PaperWrapper>
    </div>
  );
}
