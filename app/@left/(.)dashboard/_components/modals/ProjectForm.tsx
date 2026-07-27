/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { cn } from "@/libs/utils";

import { project_type } from "@/components/utils/ProjectType";
import { techs } from "@/components/utils/Techs";

interface ProjectFormProps {
  project: any; // null for add, object for edit
  projectsList: any[];
  onSaveSuccess: () => void;
  onCancel: () => void;
}

const availableTags = Object.entries(project_type).map(([key, value]) => ({
  key,
  title: value.title,
}));

const availableTechs = Object.entries(techs).map(([key, value]) => ({
  key,
  title: value.title,
}));

export default function ProjectForm({
  project,
  projectsList,
  onSaveSuccess,
  onCancel,
}: ProjectFormProps) {
  // Form states
  const [pTitle, setPTitle] = useState("");
  const [pCategory, setPCategory] = useState("webs");
  const [pDescription, setPDescription] = useState("");
  const [pImagesList, setPImagesList] = useState<{ no: number; src: string }[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pTags, setPTags] = useState<string[]>([]);
  const [pTechs, setPTechs] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [customTechInput, setCustomTechInput] = useState("");
  const [pGithub, setPGithub] = useState("");
  const [pDemo, setPDemo] = useState("");
  const [pContact, setPContact] = useState("");
  const [pFigma, setPFigma] = useState("");
  const [pBehance, setPBehance] = useState("");
  const [pContributors, setPContributors] = useState("");
  const [pStartDate, setPStartDate] = useState("");
  const [pReleaseDate, setPReleaseDate] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [pCvSubtitle, setPCvSubtitle] = useState("");
  const [pCvHighlightsText, setPCvHighlightsText] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectError, setProjectError] = useState("");

  useEffect(() => {
    if (project) {
      // Edit Mode Initialization
      setPTitle(project.title || "");
      setPCategory(project.category || "webs");
      setPDescription(project.description || "");
      setPImagesList(project.images || []);
      setManualImageUrl("");
      setUploadError("");
      setPTags(project.tags || []);
      setPTechs(project.techs || []);
      setPLocation(project.location || "");
      setPCvSubtitle(project.cvSubtitle || "");
      setPCvHighlightsText((project.cvHighlights || []).join("\n"));

      const githubLink = (project.links || []).find((l: any) => l.icon === "github")?.href || "";
      const demoLink = (project.links || []).find((l: any) => l.icon === "link")?.href || "";
      const contactLink = (project.links || []).find((l: any) => l.icon === "whatsapp")?.href || "";
      const figmaLink = (project.links || []).find((l: any) => l.icon === "figma")?.href || "";
      const behanceLink = (project.links || []).find((l: any) => l.icon === "behance")?.href || "";

      setPGithub(githubLink);
      setPDemo(demoLink);
      setPContact(contactLink);
      setPFigma(figmaLink);
      setPBehance(behanceLink);

      setPContributors((project.contributors || []).join(", "));
      setPStartDate(project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "");
      setPReleaseDate(project.releaseDate ? new Date(project.releaseDate).toISOString().split("T")[0] : "");
    } else {
      // Add Mode Reset
      setPTitle("");
      setPCategory("webs");
      setPDescription("");
      setPImagesList([]);
      setManualImageUrl("");
      setUploadError("");
      setPTags([]);
      setPTechs([]);
      setPGithub("");
      setPDemo("");
      setPContact("");
      setPFigma("");
      setPBehance("");
      setPContributors("");
      setPStartDate("");
      setPReleaseDate("");
      setPLocation("");
      setPCvSubtitle("");
      setPCvHighlightsText("");
      setProjectError("");
      setCustomTagInput("");
      setCustomTechInput("");
    }
  }, [project]);

  const handleToggleTag = (tagKey: string) => {
    setPTags(prev =>
      prev.includes(tagKey)
        ? prev.filter(t => t !== tagKey)
        : [...prev, tagKey]
    );
  };

  const handleToggleTech = (techKey: string) => {
    setPTechs(prev =>
      prev.includes(techKey)
        ? prev.filter(t => t !== techKey)
        : [...prev, techKey]
    );
  };

  const handleAddCustomTag = () => {
    const val = customTagInput.trim();
    if (val && !pTags.includes(val)) {
      setPTags(prev => [...prev, val]);
    }
    setCustomTagInput("");
  };

  const handleAddCustomTech = () => {
    const val = customTechInput.trim();
    if (val && !pTechs.includes(val)) {
      setPTechs(prev => [...prev, val]);
    }
    setCustomTechInput("");
  };

  const getTagTitle = (tagKey: string) => {
    return availableTags.find(t => t.key === tagKey)?.title || tagKey;
  };

  const getTechTitle = (techKey: string) => {
    return availableTechs.find(t => t.key === techKey)?.title || techKey;
  };

  const getSuggestedTags = () => {
    const allTags = Array.from(new Set([
      ...availableTags.map(t => t.key),
      ...projectsList.flatMap(p => p.tags || [])
    ]));
    return allTags.filter(tag => !pTags.includes(tag));
  };

  const getSuggestedTechs = () => {
    const allTechs = Array.from(new Set([
      ...availableTechs.map(t => t.key),
      ...projectsList.flatMap(p => p.techs || [])
    ]));
    return allTechs.filter(tech => !pTechs.includes(tech));
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    setProjectError("");
    setIsSavingProject(true);

    const linksArray = [];
    if (pGithub) linksArray.push({ href: pGithub, icon: "github" });
    if (pDemo) linksArray.push({ href: pDemo, icon: "link" });
    if (pContact) linksArray.push({ href: pContact, icon: "whatsapp" });
    if (pFigma) linksArray.push({ href: pFigma, icon: "figma" });
    if (pBehance) linksArray.push({ href: pBehance, icon: "behance" });

    const contributorsArray = pContributors
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const cvHighlightsArray = pCvHighlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      title: pTitle,
      category: pCategory,
      description: pDescription,
      images: pImagesList,
      tags: pTags,
      techs: pTechs,
      links: linksArray,
      contributors: contributorsArray,
      startDate: pStartDate ? new Date(pStartDate).toISOString() : null,
      releaseDate: pReleaseDate ? new Date(pReleaseDate).toISOString() : null,
      location: pLocation || null,
      cvSubtitle: pCvSubtitle || null,
      cvHighlights: cvHighlightsArray,
    };

    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSaveSuccess();
      } else {
        const err = await res.json();
        setProjectError(err.message || "Failed to save project");
      }
    } catch (e) {
      console.error(e);
      setProjectError("Failed to save project");
    } finally {
      setIsSavingProject(false);
    }
  };

  return (
    <form onSubmit={handleSaveProject} className="space-y-4 text-left">
      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-4">
        <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
          General Information
        </span>

        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
            Project Title *
          </label>
          <input
            type="text"
            value={pTitle}
            onChange={(e) => setPTitle(e.target.value)}
            required
            placeholder="E.g., Simakad ICC Pekanbaru"
            className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              value={pCategory}
              onChange={(e) => setPCategory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm cursor-pointer"
            >
              <option value="webs">Web Applications</option>
              <option value="androidApps">Android Applications</option>
              <option value="games">Game Developments</option>
              <option value="desktopApps">Desktop Applications</option>
              <option value="iot">IoT & Hardware</option>
              <option value="uiux">UI/UX Designs</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              Contributors
            </label>
            <input
              type="text"
              value={pContributors}
              onChange={(e) => setPContributors(e.target.value)}
              placeholder="Comma-separated names"
              className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              value={pStartDate}
              onChange={(e) => setPStartDate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              Release Date (Optional)
            </label>
            <input
              type="date"
              value={pReleaseDate}
              onChange={(e) => setPReleaseDate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-2">
        <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
          Description (Markdown Supported) *
        </label>
        <textarea
          value={pDescription}
          onChange={(e) => setPDescription(e.target.value)}
          required
          rows={5}
          placeholder="Describe the project... Support Markdown list, headers, etc."
          className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-650 resize-y"
        />
      </div>

      {/* ATS CV Specific Fields */}
      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800/50 pb-1.5">
          <span className="block text-gray-300 text-[11px] font-bold uppercase tracking-wider">
            ATS CV Details (Optional)
          </span>
          <span className="text-[10px] text-pink-400 font-mono">
            Displayed on generated ATS Resume
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              value={pLocation}
              onChange={(e) => setPLocation(e.target.value)}
              placeholder="E.g., Pekanbaru, Indonesia"
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
              ATS Subtitle / Role
            </label>
            <input
              type="text"
              value={pCvSubtitle}
              onChange={(e) => setPCvSubtitle(e.target.value)}
              placeholder="E.g., Undergraduate Final Project - Web Applications"
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
            ATS Bullet Points (1 bullet per line)
          </label>
          <textarea
            value={pCvHighlightsText}
            onChange={(e) => setPCvHighlightsText(e.target.value)}
            rows={4}
            placeholder={`Built a cloud-native academic information system...\nImplemented cloud deployment workflows with Railway...`}
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-650 resize-y"
          />
        </div>
      </div>

      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
        <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
          Project Images
        </span>

        {pImagesList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pImagesList.map((img, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden group aspect-video bg-neutral-900 border border-neutral-855 shadow-md">
                <Image
                  src={img.src}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMDEwMTAiLz48L3N2Zz4="
                  alt="Project screenshot"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setPImagesList(prev => prev.filter((_, i) => i !== idx).map((item, index) => ({ ...item, no: index + 1 })))}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                  title="Delete image"
                >
                  <IoMdClose size={12} />
                </button>
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[8px] text-gray-300 font-mono">
                  #{img.no}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              setIsUploading(true);
              setUploadError("");
              try {
                const uploaded = [...pImagesList];
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: "POST",
                    body: file,
                  });
                  if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Failed to upload image");
                  }
                  const data = await res.json();
                  uploaded.push({
                    no: uploaded.length + 1,
                    src: data.url,
                  });
                }
                setPImagesList(uploaded);
              } catch (err: any) {
                console.error(err);
                setUploadError(err.message || "Error uploading file");
              } finally {
                setIsUploading(false);
              }
            }}
            disabled={isUploading}
            className="hidden"
            id="image-upload-input"
          />
          <label
            htmlFor="image-upload-input"
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/60 rounded-xl p-6 text-center cursor-pointer transition",
              isUploading && "opacity-50 pointer-events-none"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <FaSpinner className="animate-spin text-blue-500 text-lg" />
                <span className="text-xs text-gray-400 font-medium">Uploading images...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <FaPlus className="text-gray-500 text-sm" />
                <span className="text-xs text-gray-300 font-semibold">Click to upload images</span>
                <span className="text-[9px] text-gray-500">Supports PNG, JPG, WebP</span>
              </div>
            )}
          </label>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Or paste image URL..."
            value={manualImageUrl}
            onChange={(e) => setManualImageUrl(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              if (!manualImageUrl.trim()) return;
              setPImagesList(prev => [
                ...prev,
                { no: prev.length + 1, src: manualImageUrl.trim() }
              ]);
              setManualImageUrl("");
            }}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition"
          >
            Add URL
          </button>
        </div>

        {uploadError && (
          <p className="text-red-500 text-[10px] mt-1 font-medium">{uploadError}</p>
        )}
      </div>

      {/* Project Tags Section */}
      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-4">
        <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
          Project Tags
        </span>

        {/* Selected Tags */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Selected Tags</label>
          {pTags.length === 0 ? (
            <span className="text-xs text-gray-505 italic block">No tags selected. Add some below.</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {pTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-500 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                >
                  <span>{getTagTitle(tag)}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className="text-blue-400 hover:text-blue-200 cursor-pointer font-bold text-sm leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add Custom Tag Input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type custom tag (e.g. thesis, casualWeb)..."
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomTag();
              }
            }}
            className="flex-1 bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition"
          >
            Add Tag
          </button>
        </div>

        {/* Dynamic Suggestions */}
        {getSuggestedTags().length > 0 && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Suggestions</label>
            <div className="flex flex-wrap gap-1.5">
              {getSuggestedTags().map((tagKey) => (
                <button
                  key={tagKey}
                  type="button"
                  onClick={() => handleToggleTag(tagKey)}
                  className="px-2.5 py-1 rounded-lg text-[10px] bg-neutral-900/60 border border-neutral-800/80 text-gray-400 hover:border-neutral-700 hover:text-gray-300 transition cursor-pointer font-semibold"
                >
                  + {getTagTitle(tagKey)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tech Stacks Section */}
      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-4">
        <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
          Tech Stacks
        </span>

        {/* Selected Techs */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Selected Techs</label>
          {pTechs.length === 0 ? (
            <span className="text-xs text-gray-505 italic block">No techs selected. Add some below.</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {pTechs.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 bg-cyan-600/20 border border-cyan-500 text-cyan-300 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                >
                  <span>{getTechTitle(tech)}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleTech(tech)}
                    className="text-cyan-400 hover:text-cyan-200 cursor-pointer font-bold text-sm leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add Custom Tech Input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type custom tech (e.g. tailwind, supabase)..."
            value={customTechInput}
            onChange={(e) => setCustomTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomTech();
              }
            }}
            className="flex-1 bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleAddCustomTech}
            className="bg-neutral-800 hover:bg-neutral-755 border border-neutral-700 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition"
          >
            Add Tech
          </button>
        </div>

        {/* Dynamic Suggestions */}
        {getSuggestedTechs().length > 0 && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Suggestions</label>
            <div className="flex flex-wrap gap-1.5">
              {getSuggestedTechs().map((techKey) => (
                <button
                  key={techKey}
                  type="button"
                  onClick={() => handleToggleTech(techKey)}
                  className="px-2.5 py-1 rounded-lg text-[10px] bg-neutral-900/60 border border-neutral-800/80 text-gray-400 hover:border-neutral-700 hover:text-gray-300 transition cursor-pointer font-semibold"
                >
                  + {getTechTitle(techKey)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Links Section */}
      <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
        <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
          Project Links
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-semibold block">GitHub URL</label>
            <input
              type="url"
              value={pGithub}
              onChange={(e) => setPGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-semibold block">Live Demo URL</label>
            <input
              type="url"
              value={pDemo}
              onChange={(e) => setPDemo(e.target.value)}
              placeholder="https://..."
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-semibold block">WhatsApp / Contact Link</label>
            <input
              type="url"
              value={pContact}
              onChange={(e) => setPContact(e.target.value)}
              placeholder="https://wa.me/..."
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-semibold block">Figma Link</label>
            <input
              type="url"
              value={pFigma}
              onChange={(e) => setPFigma(e.target.value)}
              placeholder="https://figma.com/file/..."
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] text-gray-500 font-semibold block">Behance Link</label>
            <input
              type="url"
              value={pBehance}
              onChange={(e) => setPBehance(e.target.value)}
              placeholder="https://behance.net/gallery/..."
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {projectError && (
        <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
          {projectError}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer text-center"
        >
          Back to List
        </button>

        <button
          type="submit"
          disabled={isSavingProject}
          className="flex-1 relative bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer font-bold"
        >
          {isSavingProject ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Save Project"
          )}
        </button>
      </div>
    </form>
  );
}
