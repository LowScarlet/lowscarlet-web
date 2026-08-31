/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaCheckSquare, FaRegSquare, FaLock } from "react-icons/fa";
import { FiArrowLeft, FiPrinter, FiLayers, FiList, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { categoryTitles } from "@/libs/utils";
import Link from "next/link";
import LandscapePaperWrapper from "./LandscapePaperWrapper";
import PortfolioDocument from "./PortfolioDocument";

interface ProjectItem {
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

interface PortfolioPageClientProps {
  profile: {
    fullName: string;
    email: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
}

const MAX_PROJECTS = 5;

export default function PortfolioPageClient({ profile }: PortfolioPageClientProps) {
  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Auth state
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Check admin session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setIsAdmin(data.authenticated);
      } catch {
        setIsAdmin(false);
      }
    };
    checkSession();
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAllProjects(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin !== true) return;
    fetchProjects();
  }, [isAdmin, fetchProjects]);

  const toggleProject = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(sid => sid !== id);
      if (prev.length >= MAX_PROJECTS) return prev;
      return [...prev, id];
    });
  }, []);

  const moveProject = useCallback((id: string, direction: "up" | "down") => {
    setSelectedIds(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newArr.length) return prev;
      [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
      return newArr;
    });
  }, []);

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = new Set(allProjects.map(p => p.category));
    return ["all", ...Array.from(cats)];
  }, [allProjects]);

  // Filtered projects by category
  const filteredProjects = useMemo(() => {
    if (categoryFilter === "all") return allProjects;
    return allProjects.filter(p => p.category === categoryFilter);
  }, [allProjects, categoryFilter]);

  // Select all in current category (up to max)
  const selectByCategory = useCallback(() => {
    const toSelect = filteredProjects
      .filter(p => !selectedIds.includes(p.id))
      .map(p => p.id);
    const remaining = MAX_PROJECTS - selectedIds.length;
    if (remaining <= 0) return;
    setSelectedIds(prev => [...prev, ...toSelect.slice(0, remaining)]);
  }, [filteredProjects, selectedIds]);

  // Deselect all in current category
  const deselectByCategory = useCallback(() => {
    const idsInCategory = new Set(filteredProjects.map(p => p.id));
    setSelectedIds(prev => prev.filter(id => !idsInCategory.has(id)));
  }, [filteredProjects]);

  const allFilteredSelected =
    filteredProjects.length > 0 && filteredProjects.every(p => selectedIds.includes(p.id));

  const selectedProjects = selectedIds
    .map(id => allProjects.find(p => p.id === id))
    .filter(Boolean) as ProjectItem[];

  const handlePrint = () => window.print();

  // ---- Auth states ----
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="animate-pulse text-neutral-500 text-sm">Checking access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="text-center space-y-4">
          <FaLock className="mx-auto text-3xl text-neutral-600" />
          <p className="text-neutral-400 text-sm font-medium">Admin access required</p>
          <p className="text-neutral-600 text-xs">Please login as admin to access the portfolio generator.</p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-2.5 rounded-lg transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full max-w-7xl mx-auto my-6 sm:my-10 px-4 sm:px-6 text-neutral-100 min-h-screen print:bg-white print:min-h-0 print:p-0 print:max-w-none print:my-0">

      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none -z-10 print:hidden" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl pointer-events-none -z-10 print:hidden" />

      {/* ====== HEADER ====== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="print:hidden flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-800 transition shadow-lg"
          >
            <FiArrowLeft className="text-lg" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text bg-linear-to-r from-white via-neutral-200 to-neutral-400 text-transparent tracking-tight">
              Portfolio Generator
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Select up to {MAX_PROJECTS} projects and print as landscape A4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white text-xs font-bold shadow-lg transition disabled:cursor-not-allowed cursor-pointer"
          >
            <FiPrinter className="text-sm" />
            Print / Download PDF
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-mono">
              {selectedIds.length}/{MAX_PROJECTS}
            </span>
          </button>
        </div>
      </motion.div>

      {/* ====== MAIN CONTENT ====== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-5 items-start print:block"
      >
        {/* ====== LEFT: PROJECT SELECTOR ====== */}
        <div className="print:hidden w-72 xl:w-80 shrink-0">
          <div className="sticky top-6 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md shadow-xl overflow-hidden">

            {/* Selector header */}
            <div className="p-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-2 text-neutral-300 mb-3">
                <FiList className="text-base text-cyan-400" />
                <span className="text-sm font-bold text-white">Projects</span>
              </div>

              {/* Category filter pills */}
              {!loading && !error && categories.length > 1 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => {
                      const isActive = categoryFilter === cat;
                      const label = cat === "all"
                        ? "All"
                        : (categoryTitles[cat] || cat.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim());
                      const count = cat === "all"
                        ? allProjects.length
                        : allProjects.filter(p => p.category === cat).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-700/80 hover:text-neutral-300"
                          }`}
                        >
                          {label} <span className="opacity-60">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bulk actions */}
                  <div className="flex gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={selectByCategory}
                      disabled={selectedIds.length >= MAX_PROJECTS || allFilteredSelected}
                      className="font-semibold text-cyan-400 hover:text-cyan-300 disabled:text-neutral-600 disabled:cursor-not-allowed cursor-pointer transition"
                    >
                      + Select all
                    </button>
                    <span className="text-neutral-700">·</span>
                    <button
                      type="button"
                      onClick={deselectByCategory}
                      disabled={!filteredProjects.some(p => selectedIds.includes(p.id))}
                      className="font-semibold text-red-400 hover:text-red-300 disabled:text-neutral-600 disabled:cursor-not-allowed cursor-pointer transition"
                    >
                      − Deselect
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Project list */}
            <div className="max-h-[55vh] overflow-y-auto">
              {loading && (
                <div className="p-5 space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-11 bg-neutral-800/60 rounded-xl" />
                  ))}
                </div>
              )}

              {error && (
                <div className="p-6 text-center text-red-400 text-xs space-y-1">
                  <p className="font-semibold">Failed to load projects.</p>
                  <button onClick={fetchProjects} className="text-neutral-500 hover:text-neutral-300 underline cursor-pointer">
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && allProjects.length === 0 && (
                <div className="p-6 text-center text-neutral-600 text-xs">
                  No projects found in database.
                </div>
              )}

              {!loading && !error && filteredProjects.map(project => {
                const isSelected = selectedIds.includes(project.id);
                const isDisabled = !isSelected && selectedIds.length >= MAX_PROJECTS;
                const selectedIndex = selectedIds.indexOf(project.id);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => toggleProject(project.id)}
                    disabled={isDisabled}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition cursor-pointer border-b border-neutral-800/40 last:border-b-0 ${
                      isSelected
                        ? "bg-cyan-500/10 hover:bg-cyan-500/15"
                        : isDisabled
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-neutral-800/50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <FaCheckSquare className="text-cyan-400 text-sm" />
                      ) : (
                        <FaRegSquare className="text-neutral-600 text-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? "text-cyan-300" : "text-neutral-300"}`}>
                        {project.title}
                      </p>
                      <p className="text-[10px] text-neutral-600 mt-0.5">
                        {(project.isGroupProject || (project.contributors?.length || 0) > 1)
                          ? "Group Project"
                          : "Individual"}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center">
                        {selectedIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Order panel */}
            {selectedIds.length > 0 && (
              <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/40">
                <div className="flex items-center gap-1.5 mb-2">
                  <FiLayers className="text-[10px] text-neutral-500" />
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Print Order
                  </p>
                </div>
                <div className="space-y-1">
                  {selectedIds.map((id, idx) => {
                    const proj = allProjects.find(p => p.id === id);
                    if (!proj) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-bold flex items-center justify-center shrink-0 border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <span className="truncate flex-1 text-neutral-400 font-medium">
                          {proj.title}
                        </span>
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveProject(id, "up")}
                            disabled={idx === 0}
                            className="w-5 h-5 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:opacity-20 flex items-center justify-center text-neutral-400 cursor-pointer disabled:cursor-not-allowed text-[10px] border border-neutral-700/50"
                          >↑</button>
                          <button
                            type="button"
                            onClick={() => moveProject(id, "down")}
                            disabled={idx === selectedIds.length - 1}
                            className="w-5 h-5 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:opacity-20 flex items-center justify-center text-neutral-400 cursor-pointer disabled:cursor-not-allowed text-[10px] border border-neutral-700/50"
                          >↓</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====== RIGHT: DOCUMENT PREVIEW ====== */}
        <div className="flex-1 min-w-0 print:w-full">
          {selectedIds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="print:hidden flex items-center justify-center h-80 rounded-2xl bg-neutral-900/40 border border-neutral-800/50 border-dashed"
            >
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-center text-2xl">
                  📋
                </div>
                <p className="text-sm font-medium text-neutral-400">Select projects to preview</p>
                <p className="text-xs text-neutral-600">Your portfolio document will appear here</p>
              </div>
            </motion.div>
          ) : (
            <LandscapePaperWrapper>
              <PortfolioDocument
                projects={selectedProjects}
                profile={profile}
              />
            </LandscapePaperWrapper>
          )}
        </div>
      </motion.div>
    </div>
  );
}
