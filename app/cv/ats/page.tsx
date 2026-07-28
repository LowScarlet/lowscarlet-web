import { getFullCvData } from "@/db/queries/cv";
import Link from "next/link";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import AtsCvContent from "@/components/cv/AtsCvContent";
import { Metadata } from "next";

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
    <div className="min-h-screen bg-neutral-900 py-8 px-4 print:bg-white print:py-0 print:px-0">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="max-w-[800px] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft size={12} />
          Kembali ke Dashboard
        </Link>
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg cursor-pointer transition print:hidden"
            id="print-btn"
          >
            <FaDownload size={12} />
            Download PDF / Print
          </button>
        </div>
      </div>

      {/* ATS CV Document Paper Container */}
      <div className="max-w-[210mm] w-full min-h-[297mm] print:min-h-0 print:w-full mx-auto bg-white text-gray-900 p-6 sm:p-10 shadow-2xl rounded-sm font-sans leading-relaxed print:p-0 print:shadow-none print:max-w-none">
        {/* Render Unified ATS CV Component (Header + Content) */}
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
      </div>

      {/* Dynamic document title & print script helper */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.title = ${JSON.stringify(pageTitle)};
            document.getElementById('print-btn')?.addEventListener('click', function() {
              window.print();
            });
          `,
        }}
      />
    </div>
  );
}
