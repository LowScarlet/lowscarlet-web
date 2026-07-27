import { getFullCvData } from "@/db/queries/cv";
import Link from "next/link";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import AtsCvContent from "@/components/cv/AtsCvContent";

export const revalidate = 0; // Always fresh from DB

export default async function AtsCvPage() {
  const data = await getFullCvData();
  const { profile, educations, experiences, projects, certifications, skills } = data;

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
      <div className="max-w-[210mm] w-full aspect-[210/297] print:aspect-auto print:w-full mx-auto bg-white text-gray-900 p-6 sm:p-10 shadow-2xl rounded-sm font-sans leading-relaxed print:p-0 print:shadow-none print:max-w-none">
        {/* Render Unified ATS CV Component (Header + Content) */}
        <AtsCvContent
          profile={profile}
          educations={educations}
          experiences={experiences}
          projects={projects}
          certifications={certifications}
          skills={skills}
        />
      </div>

      {/* Print script helper */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('print-btn')?.addEventListener('click', function() {
              window.print();
            });
          `,
        }}
      />
    </div>
  );
}
