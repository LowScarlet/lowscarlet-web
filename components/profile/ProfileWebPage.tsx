/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaGraduationCap,
  FaBriefcase,
  FaAward,
  FaHandsHelping,
  FaLanguage,
  FaCode,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaExternalLinkAlt,
  FaTimes,
  FaImages,
  FaUserCheck,
  FaRegFolder,
} from "react-icons/fa";
import { FiLink, FiCheck } from "react-icons/fi";

interface ProfileWebPageProps {
  data: {
    profile: {
      fullName: string;
      location?: string;
      phone?: string;
      email?: string;
      website?: string;
      github?: string;
      linkedin?: string;
      whatsapp?: string;
      photoPro?: string;
      photoPas?: string;
      summary?: string;
    };
    educations: any[];
    experiences: any[];
    projects?: any[];
    certifications: any[];
    volunteers: any[];
    languages: any[];
    skills: any[];
  };
}

export default function ProfileWebPage({ data }: ProfileWebPageProps) {
  const {
    profile,
    educations,
    experiences,
    projects = [],
    certifications,
    volunteers,
    languages,
    skills,
  } = data;

  // Image Lightbox Modal State
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  // Copied section link state for feedback
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  // Smooth scroll to anchor tag on initial page load or hash change (e.g. #language)
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const handleCopySectionLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  const getFullUrl = (url?: string) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  };

  const getDisplayUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-gray-200 leading-relaxed">
      {/* ================= 1. PROFILE HEADER CARD ================= */}
      <div className="relative rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar / Photo */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-pink-500/50 overflow-hidden relative shadow-xl bg-neutral-800 flex items-center justify-center">
              {profile.photoPro || profile.photoPas ? (
                <Image
                  src={profile.photoPro || profile.photoPas || ""}
                  alt={profile.fullName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <FaUserCheck className="text-4xl text-gray-500" />
              )}
            </div>
            <span className="absolute -bottom-2 right-1/2 translate-x-1/2 md:translate-x-0 md:-right-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
              Fresh Graduate
            </span>
          </div>

          {/* User Meta */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.fullName}
              </h1>
              {profile.location && (
                <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center md:justify-start gap-1.5 mt-1">
                  <FaMapMarkerAlt className="text-pink-400 shrink-0" />
                  <span>{profile.location}</span>
                </p>
              )}
            </div>

            {/* Summary */}
            {profile.summary && (
              <p className="text-xs sm:text-sm text-gray-300 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80 leading-relaxed">
                {profile.summary}
              </p>
            )}

            {/* Contacts Grid */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-gray-300 hover:text-white border border-neutral-700/60 transition"
                >
                  <FaEnvelope className="text-pink-400" />
                  <span>{profile.email}</span>
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-gray-300 hover:text-white border border-neutral-700/60 transition"
                >
                  <FaPhoneAlt className="text-emerald-400" />
                  <span>{profile.phone}</span>
                </a>
              )}

              {profile.website && (
                <a
                  href={getFullUrl(profile.website)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-gray-300 hover:text-white border border-neutral-700/60 transition"
                >
                  <FaGlobe className="text-cyan-400" />
                  <span>{getDisplayUrl(profile.website)}</span>
                </a>
              )}

              {profile.github && (
                <a
                  href={getFullUrl(profile.github)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-gray-300 hover:text-white border border-neutral-700/60 transition"
                >
                  <FaGithub className="text-gray-300" />
                  <span>GitHub</span>
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={getFullUrl(profile.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-gray-300 hover:text-white border border-neutral-700/60 transition"
                >
                  <FaLinkedin className="text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              )}

              {profile.whatsapp && (
                <a
                  href={getFullUrl(profile.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 transition"
                >
                  <FaWhatsapp className="text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. WORK EXPERIENCE ================= */}
      {experiences && experiences.length > 0 && (
        <section id="experience" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <FaBriefcase className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Work Experience</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("experience")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-pink-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Experience section link"
            >
              {copiedSectionId === "experience" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {experiences.map((exp: any) => (
              <div
                key={exp.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 sm:p-6 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-xs sm:text-sm text-pink-400 font-medium">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>
                  </div>
                  {exp.dateRange && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700/60 shrink-0 self-start sm:self-auto">
                      {exp.dateRange}
                    </span>
                  )}
                </div>

                {/* Highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-300 space-y-1.5 marker:text-pink-500 pl-1">
                    {exp.highlights.map((hl: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Photo Evidence / Documentation Gallery */}
                {exp.images && exp.images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-semibold">
                      <FaImages className="text-pink-400" />
                      <span>Photo Proof & Documentation:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {exp.images.map((img: { no: number; src: string }, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          onClick={() => setLightboxImage({ src: img.src, alt: `${exp.role} - ${exp.company}` })}
                          className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer group hover:border-pink-500/60 transition shadow-sm"
                        >
                          <Image
                            src={img.src}
                            alt={`${exp.role} - ${exp.company}`}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                            <span>Zoom</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 3. FEATURED PROJECTS ================= */}
      {projects && projects.length > 0 && (
        <section id="project" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FaRegFolder className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Featured Projects</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("project")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Projects section link"
            >
              {copiedSectionId === "project" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((proj: any) => (
              <div
                key={proj.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 sm:p-6 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <Link
                      href={`/projects/id/${proj.id}`}
                      className="text-base sm:text-lg font-bold text-white hover:text-blue-400 transition"
                    >
                      {proj.title}
                    </Link>
                    {proj.category && (
                      <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80">
                        {proj.category}
                      </span>
                    )}
                  </div>
                  {proj.dateRange && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700/60 shrink-0 self-start sm:self-auto">
                      {proj.dateRange}
                    </span>
                  )}
                </div>

                {/* CV Subtitle */}
                {proj.cvSubtitle && (
                  <p className="text-xs text-blue-300 italic font-medium">
                    {proj.cvSubtitle}
                  </p>
                )}

                {/* ATS Bullet Highlights */}
                {proj.cvHighlights && proj.cvHighlights.length > 0 ? (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-300 space-y-1.5 marker:text-blue-400 pl-1">
                    {proj.cvHighlights.map((hl: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                ) : proj.description ? (
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {proj.description}
                  </p>
                ) : null}

                {/* Tech Stack Pills */}
                {proj.techs && proj.techs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techs.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-neutral-800 text-blue-300 border border-neutral-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Photo Evidence / Documentation Gallery */}
                {proj.images && proj.images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-semibold">
                      <FaImages className="text-blue-400" />
                      <span>Project Proof & Screenshots:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {proj.images.map((img: { no: number; src: string }, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          onClick={() => setLightboxImage({ src: img.src, alt: proj.title })}
                          className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer group hover:border-blue-500/60 transition shadow-sm"
                        >
                          <Image
                            src={img.src}
                            alt={proj.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                            <span>Zoom</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 4. EDUCATION ================= */}
      {educations && educations.length > 0 && (
        <section id="education" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FaGraduationCap className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Education</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("education")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-purple-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Education section link"
            >
              {copiedSectionId === "education" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {educations.map((edu: any) => (
              <div
                key={edu.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 sm:p-6 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{edu.institution}</h3>
                    <p className="text-xs sm:text-sm text-purple-400 font-medium">
                      {edu.degree} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  {edu.dateRange && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700/60 shrink-0 self-start sm:self-auto">
                      {edu.dateRange}
                    </span>
                  )}
                </div>

                {/* Thesis */}
                {edu.thesis && (
                  <p className="text-xs sm:text-sm text-gray-300 italic bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                    <span className="font-semibold text-purple-300 not-italic">Thesis / Final Project: </span>
                    {edu.thesis}
                  </p>
                )}

                {/* Relevant Coursework */}
                {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-semibold">Relevant Coursework:</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {edu.relevantCoursework.map((course: string, idx: number) => (
                        <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-md bg-neutral-800 text-gray-300 border border-neutral-700/50">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Evidence / Documentation Gallery */}
                {edu.images && edu.images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-semibold">
                      <FaImages className="text-purple-400" />
                      <span>Graduation & Campus Proof Photos:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {edu.images.map((img: { no: number; src: string }, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          onClick={() => setLightboxImage({ src: img.src, alt: `${edu.institution} - ${edu.degree}` })}
                          className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer group hover:border-purple-500/60 transition shadow-sm"
                        >
                          <Image
                            src={img.src}
                            alt={`${edu.institution} - ${edu.degree}`}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                            <span>Zoom</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 5. CERTIFICATIONS ================= */}
      {certifications && certifications.length > 0 && (
        <section id="certification" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FaAward className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Certifications & Licenses</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("certification")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-cyan-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Certifications section link"
            >
              {copiedSectionId === "certification" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert: any) => (
              <div
                key={cert.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 transition shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base font-bold text-white leading-snug">{cert.title}</h3>
                    {cert.issueDateFormatted && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-cyan-300 border border-neutral-700/60 shrink-0">
                        {cert.issueDateFormatted}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cyan-400 font-medium">{cert.issuer}</p>

                  {/* Highlights */}
                  {cert.highlights && cert.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 marker:text-cyan-400">
                      {cert.highlights.map((hl: string, idx: number) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Photo Certificate Proof or Credential Link */}
                <div className="pt-2 space-y-2">
                  {cert.images && cert.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {cert.images.map((img: { no: number; src: string }, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          onClick={() => setLightboxImage({ src: img.src, alt: cert.title })}
                          className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer group hover:border-cyan-500/60 transition shadow-sm"
                        >
                          <Image
                            src={img.src}
                            alt={cert.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={getFullUrl(cert.credentialUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline pt-1"
                    >
                      <FaExternalLinkAlt size={10} />
                      <span>Show Original Credential</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 6. SKILL SET ================= */}
      {skills && skills.length > 0 && (
        <section id="skill" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FaCode className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Skill Set</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("skill")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-emerald-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Skill Set section link"
            >
              {copiedSectionId === "skill" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skillGroup: any) => (
              <div
                key={skillGroup.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-2.5 shadow-lg"
              >
                <h3 className="text-sm font-bold text-emerald-400 tracking-wide uppercase">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items &&
                    skillGroup.items.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-700/80 transition"
                      >
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 7. VOLUNTEER WORK ================= */}
      {volunteers && volunteers.length > 0 && (
        <section id="volunteer" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FaHandsHelping className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Volunteer Experience</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("volunteer")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-amber-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Volunteer section link"
            >
              {copiedSectionId === "volunteer" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {volunteers.map((vol: any) => (
              <div
                key={vol.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 sm:p-6 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{vol.role}</h3>
                    <p className="text-xs sm:text-sm text-amber-400 font-medium">
                      {vol.organization} {vol.location && `• ${vol.location}`}
                    </p>
                  </div>
                  {vol.dateRange && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700/60 shrink-0 self-start sm:self-auto">
                      {vol.dateRange}
                    </span>
                  )}
                </div>

                {/* Highlights */}
                {vol.highlights && vol.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-300 space-y-1.5 marker:text-amber-400 pl-1">
                    {vol.highlights.map((hl: string, idx: number) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                )}

                {/* Photo Evidence */}
                {vol.images && vol.images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-semibold">
                      <FaImages className="text-amber-400" />
                      <span>Activity Documentation Photos:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {vol.images.map((img: { no: number; src: string }, imgIdx: number) => (
                        <div
                          key={imgIdx}
                          onClick={() => setLightboxImage({ src: img.src, alt: `${vol.role} - ${vol.organization}` })}
                          className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer group hover:border-amber-500/60 transition shadow-sm"
                        >
                          <Image
                            src={img.src}
                            alt={`${vol.role} - ${vol.organization}`}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                            <span>Zoom</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 8. LANGUAGES ================= */}
      {languages && languages.length > 0 && (
        <section id="language" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FaLanguage className="text-base" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Languages</h2>
            </div>

            <button
              type="button"
              onClick={() => handleCopySectionLink("language")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-indigo-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              title="Copy Languages section link"
            >
              {copiedSectionId === "language" ? (
                <>
                  <FiCheck className="text-emerald-400 text-sm" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink size={12} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((lang: any) => (
              <div
                key={lang.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              >
                <span className="text-sm font-bold text-white">{lang.name}</span>
                <span className="text-xs text-indigo-400 font-medium pt-1">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= LIGHTBOX IMAGE MODAL ================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-gray-300 hover:text-white p-2 rounded-full bg-neutral-900/80 border border-neutral-700 transition cursor-pointer"
              aria-label="Close Lightbox"
            >
              <FaTimes className="text-lg" />
            </button>
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950 flex items-center justify-center">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-xs text-gray-300 text-center mt-3 font-medium bg-neutral-900/80 px-4 py-1.5 rounded-full border border-neutral-800">
              {lightboxImage.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
