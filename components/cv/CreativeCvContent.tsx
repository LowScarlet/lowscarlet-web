/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaGithub, FaLinkedin, FaWhatsapp, FaExternalLinkAlt } from "react-icons/fa";
import { AtsCvProfile } from "./AtsCvContent";

interface CreativeCvContentProps {
  profile: AtsCvProfile;
  educations: any[];
  experiences: any[];
  projects: any[];
  certifications: any[];
  skills: any[];
}

const getFullUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

const getDisplayUrl = (url: string) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

export default function CreativeCvContent({
  profile,
  educations,
  experiences,
  projects,
  certifications,
  skills,
}: CreativeCvContentProps) {
  const whatsappUrl = profile.whatsapp ? getFullUrl(profile.whatsapp) : null;

  return (
    <div className="w-full max-w-[210mm] aspect-[210/297] print:aspect-auto print:w-full mx-auto grid grid-cols-12 rounded-none border border-slate-300 bg-white text-slate-900 shadow-xl font-sans text-left overflow-hidden">
      {/* ================= LEFT SIDEBAR COLUMN (Grey Background) ================= */}
      <div className="col-span-4 bg-slate-200 p-4 sm:p-6 space-y-4 border-r border-slate-300 text-slate-800 overflow-y-auto">
        {/* Photo Placeholder */}
        <div className="text-center">
          <div className="w-36 h-36 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-300 flex flex-col items-center justify-center text-slate-500 relative group">
            <svg
              className="w-20 h-20 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Foto Profile
            </span>
          </div>
        </div>

        {/* CONTACT */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-400 pb-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
              CONTACT
            </h2>
            <div className="grow h-[2px] bg-slate-400/40" />
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            {profile.phone && (
              <div className="flex items-start gap-2.5">
                <FaPhoneAlt className="text-slate-800 text-xs shrink-0 mt-0.5" />
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:underline font-semibold text-slate-900">
                    {profile.phone}
                  </a>
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>
            )}

            {profile.email && (
              <div className="flex items-start gap-2.5">
                <FaEnvelope className="text-slate-800 text-xs shrink-0 mt-0.5" />
                <a href={`mailto:${profile.email}`} className="hover:underline text-slate-900 break-all">
                  {profile.email}
                </a>
              </div>
            )}

            {profile.website && (
              <div className="flex items-start gap-2.5">
                <FaGlobe className="text-slate-800 text-xs shrink-0 mt-0.5" />
                <a href={getFullUrl(profile.website)} target="_blank" rel="noreferrer" className="hover:underline text-slate-900 break-all">
                  {getDisplayUrl(profile.website)}
                </a>
              </div>
            )}

            {profile.location && (
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-slate-800 text-xs shrink-0 mt-0.5" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </section>

        {/* SKILLS & INTERESTS */}
        {skills.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-400 pb-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                SKILLS & EXPERTISE
              </h2>
              <div className="grow h-[2px] bg-slate-400/40" />
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              {skills.map((skillGroup) => (
                <div key={skillGroup.id} className="space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block">
                    {skillGroup.category}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(skillGroup.items || []).map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-300 text-slate-900 text-[10px] font-semibold rounded-xs border border-slate-400/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONNECT / SOCIAL */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-400 pb-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
              CONNECT
            </h2>
            <div className="grow h-[2px] bg-slate-400/40" />
          </div>

          <div className="space-y-2 text-xs">
            {profile.github && (
              <a
                href={getFullUrl(profile.github)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-800 hover:text-black hover:underline"
              >
                <FaGithub className="text-sm shrink-0" />
                <span className="truncate">{getDisplayUrl(profile.github)}</span>
              </a>
            )}

            {profile.linkedin && (
              <a
                href={getFullUrl(profile.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-800 hover:text-black hover:underline"
              >
                <FaLinkedin className="text-sm shrink-0 text-blue-700" />
                <span className="truncate">{getDisplayUrl(profile.linkedin)}</span>
              </a>
            )}

            {profile.whatsapp && (
              <a
                href={getFullUrl(profile.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-800 hover:text-black hover:underline"
              >
                <FaWhatsapp className="text-sm shrink-0 text-emerald-700" />
                <span className="truncate">WhatsApp Chat</span>
              </a>
            )}
          </div>
        </section>
      </div>

      {/* ================= RIGHT MAIN COLUMN (White Background) ================= */}
      <div className="col-span-8 bg-white p-4 sm:p-8 space-y-5 text-slate-900 overflow-y-auto">
        {/* Main Header Inline */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-left">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-slate-900 leading-none">
            {profile.fullName}
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mt-1.5">
            FULL STACK WEB DEVELOPER & CLOUD ENGINEER
          </p>
        </div>

        {/* WORK EXPERIENCE */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                WORK EXPERIENCE
              </h2>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      {exp.role} <span className="font-semibold text-slate-600">@ {exp.company}</span>
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">
                      {exp.dateRange}
                    </span>
                  </div>

                  {exp.location && (
                    <div className="text-[10px] font-semibold text-slate-500 italic">
                      {exp.location}
                    </div>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 leading-relaxed pl-1 pt-1">
                      {exp.highlights.map((item: string, idx: number) => (
                        <li key={idx} className="marker:text-slate-900">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PORTFOLIO & PROJECTS */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                PORTFOLIO & PROJECTS
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj) => {
                const highlights = proj.cvHighlights || (proj.description ? [proj.description] : []);
                return (
                  <div key={proj.id} className="border-b border-slate-200 pb-3 space-y-1.5 last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          {proj.title}
                        </h3>
                        {proj.category && (
                          <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 text-[9px] font-bold uppercase rounded-xs">
                            {proj.category}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {proj.dateRange || proj.releaseDateFormatted}
                      </span>
                    </div>

                    {proj.cvSubtitle && (
                      <p className="text-[11px] font-semibold text-slate-600 italic">
                        {proj.cvSubtitle}
                      </p>
                    )}

                    {/* Optional Project Thumbnail Graphic/Image */}
                    {proj.imageUrl && (
                      <div className="relative w-full h-36 rounded border border-slate-300 overflow-hidden my-2 bg-slate-100">
                        <Image
                          src={proj.imageUrl}
                          alt={proj.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {highlights.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 leading-relaxed pl-1">
                        {highlights.map((item: string, idx: number) => (
                          <li key={idx} className="marker:text-slate-900">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {educations.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                EDUCATION
              </h2>
            </div>

            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {edu.degree}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500">{edu.dateRange}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {edu.institution} {edu.location ? `(${edu.location})` : ""} {edu.gpa ? `• GPA: ${edu.gpa}` : ""}
                  </div>
                  {edu.thesis && (
                    <div className="text-[11px] text-slate-600 italic">
                      {edu.thesis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                CERTIFICATIONS
              </h2>
            </div>

            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{cert.title}</span>
                    <span className="text-slate-600 font-medium"> — {cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold text-slate-500">{cert.issueDateFormatted}</span>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-black">
                        <FaExternalLinkAlt size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
