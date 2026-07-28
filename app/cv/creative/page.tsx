import { getFullCvData } from "@/db/queries/cv";
import Link from "next/link";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import CreativeCvContent from "@/components/cv/CreativeCvContent";
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
  const title = `CV_CREATIVE_${data.profile.fullName}_${dateStr}`;
  return {
    title,
  };
}

export default async function CreativeCvPage() {
  const data = await getFullCvData();
  const { profile, educations, experiences, projects, certifications, volunteers, languages, skills } = data;
  const dateStr = getFormattedDate();
  const pageTitle = `CV_CREATIVE_${profile.fullName}_${dateStr}`;

  return (
    <div className="min-h-screen bg-slate-400 py-8 px-4 sm:px-8 print:bg-white print:py-0 print:px-0 font-sans leading-relaxed">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-black transition bg-slate-100 px-3.5 py-2 rounded-lg shadow-md"
        >
          <FaArrowLeft size={12} />
          Kembali ke Dashboard
        </Link>
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg cursor-pointer transition print:hidden"
            id="print-btn"
          >
            <FaDownload size={12} />
            Download PDF / Print
          </button>
        </div>
      </div>

      {/* Creative CV Document Paper Container */}
      <div className="max-w-[210mm] w-full min-h-[297mm] print:min-h-0 print:w-full mx-auto shadow-2xl rounded-sm print:shadow-none print:max-w-none">
        {/* Render Modular Creative Content Body (includes Sidebar & Main Column) */}
        <CreativeCvContent
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
