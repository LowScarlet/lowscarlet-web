/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaSpinner, FaPrint, FaArrowLeft, FaSync, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaFileContract } from "react-icons/fa";
import Modal from "@/components/utils/Modal";
import CoverLetterContent from "@/components/cv/CoverLetterContent";
import A4PaperWrapper from "@/components/cv/A4PaperWrapper";
import { CoverLetterResponse } from "@/app/api/cover-letter/route";

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "preview";

export default function CoverLetterModal({
  isOpen,
  onClose,
}: CoverLetterModalProps) {
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [rawJobListing, setRawJobListing] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState<"kerja" | "magang">("kerja");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // AI result
  const [aiResult, setAiResult] = useState<CoverLetterResponse | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [latestEducationStr, setLatestEducationStr] = useState<string>("");

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Print ref
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setError("");
    }
  }, [isOpen]);

  const fetchGenerate = async () => {
    setError("");
    setLoading(true);

    try {
      // Fetch profile data for template rendering
      const cvRes = await fetch("/api/cv");
      if (!cvRes.ok) throw new Error("Gagal mengambil data CV");
      const cvJson = await cvRes.json();
      if (!cvJson.success) throw new Error(cvJson.error || "Gagal mengambil data CV");
      setProfileData(cvJson.data.profile);

      if (cvJson.data.educations && cvJson.data.educations.length > 0) {
        const topEdu = cvJson.data.educations[0];
        setLatestEducationStr(`${topEdu.degree} - ${topEdu.institution}`);
      } else {
        setLatestEducationStr("");
      }

      // Call AI generation API
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawJobListing: rawJobListing.trim(),
          companyName: companyName.trim() || undefined,
          companyAddress: companyAddress.trim() || undefined,
          position: position.trim() || undefined,
          type,
          language,
          additionalNotes: additionalNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal generate surat lamaran");

      setAiResult(json.data);
      setStep("preview");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!rawJobListing.trim()) {
      setError("Teks lowongan kerja wajib diisi. Paste konten dari halaman lowongan.");
      return;
    }
    await fetchGenerate();
  };

  const handleRegenerate = async () => {
    await fetchGenerate();
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = printRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Surat Lamaran - ${aiResult?.extracted_company || companyName} - ${aiResult?.extracted_position || position}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', 'Georgia', serif;
              font-size: 10.5pt;
              line-height: 1.6;
              color: #111;
              background: white;
              padding: 10px;
            }
            strong, b {
              font-weight: 700;
            }
            .text-right { text-align: right; }
            .text-justify { text-align: justify; }
            .font-semibold { font-weight: 600; }
            .font-serif { font-family: 'Times New Roman', 'Georgia', serif; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-8 { margin-top: 2rem; }
            .mb-12 { margin-bottom: 3rem; }
            .pl-4 { padding-left: 1rem; }
            .pl-8 { padding-left: 2rem; }
            .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
            .pr-2 { padding-right: 0.5rem; }
            .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
            .w-36 { width: 140px; }
            .w-3 { width: 12px; }
            .text-center { text-align: center; }
            .table { display: table; width: 100%; }
            tr { display: table-row; }
            td { display: table-cell; vertical-align: top; }
            .list-disc { list-style-type: disc; }
            .space-y-0\\.5 > * + * { margin-top: 0.125rem; }
            p { font-size: 10.5pt; }
            ul { font-size: 10pt; }
            @media print {
              body { background: white; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const resetForm = () => {
    setStep("form");
  };

  const inputClass =
    "w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm placeholder-gray-600";
  const labelClass =
    "block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider";

  // Resolve display values: manual override > AI extracted
  const displayCompany = companyName.trim() || aiResult?.extracted_company || "";
  const displayPosition = position.trim() || aiResult?.extracted_position || "";
  const displayAddress = companyAddress.trim() || aiResult?.extracted_location || "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <HiOutlineDocumentText className="text-orange-500 text-lg" />
          <span className="font-bold text-white text-base">
            {step === "form" ? "Buat Surat Lamaran Otomatis" : "Preview Surat Lamaran"}
          </span>
        </div>
      }
      glowClass="bg-linear-to-r from-amber-500 via-orange-500 to-red-500"
    >
      {step === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="space-y-4"
        >
          {/* Raw Job Listing — Primary Input */}
          <div>
            <label className={labelClass}>
              Paste Lowongan Kerja *
            </label>
            <textarea
              value={rawJobListing}
              onChange={(e) => setRawJobListing(e.target.value)}
              placeholder={"Ctrl+A → Ctrl+C dari halaman lowongan kerja (JobStreet, LinkedIn, dll.), lalu paste di sini...\n\nContoh:\nFullstack Developer\nPT Contoh Indonesia\nJakarta\nRequirements:\n- 3+ years experience..."}
              rows={8}
              required
              className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
            />
            <p className="text-[10px] text-gray-600 mt-1">
              AI akan otomatis extract nama perusahaan, posisi, lokasi, dan requirements dari teks ini.
            </p>
          </div>

          {/* Type & Language Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Type Selection */}
            <div>
              <label className={labelClass}>Jenis Lamaran</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("kerja")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${type === "kerja"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700"
                    }`}
                >
                  Kerja
                </button>
                <button
                  type="button"
                  onClick={() => setType("magang")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${type === "magang"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700"
                    }`}
                >
                  Magang
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className={labelClass}>Bahasa Surat</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("id")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${language === "id"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700"
                    }`}
                >
                  🇮🇩 ID
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${language === "en"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700"
                    }`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>
          </div>

          {/* Optional Overrides — Collapsible */}
          <details className="group">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition select-none flex items-center gap-1.5">
              <span className="text-[10px] group-open:rotate-90 transition-transform">▶</span>
              Override Manual (Opsional)
            </summary>
            <div className="mt-3 space-y-3 pl-1 border-l-2 border-neutral-800 ml-1 pl-3">
              {/* Company Name */}
              <div>
                <label className={labelClass}>Nama Perusahaan</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Kosongkan untuk auto-detect dari teks lowongan"
                  className={inputClass}
                />
              </div>

              {/* Company Address */}
              <div>
                <label className={labelClass}>Alamat Perusahaan</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Kosongkan untuk auto-detect dari teks lowongan"
                  className={inputClass}
                />
              </div>

              {/* Position */}
              <div>
                <label className={labelClass}>Posisi yang Dilamar</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Kosongkan untuk auto-detect dari teks lowongan"
                  className={inputClass}
                />
              </div>
            </div>
          </details>

          {/* Additional Notes */}
          <div>
            <label className={labelClass}>Catatan Tambahan untuk AI (Opsional)</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Konteks tambahan, misal: highlight project tertentu, sebutkan kenapa tertarik di perusahaan ini, dll."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 rounded-lg transition text-sm cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 relative bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold py-2 rounded-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 text-sm flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Preview Step */
        <div className="space-y-4">
          {/* Extracted Metadata Info Card */}
          {aiResult && (
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Info Lowongan (Extracted by AI)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {aiResult.extracted_company && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaBuilding className="text-orange-500 shrink-0" size={11} />
                    <span className="truncate">{aiResult.extracted_company}</span>
                  </div>
                )}
                {aiResult.extracted_position && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaBriefcase className="text-orange-500 shrink-0" size={11} />
                    <span className="truncate">{aiResult.extracted_position}</span>
                  </div>
                )}
                {aiResult.extracted_location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaMapMarkerAlt className="text-orange-500 shrink-0" size={11} />
                    <span className="truncate">{aiResult.extracted_location}</span>
                  </div>
                )}
                {aiResult.extracted_type && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaFileContract className="text-orange-500 shrink-0" size={11} />
                    <span className="truncate">{aiResult.extracted_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* A4 Preview */}
          {aiResult && profileData && (
            <div className="w-full flex justify-center py-1">
              <A4PaperWrapper variant="ats">
                <div ref={printRef}>
                  <CoverLetterContent
                    profile={{
                      fullName: profileData.fullName || "",
                      location: aiResult.profile_override?.location || profileData.location || "",
                      phone: profileData.phone || "",
                      email: profileData.email || "",
                      website: profileData.website || "",
                      linkedin: profileData.linkedin || "",
                      whatsapp: profileData.whatsapp || "",
                      latestEducation: aiResult.profile_override?.education || latestEducationStr,
                    }}
                    companyName={displayCompany}
                    companyAddress={displayAddress}
                    position={displayPosition}
                    type={type}
                    language={language}
                    bodyHighlight={aiResult.body_highlight}
                  />
                </div>
              </A4PaperWrapper>
            </div>
          )}

          {/* Error on regenerate */}
          {error && (
            <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Bottom Actions */}
          <div className="flex gap-2 pt-2 shrink-0">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-400 font-bold py-2 px-4 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer"
            >
              <FaArrowLeft size={10} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-400 font-bold py-2 px-4 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <FaSpinner size={10} className="animate-spin" />
              ) : (
                <FaSync size={10} />
              )}
              <span>Regenerate</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white text-center font-bold py-2 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center gap-2 shadow-md cursor-pointer"
            >
              <FaPrint size={12} />
              <span>Print / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-400 font-bold py-2 px-4 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
