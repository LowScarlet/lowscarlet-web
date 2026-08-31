/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react";
import Image from "next/image";
import {
  FaEnvelope, FaGlobe, FaGithub, FaLinkedin,
  FaUsers, FaUser, FaExternalLinkAlt, FaBullseye, FaBookOpen, FaInfoCircle,
} from "react-icons/fa";
import { FiCheckCircle, FiCpu, FiLayers, FiCode, FiArrowUpRight } from "react-icons/fi";
import { techs as techsMap } from "@/components/utils/Techs";
import { getIconComponent } from "@/libs/projectMapper";

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  images: { no: number; src: string }[];
  tags: string[];
  techs: string[];
  links: { href: string; icon: string }[];
  contributors: string[];
  startDate: string | null;
  releaseDate: string | null;
  portfolioSummary: string | null;
  projectOrigin: string | null;
  isGroupProject: boolean | null;
  roleInProject: string | null;
  projectImpact: string | null;
  projectLearnings: string | null;
}

interface PortfolioDocumentProps {
  projects: PortfolioProject[];
  profile: {
    fullName: string;
    email: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
}

function formatDate(d: string | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(d));
}

function getOriginLabel(o: string | null): string {
  switch (o) {
    case "self-initiated": return "Self-Initiated";
    case "class-assignment": return "Class Assignment";
    case "work-assignment": return "Work Assignment";
    default: return "Personal Project";
  }
}

function resolveTech(key: string): { title: string; icon: React.ReactNode } {
  const m = (techsMap as any)[key];
  if (m) return { title: m.title, icon: m.icon };
  return {
    title: key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim(),
    icon: null,
  };
}

function isGroup(p: PortfolioProject): boolean {
  return !!p.isGroupProject || (p.contributors?.length || 0) > 1;
}

function getFullUrl(url: string | null | undefined): string {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:")
    ? url
    : `https://${url}`;
}

/* ─────────────────────────────────────────────
   COVER PAGE  (A4 Landscape — 297mm × 210mm)
   ───────────────────────────────────────────── */
function CoverPage({
  projects,
  profile,
  today,
}: {
  projects: PortfolioProject[];
  profile: PortfolioDocumentProps["profile"];
  today: string;
}) {
  const scrollToProject = (id: string) => {
    const el = document.getElementById(`project-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="relative w-full min-h-[210mm] h-auto bg-[#090a0f] text-neutral-100 font-portfolio p-8 sm:p-10 flex flex-col justify-between print:break-after-page print:min-h-[210mm]"
      style={{
        backgroundImage: `radial-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative HUD Corner Crosshairs */}
      <span className="absolute top-4 left-4 text-cyan-500/40 text-xs font-mono select-none">+</span>
      <span className="absolute top-4 right-4 text-cyan-500/40 text-xs font-mono select-none">+</span>
      <span className="absolute bottom-4 left-4 text-cyan-500/40 text-xs font-mono select-none">+</span>
      <span className="absolute bottom-4 right-4 text-cyan-500/40 text-xs font-mono select-none">+</span>

      {/* Decorative top accent border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* ── TOP HEADER SECTION ── */}
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-8">
          {/* Left info */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Developer Project Portfolio</span>
              <span className="text-cyan-500/60">/</span>
              <span className="text-neutral-400">{today}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              <span className="bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300 text-transparent">
                {profile.fullName}
              </span>
            </h1>

            <p className="text-[11px] font-semibold tracking-wider uppercase text-cyan-400/90">
              Full Stack Web Developer & Software Engineer
            </p>

            {profile.summary && (
              <p className="text-[13px] text-neutral-300 leading-relaxed pt-1 max-w-xl">
                {profile.summary}
              </p>
            )}
          </div>

          {/* Right contact card (All links clickable) */}
          <div className="shrink-0 bg-neutral-900/80 border border-neutral-800/90 backdrop-blur-md rounded-2xl p-4 space-y-2 min-w-[240px] shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pb-1 border-b border-neutral-800">
              Contact & Links
            </p>

            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-cyan-300 transition group"
              >
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[11px] shrink-0 group-hover:bg-cyan-500/20">
                  <FaEnvelope />
                </span>
                <span className="truncate max-w-[170px] group-hover:underline">{profile.email}</span>
              </a>
            )}

            {profile.website && (
              <a
                href={getFullUrl(profile.website)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-cyan-300 transition group"
              >
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[11px] shrink-0 group-hover:bg-cyan-500/20">
                  <FaGlobe />
                </span>
                <span className="truncate max-w-[170px] group-hover:underline">{profile.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}

            {profile.github && (
              <a
                href={getFullUrl(profile.github)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-cyan-300 transition group"
              >
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[11px] shrink-0 group-hover:bg-cyan-500/20">
                  <FaGithub />
                </span>
                <span className="truncate max-w-[170px] group-hover:underline">{profile.github.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              </a>
            )}

            {profile.linkedin && (
              <a
                href={getFullUrl(profile.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-cyan-300 transition group"
              >
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[11px] shrink-0 group-hover:bg-cyan-500/20">
                  <FaLinkedin />
                </span>
                <span className="truncate max-w-[170px] group-hover:underline">{profile.linkedin.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── MIDDLE: SHOWCASE PROJECT TILES (Positioned in the lower section) ── */}
      <div className="relative z-10 mt-auto mb-4 pt-4">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <FiLayers className="text-cyan-400 text-sm" />
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Selected Showcase ({projects.length} Project{projects.length !== 1 ? "s" : ""})
            </span>
          </div>
          <span className="text-[10px] text-cyan-400/80 font-mono uppercase flex items-center gap-1">
            <span>Click any tile to jump to project</span>
            <FiArrowUpRight className="text-xs" />
          </span>
        </div>

        <div className={`grid gap-3.5 ${
          projects.length === 1
            ? "grid-cols-1 max-w-md"
            : projects.length === 2
            ? "grid-cols-2 max-w-3xl"
            : projects.length === 3
            ? "grid-cols-3"
            : projects.length === 4
            ? "grid-cols-4"
            : "grid-cols-5"
        }`}>
          {projects.map((project, idx) => {
            const group = isGroup(project);
            return (
              <a
                key={project.id}
                href={`#project-${project.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToProject(project.id);
                }}
                className="group relative bg-neutral-900/80 border border-neutral-800 hover:border-cyan-400 hover:bg-neutral-800/90 hover:shadow-lg hover:shadow-cyan-500/10 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 shadow-lg backdrop-blur-sm transition-all cursor-pointer block no-underline min-h-[115px]"
              >
                {/* Number & Tag */}
                <div className="flex justify-between items-start">
                  <span className="font-display text-2xl font-black text-cyan-400 group-hover:text-cyan-300 leading-none transition">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      group
                        ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    }`}>
                      {group ? "Group" : "Solo"}
                    </span>
                    <FiArrowUpRight className="text-neutral-500 group-hover:text-cyan-300 text-xs transition" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-cyan-200 line-clamp-2 leading-snug transition">
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1 capitalize truncate">
                    {getOriginLabel(project.projectOrigin)}
                  </p>
                </div>

                {/* Tech preview pills */}
                <div className="flex flex-wrap gap-1 pt-1.5 border-t border-neutral-800/80">
                  {(project.techs || []).slice(0, 4).map((t, i) => {
                    const tech = resolveTech(t);
                    return (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-neutral-800/90 text-neutral-300 text-[8px] font-medium"
                      >
                        {tech.title}
                      </span>
                    );
                  })}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM STATS BAR & FOOTER ── */}
      <div className="relative z-10 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400 text-sm" />
            <span className="text-[11px] font-medium text-neutral-300">Verified Full-Stack Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCpu className="text-cyan-400 text-sm" />
            <span className="text-[11px] font-medium text-neutral-300">Production-Ready Code</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCode className="text-violet-400 text-sm" />
            <span className="text-[11px] font-medium text-neutral-300">Modern Next.js & TypeScript Architecture</span>
          </div>
        </div>

        <div className="text-right text-[10px] text-neutral-500 font-mono">
          PAGE 01 / {String(projects.length + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROJECT DETAIL PAGE  (A4 Landscape — 297mm × 210mm)
   ───────────────────────────────────────────── */
function ProjectPage({
  project,
  index,
  total,
  website,
}: {
  project: PortfolioProject;
  index: number;
  total: number;
  website: string;
}) {
  const group = isGroup(project);
  const primaryProjectUrl = `https://${website || 'lowscarlet.my.id'}/projects/id/${project.id}`;

  return (
    <div
      id={`project-${project.id}`}
      className="relative w-full min-h-[210mm] h-auto bg-[#090a0f] text-neutral-100 font-portfolio p-7 sm:p-8 flex flex-col justify-between print:break-before-page print:min-h-[210mm] scroll-mt-2"
      style={{
        backgroundImage: `radial-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-transparent opacity-80" />

      {/* ── PROJECT HEADER BAR ── */}
      <div className="relative z-10 pb-3 border-b border-neutral-800/90 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-display text-xl font-black text-cyan-300 shrink-0 shadow-md">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {project.title}
            </h2>

            <div className="flex items-center gap-2.5 mt-1 text-xs">
              {(project.startDate || project.releaseDate) && (
                <span className="text-neutral-400 font-medium">
                  {formatDate(project.startDate)}
                  {project.releaseDate
                    ? ` – ${formatDate(project.releaseDate)}`
                    : project.startDate ? " – Present" : ""}
                </span>
              )}

              <span className="text-neutral-600">·</span>

              <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase tracking-wider border border-neutral-700/60">
                {getOriginLabel(project.projectOrigin)}
              </span>

              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                group
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              }`}>
                {group ? (
                  <span className="inline-flex items-center gap-1">
                    <FaUsers className="text-[10px]" /> Group Project
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <FaUser className="text-[10px]" /> Individual Project
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Page counter & Back to Top link */}
        <div className="flex items-center gap-3 text-right">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-[10px] font-semibold text-neutral-400 hover:text-cyan-300 transition px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 hover:border-neutral-700 print:hidden"
          >
            ↑ Cover
          </a>
          <span className="text-[11px] font-mono font-bold text-neutral-400 px-3 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800">
            PROJECT {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN CONTENT ── */}
      <div className="relative z-10 grid grid-cols-12 gap-6 my-4 flex-1 items-start">

        {/* ── LEFT COLUMN: VISUALS & TECH METADATA (42% width) ── */}
        <div className="col-span-5 flex flex-col justify-start gap-3.5">
          {/* Main Visual Frame (Clickable link to preview/open) */}
          <div className="space-y-2">
            {project.images?.[0] ? (
              <a
                href={project.images[0].src}
                target="_blank"
                rel="noreferrer"
                className="group relative block w-full aspect-video rounded-xl border border-neutral-700/80 hover:border-cyan-400/80 overflow-hidden bg-neutral-900 shadow-xl transition"
              >
                <Image
                  src={project.images[0].src}
                  alt={`${project.title} Preview`}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  unoptimized
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-neutral-300 group-hover:text-cyan-300 transition flex items-center gap-1">
                  <span>Primary Visual Preview</span>
                  <FiArrowUpRight className="text-[10px]" />
                </div>
              </a>
            ) : (
              <div className="w-full aspect-video rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-500 text-xs">
                Visual preview not provided
              </div>
            )}

            {/* Secondary Thumbnails (Clickable) */}
            {project.images?.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {project.images.slice(1, 3).map((img, i) => (
                  <a
                    key={i}
                    href={img.src}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block w-full aspect-video rounded-lg border border-neutral-800 hover:border-cyan-400/60 overflow-hidden bg-neutral-900/70 transition"
                  >
                    <Image
                      src={img.src}
                      alt={`${project.title} Screen ${i + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      unoptimized
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Role & Team Card */}
          {project.roleInProject && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5 space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FaUser className="text-[8px]" /> Assigned Role & Contribution
              </span>
              <p className="text-xs font-bold text-white">
                {project.roleInProject}
              </p>
              {group && project.contributors?.length > 1 && (
                <p className="text-[10px] text-neutral-400 truncate">
                  Team: {project.contributors.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Technologies Badges */}
          {project.techs && project.techs.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">
                Tech Stack & Libraries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.techs.map((techKey: string, techIdx: number) => {
                  const tech = resolveTech(techKey);
                  return (
                    <span
                      key={techIdx}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-900 border border-neutral-700/70 text-neutral-200 text-[10px] font-semibold rounded-lg shadow-sm"
                    >
                      {tech.icon && <span className="text-xs text-cyan-400">{tech.icon}</span>}
                      <span>{tech.title}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clickable Links Section */}
          <div className="space-y-1.5">
            {/* Primary Project Live URL */}
            <a
              href={primaryProjectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold transition no-underline shadow-sm group"
            >
              <span className="flex items-center gap-1.5 truncate">
                <FaExternalLinkAlt className="text-[10px] shrink-0 group-hover:scale-110 transition" />
                <span className="truncate">{website || 'lowscarlet.my.id'}/projects/id/{project.id.substring(0, 8)}...</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-cyan-400 group-hover:text-cyan-200 shrink-0 font-mono ml-2">
                PROJECT PAGE ↗
              </span>
            </a>

            {/* Additional Project Links if available */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {project.links.map((link, linkIdx) => {
                  const Icon = getIconComponent(link.icon);
                  return (
                    <a
                      key={linkIdx}
                      href={getFullUrl(link.href)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-[10px] font-medium rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
                    >
                      <Icon className="text-xs text-cyan-400" />
                      <span className="truncate max-w-[130px]">
                        {link.href.replace(/^https?:\/\//, "").replace(/\/$/, "").substring(0, 24)}
                      </span>
                      <FaExternalLinkAlt className="text-[8px] text-neutral-500" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: RICH NARRATIVE (58% width) ── */}
        <div className="col-span-7 flex flex-col justify-start gap-3.5">

          {/* Card 1: Project Summary */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-1.5 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-[10px]">
                <FaInfoCircle />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Project Overview & Core Mission
              </h4>
            </div>
            <p className="text-[13px] sm:text-[13.5px] text-neutral-200 leading-relaxed">
              {project.portfolioSummary || project.description?.substring(0, 300) || "No summary provided."}
            </p>
          </div>

          {/* Card 2: Impact */}
          {project.projectImpact && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-[10px]">
                  <FaBullseye />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Delivered Impact & Key Outcomes
                </h4>
              </div>
              <p className="text-[13px] sm:text-[13.5px] text-neutral-200 leading-relaxed">
                {project.projectImpact}
              </p>
            </div>
          )}

          {/* Card 3: Learnings & Insights */}
          {project.projectLearnings && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-1.5 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 text-[10px]">
                  <FaBookOpen />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                  Technical Learnings & Competencies Gained
                </h4>
              </div>
              <p className="text-[13px] sm:text-[13.5px] text-neutral-200 leading-relaxed">
                {project.projectLearnings}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM METADATA BAR ── */}
      <div className="relative z-10 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
        <div>
          Portfolio Showcase of <span className="text-neutral-300 font-semibold">{website || "lowscarlet.my.id"}</span>
        </div>
        <div className="font-mono">
          PAGE {String(index + 2).padStart(2, "0")} / {String(total + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT EXPORT
   ───────────────────────────────────────────── */
export default function PortfolioDocument({ projects, profile }: PortfolioDocumentProps) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div id="top" className="w-full font-portfolio text-left select-text scroll-smooth">
      {/* Cover Page */}
      <CoverPage projects={projects} profile={profile} today={today} />

      {/* Project Detail Pages */}
      {projects.map((project, idx) => (
        <ProjectPage
          key={project.id}
          project={project}
          index={idx}
          total={projects.length}
          website={profile.website}
        />
      ))}
    </div>
  );
}
