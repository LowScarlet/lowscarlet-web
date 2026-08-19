'use client'

import React from "react";

interface CoverLetterContentProps {
  profile: {
    fullName: string;
    location: string;
    phone: string;
    email: string;
    website: string;
    linkedin: string;
    whatsapp?: string;
    latestEducation?: string;
  };
  companyName: string;
  companyAddress: string;
  position: string;
  type: "kerja" | "magang";
  language: "id" | "en";
  bodyHighlight: string;
}

const getFullUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

export default function CoverLetterContent({
  profile,
  companyName,
  companyAddress,
  position,
  type,
  language,
  bodyHighlight,
}: CoverLetterContentProps) {
  const isEn = language === "en";
  const isMagang = type === "magang";

  const defaultCompany = companyName || (isEn ? "[Company Name]" : "[Nama Perusahaan]");
  const defaultPosition = position || (isEn ? "[Position]" : "[Posisi]");
  const defaultEducation = profile.latestEducation || "-";

  const perihal = isEn
    ? (isMagang ? `Internship Application - ${defaultPosition}` : `Job Application - ${defaultPosition}`)
    : (isMagang ? `Lamaran Magang - ${defaultPosition}` : `Lamaran Pekerjaan - ${defaultPosition}`);

  // Format WhatsApp URL
  const rawPhone = profile.phone || "";
  const cleanPhone = rawPhone.replace(/[^\d+]/g, "");
  const whatsappUrl = profile.whatsapp
    ? getFullUrl(profile.whatsapp)
    : cleanPhone
      ? `https://wa.me/${cleanPhone.replace(/^\+/, "")}`
      : "#";

  const websiteUrl = profile.website ? getFullUrl(profile.website) : "#";
  const displayWebsite = profile.website ? profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : "lowscarlet.my.id";

  return (
    <div className="font-serif text-[10.5pt] leading-[1.6] text-gray-900 w-full max-w-[190mm] mx-auto select-none print:select-text">
      {/* Perihal */}
      <div className="mb-4">
        <p className="font-semibold text-gray-900">
          {isEn ? "Subject" : "Perihal"}: {perihal}
        </p>
      </div>

      {/* Recipient */}
      <div className="mb-4">
        <p>{isEn ? "To," : "Kepada,"}</p>
        <p className="font-semibold">HRD Manager {defaultCompany}</p>
        {companyAddress ? <p>{companyAddress}</p> : null}
      </div>

      {/* Greeting */}
      <div className="mb-3">
        <p>{isEn ? "Dear Sir/Madam," : "Dengan Hormat,"}</p>
      </div>

      {/* Paragraph 1: Opening Statement */}
      <p className="mb-3 text-justify">
        {isEn ? (
          isMagang ? (
            <>
              In reference to the internship vacancy information, I am aware that <strong>{defaultCompany}</strong> is currently opening an internship position for <strong>{defaultPosition}</strong>. Therefore, I hereby submit my personal details as follows:
            </>
          ) : (
            <>
              In reference to the job vacancy information, I am aware that <strong>{defaultCompany}</strong> is currently opening a position for <strong>{defaultPosition}</strong>. Therefore, I hereby submit my personal details as follows:
            </>
          )
        ) : (
          isMagang ? (
            <>
              Sehubungan dengan informasi lowongan magang, saya mengetahui bahwa <strong>{defaultCompany}</strong> sedang membuka lowongan magang untuk posisi <strong>{defaultPosition}</strong>. Untuk itu, saya yang bertanda tangan di bawah ini:
            </>
          ) : (
            <>
              Sehubungan dengan informasi lowongan kerja, saya mengetahui bahwa <strong>{defaultCompany}</strong> sedang membuka lowongan pekerjaan untuk posisi <strong>{defaultPosition}</strong>. Untuk itu, saya yang bertanda tangan di bawah ini:
            </>
          )
        )}
      </p>

      {/* Biodata Table with Clickable Links */}
      <div className="mb-3 pl-4 sm:pl-6 text-[10pt]">
        <table className="border-collapse w-full max-w-lg">
          <tbody>
            <tr>
              <td className="py-0.5 pr-2 w-36 font-medium text-gray-700">{isEn ? "Full Name" : "Nama"}</td>
              <td className="py-0.5 px-1 w-3 text-center">:</td>
              <td className="py-0.5 font-semibold text-gray-900">{profile.fullName || "-"}</td>
            </tr>
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-700">{isEn ? "Address / Location" : "Alamat"}</td>
              <td className="py-0.5 px-1 text-center">:</td>
              <td className="py-0.5 text-gray-900">{profile.location || "-"}</td>
            </tr>
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-700">{isEn ? "Education" : "Pendidikan Terakhir"}</td>
              <td className="py-0.5 px-1 text-center">:</td>
              <td className="py-0.5 text-gray-900">{defaultEducation}</td>
            </tr>
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-700">{isEn ? "Phone Number" : "Nomor Handphone"}</td>
              <td className="py-0.5 px-1 text-center">:</td>
              <td className="py-0.5 text-gray-900">
                {profile.phone ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium print:text-gray-900 print:no-underline"
                  >
                    {profile.phone}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-700">Email</td>
              <td className="py-0.5 px-1 text-center">:</td>
              <td className="py-0.5 text-gray-900">
                {profile.email ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:underline font-medium print:text-gray-900 print:no-underline"
                  >
                    {profile.email}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Paragraph 2: Intention & Concise AI Highlight */}
      <p className="mb-3 text-justify">
        {isEn ? (
          isMagang ? (
            <>
              I hereby intend to apply for the internship program for the <strong>{defaultPosition}</strong> position at <strong>{defaultCompany}</strong>. {bodyHighlight} As a basis for consideration, I hereby enclose the following supporting documents:
            </>
          ) : (
            <>
              I hereby intend to apply for the <strong>{defaultPosition}</strong> position at <strong>{defaultCompany}</strong>. {bodyHighlight} As a basis for consideration, I hereby enclose the following supporting documents:
            </>
          )
        ) : (
          isMagang ? (
            <>
              Dengan ini saya bermaksud untuk mengajukan lamaran magang di <strong>{defaultCompany}</strong> guna mengikuti program magang pada posisi tersebut. {bodyHighlight} Sebagai bahan pertimbangan, bersama ini saya lampirkan sejumlah dokumen pelengkap, berupa:
            </>
          ) : (
            <>
              Dengan ini saya bermaksud untuk mengajukan lamaran pekerjaan di <strong>{defaultCompany}</strong> guna menempati posisi tersebut. {bodyHighlight} Sebagai bahan pertimbangan, bersama ini saya lampirkan sejumlah dokumen pelengkap, berupa:
            </>
          )
        )}
      </p>

      {/* Attachments Bulleted List with Clickable Portfolio Link */}
      <ul className="list-disc pl-8 mb-4 space-y-0.5 text-[10pt]">
        <li>
          {isEn ? "Portfolio" : "Portofolio"} {" "}
          {profile.website ? (
            <>
              (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-medium print:text-gray-900 print:no-underline"
              >
                {displayWebsite}
              </a>
              )
            </>
          ) : null}
        </li>
        <li>
          Curriculum Vitae {" "}
          {profile.website ? (
            <>
              (
              <a
                href={`${websiteUrl}/cv/ats`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline font-medium print:text-gray-900 print:no-underline"
              >
                {displayWebsite}/cv/ats
              </a>
              )
            </>
          ) : null}
        </li>
        <li>{isEn ? "Academic Transcript & Diploma" : "Fotokopi Ijazah dan Transkrip Nilai"}</li>
        <li>{isEn ? "Supporting Certificates" : "Sertifikat Pendukung"}</li>
      </ul>

      {/* Paragraph 3: Closing Statement */}
      <p className="mb-6 text-justify">
        {isEn
          ? "I state that this cover letter is written truthfully. I sincerely hope to be given the opportunity for an interview. Thank you for your time and consideration."
          : "Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat menerima panggilan wawancara. Atas perhatian dan kerja sama Bapak/Ibu saya ucapkan terima kasih."}
      </p>

      {/* Signature Section */}
      <div className="mt-8">
        <p className="mb-12">{isEn ? "Sincerely," : "Hormat saya,"}</p>
        <p className="font-semibold text-gray-900">{profile.fullName || "[Nama Lengkap]"}</p>
      </div>
    </div>
  );
}
