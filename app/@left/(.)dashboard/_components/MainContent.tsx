/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { FaBlog, FaCode, FaRegFolder, FaUsers, FaLock, FaLockOpen, FaEdit, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import { LuExpand } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SiReaddotcv } from "react-icons/si";
import { GrUpdate } from "react-icons/gr";
import { IoWarningOutline } from "react-icons/io5";
import { FiGithub, FiInstagram, FiMail } from "react-icons/fi";
import { BiLogoLinkedin } from "react-icons/bi";
import { AppConfigMap } from "@/db/queries/config";
import { Counter } from "@/components/utils/Counter";
import { cn } from "@/libs/utils";
import Modal from "@/components/utils/Modal";

const blogs = [
  {
    image: '/test.png',
    title: 'Build Modern Web',
    desc: 'Exploring modern web development with Next.js and Tailwind.',
  },
  {
    image: '/pp.png',
    title: 'UI & Animation',
    desc: 'Creating smooth UI and micro-interactions with Framer Motion.',
  },
];

const staticCommits = [
  {
    message: "feat: add dashboard layout",
    date: "2026-04-12",
  },
  {
    message: "fix: improve mobile responsiveness",
    date: "2026-04-11",
  },
  {
    message: "style: refine UI spacing",
    date: "2026-04-10",
  },
  {
    message: "feat: add blog carousel",
    date: "2026-04-09",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function MainContent({
  config,
}: {
  config: AppConfigMap;
}) {
  const [index, setIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentConfig, setCurrentConfig] = useState<AppConfigMap>(config);

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(config.STATUS ?? "AVAILABLE_FOR_WORK");
  const [statusNote, setStatusNote] = useState(config.STATUS_NOTE ?? "");
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [activeView, setActiveView] = useState<"list" | "add" | "edit">("list");
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [commitsList, setCommitsList] = useState<any[]>(staticCommits);

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
  const [pGithub, setPGithub] = useState("");
  const [pDemo, setPDemo] = useState("");
  const [pContact, setPContact] = useState("");
  const [pFigma, setPFigma] = useState("");
  const [pBehance, setPBehance] = useState("");
  const [pContributors, setPContributors] = useState(""); // comma separated
  const [pStartDate, setPStartDate] = useState("");
  const [pReleaseDate, setPReleaseDate] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectError, setProjectError] = useState("");

  const [showCvModal, setShowCvModal] = useState(false);
  const [isUploadingAts, setIsUploadingAts] = useState(false);
  const [isUploadingCreative, setIsUploadingCreative] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cvSuccess, setCvSuccess] = useState("");

  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialGithub, setSocialGithub] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialEmail, setSocialEmail] = useState("");
  const [socialError, setSocialError] = useState("");
  const [socialSuccess, setSocialSuccess] = useState("");
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);

  const availableTags = [
    { key: "finalProjectThesis", title: "Undergraduate Final Project" },
    { key: "casualWebsite", title: "Casual Website" },
    { key: "webApplication", title: "Web Application" },
    { key: "androidApp", title: "Android Application" },
    { key: "mobileApplication", title: "Mobile Application" },
    { key: "gameDevelopment", title: "Game Development" },
    { key: "indieGame", title: "Indie Game" },
    { key: "desktopApp", title: "Desktop Application" },
    { key: "iotProject", title: "IoT & Hardware" },
    { key: "uiuxDesign", title: "UI/UX Design" }
  ];

  const availableTechs = [
    { key: "nextJs", title: "Next.js" },
    { key: "expressJs", title: "Express.js" },
    { key: "prismaOrm", title: "Prisma ORM" },
    { key: "drizzleOrm", title: "Drizzle ORM" },
    { key: "postgreSql", title: "PostgreSql" },
    { key: "railway", title: "Railway" },
    { key: "vercel", title: "Vercel" },
    { key: "kotlin", title: "Kotlin" },
    { key: "java", title: "Java" },
    { key: "flutter", title: "Flutter" },
    { key: "reactNative", title: "React Native" },
    { key: "androidStudio", title: "Android Studio" },
    { key: "unity", title: "Unity" },
    { key: "cSharp", title: "C#" },
    { key: "unrealEngine", title: "Unreal Engine" },
    { key: "godot", title: "Godot" },
    { key: "cPlusPlus", title: "C++" },
    { key: "figma", title: "Figma" },
    { key: "behance", title: "Behance" },
    { key: "arduino", title: "Arduino" },
    { key: "raspberryPi", title: "Raspberry Pi" }
  ];

  const fetchAllProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (showProjectsModal) {
      fetchAllProjects();
    }
  }, [showProjectsModal]);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAllProjects();
      } else {
        alert("Failed to delete project");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting project");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
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
    };

    try {
      const url = activeView === "edit" ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = activeView === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setActiveView("list");
        setEditingProject(null);
        resetProjectForm();
        fetchAllProjects();
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

  const resetProjectForm = () => {
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
  };

  const startEditProject = (project: any) => {
    setEditingProject(project);
    setPTitle(project.title || "");
    setPCategory(project.category || "webs");
    setPDescription(project.description || "");

    setPImagesList(project.images || []);
    setManualImageUrl("");
    setUploadError("");

    setPTags(project.tags || []);
    setPTechs(project.techs || []);

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
    setActiveView("edit");
  };

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

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await fetch("/api/commits");
        if (res.ok) {
          const data = await res.json();
          setCommitsList(data);
        }
      } catch (e) {
        console.error("Failed to fetch commits from server:", e);
      }
    };
    fetchCommits();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setIsAdmin(data.authenticated);
      } catch (e) {
        console.error(e);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (blogs.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % blogs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAdmin(false);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmittingLogin(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAdmin(true);
        setShowLoginModal(false);
        setPassword("");
      } else {
        const data = await res.json();
        setLoginError(data.message || "Invalid password");
      }
    } catch (e) {
      console.error(e);
      setLoginError("Failed to login");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError("");
    setIsSubmittingStatus(true);
    try {
      const statusRes = await fetch("/api/config/STATUS", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: selectedStatus }),
      });

      const noteRes = await fetch("/api/config/STATUS_NOTE", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: statusNote }),
      });

      if (statusRes.ok && noteRes.ok) {
        setCurrentConfig((prev) => ({
          ...prev,
          STATUS: selectedStatus,
          STATUS_NOTE: statusNote,
        }));
        setShowEditModal(false);
      } else {
        setStatusError("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      setStatusError("Failed to connect to API");
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const handleUploadCv = async (type: 'ats' | 'creative', file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setCvError("Hanya file PDF yang diperbolehkan!");
      return;
    }

    setCvError("");
    setCvSuccess("");
    if (type === 'ats') setIsUploadingAts(true);
    else setIsUploadingCreative(true);

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengunggah file CV.");
      }

      const data = await res.json();
      const uploadedUrl = data.url;

      const configKey = type === 'ats' ? 'CV_ATS_URL' : 'CV_CREATIVE_URL';
      const patchRes = await fetch(`/api/config/${configKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: uploadedUrl }),
      });

      if (patchRes.ok) {
        setCurrentConfig(prev => ({
          ...prev,
          [configKey]: uploadedUrl
        }));
        setCvSuccess(`CV ${type === 'ats' ? 'ATS' : 'Creative'} berhasil diperbarui!`);
      } else {
        throw new Error("Gagal menyimpan konfigurasi CV ke database.");
      }
    } catch (err: any) {
      console.error(err);
      setCvError(err.message || "Terjadi kesalahan saat mengunggah CV.");
    } finally {
      if (type === 'ats') setIsUploadingAts(false);
      else setIsUploadingCreative(false);
    }
  };

  const handleResetCv = async (type: 'ats' | 'creative') => {
    setCvError("");
    setCvSuccess("");
    const defaultUrl = type === 'ats' ? '/resume_ats.pdf' : '/cv-creative.pdf';
    const configKey = type === 'ats' ? 'CV_ATS_URL' : 'CV_CREATIVE_URL';

    try {
      const patchRes = await fetch(`/api/config/${configKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: defaultUrl }),
      });

      if (patchRes.ok) {
        setCurrentConfig(prev => ({
          ...prev,
          [configKey]: defaultUrl
        }));
        setCvSuccess(`CV ${type === 'ats' ? 'ATS' : 'Creative'} berhasil di-reset ke default!`);
      } else {
        throw new Error("Gagal me-reset konfigurasi CV di database.");
      }
    } catch (err: any) {
      console.error(err);
      setCvError(err.message || "Terjadi kesalahan saat me-reset CV.");
    }
  };

  const handleUpdateSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialError("");
    setSocialSuccess("");
    setIsSubmittingSocial(true);

    try {
      const gitRes = await fetch("/api/config/SOCIAL_GITHUB", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: socialGithub }),
      });

      const igRes = await fetch("/api/config/SOCIAL_INSTAGRAM", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: socialInstagram }),
      });

      const liRes = await fetch("/api/config/SOCIAL_LINKEDIN", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: socialLinkedin }),
      });

      const emailRes = await fetch("/api/config/SOCIAL_EMAIL", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: socialEmail }),
      });

      if (gitRes.ok && igRes.ok && liRes.ok && emailRes.ok) {
        setCurrentConfig((prev) => ({
          ...prev,
          SOCIAL_GITHUB: socialGithub,
          SOCIAL_INSTAGRAM: socialInstagram,
          SOCIAL_LINKEDIN: socialLinkedin,
          SOCIAL_EMAIL: socialEmail,
        }));
        setSocialSuccess("Link media sosial berhasil diperbarui!");
        setTimeout(() => {
          setShowSocialModal(false);
        }, 1200);
      } else {
        setSocialError("Gagal memperbarui salah satu link media sosial.");
      }
    } catch (err) {
      console.error(err);
      setSocialError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsSubmittingSocial(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="flex items-center space-x-2">
          <FaRegFolder />
          <span>Dashboard</span>
        </h1>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              if (isAdmin) {
                handleLogout();
              } else {
                setShowLoginModal(true);
              }
            }}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 flex items-center p-1"
            title={isAdmin ? "Logout Admin" : "Login Admin"}
          >
            {isAdmin ? <FaLockOpen className="text-lg text-green-400" /> : <FaLock className="text-lg" />}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer"
          >
            <LuExpand />
          </button>

          <Link scroll={false} href="/">
            <IoMdClose className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 px-6 py-2 overflow-y-auto text-gray-400 grow">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-xl overflow-hidden font-bold text-white"
        >
          {/* glow effect */}
          <div className="absolute inset-0 bg-white/10 opacity-30 blur-xl" />

          <h1 className="z-10 relative flex items-center space-x-2">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <IoWarningOutline />
            </motion.span>

            <span>
              Sorry, the website is currently under development
            </span>
          </h1>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {/* STATS */}
          <div className="gap-3 grid grid-cols-2">

            <motion.div
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="relative bg-neutral-800 p-4 rounded-xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 to-violet-500/10" />

              <div className="z-10 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-400 text-xs">Visitors</h2>
                  <FaUsers className="text-pink-400 text-sm" />
                </div>
                <p className="mt-1 font-bold text-white text-xl"><Counter value={config.VISITORS_COUNT ?? 0} /></p>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                if (isAdmin) {
                  setActiveView("list");
                  setShowProjectsModal(true);
                }
              }}
              className={cn(
                "relative bg-neutral-800 p-4 rounded-xl overflow-hidden",
                isAdmin ? "cursor-pointer border border-dashed border-blue-500/40 hover:bg-neutral-700/80" : "cursor-default"
              )}
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10" />

              <div className="z-10 relative">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-gray-400 text-xs font-semibold">Projects</h2>
                    {isAdmin && (
                      <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1 py-0.2 rounded font-mono">
                        Manage
                      </span>
                    )}
                  </div>
                  <FaCode className="text-blue-400 text-sm" />
                </div>
                <p className="mt-1 font-bold text-white text-xl">
                  <Counter value={projectsList.length || config.PROJECTS_COUNT || 0} />
                </p>
              </div>
            </motion.div>

          </div>

          {/* STATUS */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (isAdmin) {
                setSelectedStatus(currentConfig.STATUS);
                setStatusNote(currentConfig.STATUS_NOTE || "");
                setShowEditModal(true);
              }
            }}
            className={cn(
              "flex justify-between items-center bg-neutral-800 p-4 rounded-xl transition",
              isAdmin && "hover:bg-neutral-700/80 cursor-pointer border border-dashed border-violet-500/40"
            )}
          >
            <div className="grow">
              <div className="flex items-center gap-2">
                <h2 className="text-gray-400 text-xs font-semibold">Status</h2>
                {isAdmin && (
                  <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                    <FaEdit size={10} /> Edit Mode
                  </span>
                )}
              </div>

              <p
                className={cn(
                  "font-medium mt-1 text-sm sm:text-base",
                  currentConfig?.STATUS === "AVAILABLE"
                    ? "text-green-400"
                    : currentConfig?.STATUS === "NOT_AVAILABLE"
                      ? "text-red-400"
                      : "text-violet-500"
                )}
              >
                {currentConfig.STATUS_NOTE ?? "Doing Something..."}
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-2",
                currentConfig?.STATUS === "AVAILABLE"
                  ? "text-green-400"
                  : currentConfig?.STATUS === "NOT_AVAILABLE"
                    ? "text-red-400"
                    : "text-violet-500"
              )}
            >
              <span
                className={cn(
                  "rounded-full w-2 h-2 animate-pulse",
                  currentConfig?.STATUS === "AVAILABLE"
                    ? "bg-green-400"
                    : currentConfig?.STATUS === "NOT_AVAILABLE"
                      ? "bg-red-400"
                      : "bg-violet-500"
                )}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="flex items-center justify-between font-bold text-white text-xl">
            <span className="flex items-center space-x-2">
              <motion.span
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <SiReaddotcv />
              </motion.span>
              <span>My Curriculum Vitae</span>
            </span>
            {isAdmin && (
              <button
                onClick={() => {
                  setCvError("");
                  setCvSuccess("");
                  setShowCvModal(true);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-400 hover:text-white rounded-md cursor-pointer transition shadow-xs"
                title="Manage CVs"
              >
                <FaEdit size={14} />
              </button>
            )}
          </h1>

          <div className="flex gap-2">
            {/* CREATIVE */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex-1">
              <Link
                href={currentConfig.CV_CREATIVE_URL || "/cv-creative.pdf"}
                target="_blank"
                className="block relative bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-lg overflow-hidden font-medium text-white text-sm text-center"
              >
                {/* glow pulse */}
                <span className="absolute inset-0 bg-white/20 opacity-30 blur-lg" />
                Creative
              </Link>
            </motion.div>

            {/* ATS */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex-1">
              <Link
                href={currentConfig.CV_ATS_URL || "/resume_ats.pdf"}
                target="_blank"
                className="block relative bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg overflow-hidden font-medium text-sm text-center transition"
              >
                {/* subtle shine */}
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition" />
                ATS Version
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* SOCIAL CONNECTIONS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-2"
        >
          <h1 className="flex items-center justify-between font-bold text-white text-xl">
            <span className="flex items-center space-x-2">
              <FaUsers className="text-blue-400" />
              <span>Social Media Links</span>
            </span>
            {isAdmin && (
              <button
                onClick={() => {
                  setSocialGithub(currentConfig.SOCIAL_GITHUB || "https://github.com/LowScarlet");
                  setSocialInstagram(currentConfig.SOCIAL_INSTAGRAM || "https://www.instagram.com/lowscarl3t");
                  setSocialLinkedin(currentConfig.SOCIAL_LINKEDIN || "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221");
                  setSocialEmail(currentConfig.SOCIAL_EMAIL || "tegarmaulanafahreza.email@gmail.com");
                  setSocialError("");
                  setSocialSuccess("");
                  setShowSocialModal(true);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-400 hover:text-white rounded-md cursor-pointer transition shadow-xs"
                title="Manage Social Links"
              >
                <FaEdit size={14} />
              </button>
            )}
          </h1>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href={currentConfig.SOCIAL_GITHUB || "https://github.com/LowScarlet"}
              target="_blank"
              className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
            >
              <FiGithub className="text-blue-400 text-sm" />
              <span className="truncate">GitHub</span>
            </Link>
            <Link
              href={currentConfig.SOCIAL_INSTAGRAM || "https://www.instagram.com/lowscarl3t"}
              target="_blank"
              className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
            >
              <FiInstagram className="text-pink-400 text-sm" />
              <span className="truncate">Instagram</span>
            </Link>
            <Link
              href={currentConfig.SOCIAL_LINKEDIN || "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221"}
              target="_blank"
              className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
            >
              <BiLogoLinkedin className="text-blue-400 text-sm" />
              <span className="truncate">LinkedIn</span>
            </Link>
            <Link
              href={currentConfig.SOCIAL_EMAIL ? (currentConfig.SOCIAL_EMAIL.startsWith('mailto:') ? currentConfig.SOCIAL_EMAIL : 'mailto:' + currentConfig.SOCIAL_EMAIL) : 'mailto:tegarmaulanafahreza.email@gmail.com'}
              target="_blank"
              className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
            >
              <FiMail className="text-red-400 text-sm" />
              <span className="truncate">Email</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="flex items-center space-x-2 font-bold text-white text-xl">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FaBlog />
            </motion.span>
            <span>My Blog</span>
          </h1>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="group relative rounded-2xl w-full aspect-16/6 overflow-hidden"
          >

            {/* IMAGE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={blogs[index].image}
                  alt="blog cover"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                />
              </motion.div>
            </AnimatePresence>

            {/* GRADIENT + GLOW */}
            <div className="z-10 absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

            {/* TEXT */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bottom-0 z-20 absolute p-4 text-white"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-lg"
                >
                  {blogs[index].title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 text-sm line-clamp-2"
                >
                  {blogs[index].desc}
                </motion.p>
              </motion.div>
            </AnimatePresence>

          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="flex items-center space-x-2 font-bold text-white text-xl">
            <motion.span
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <GrUpdate />
            </motion.span>
            <span>My Website Commits</span>
          </h1>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="space-y-3 bg-neutral-800 p-4 rounded-xl"
          >
            {commitsList.map((commit, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ x: 4 }}
                className="group flex items-start gap-3 transition"
              >

                {/* DOT */}
                <div className="relative mt-1">
                  <span className="inline-flex absolute bg-green-400 opacity-75 blur-[2px] rounded-full w-2 h-2" />
                  <span className="block relative bg-green-400 rounded-full w-2 h-2 group-hover:scale-125 transition" />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col">
                  <span className="text-white group-hover:text-green-400 text-sm transition">
                    {commit.message}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(commit.date).toLocaleDateString()}
                  </span>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPassword("");
          setLoginError("");
        }}
        title={
          <>
            <FaLock className="text-violet-500" />
            <span>Admin Authentication</span>
          </>
        }
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              Enter Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-600 text-sm"
            />
          </div>

          {loginError && (
            <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmittingLogin}
            className="w-full relative bg-linear-to-r from-pink-500 to-violet-500 text-white font-medium py-2 rounded-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer font-bold"
          >
            {isSubmittingLogin ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setStatusError("");
        }}
        title={
          <>
            <FaEdit className="text-pink-500" />
            <span>Update My Status</span>
          </>
        }
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              Select Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm cursor-pointer"
            >
              <option value="AVAILABLE">AVAILABLE (Green)</option>
              <option value="NOT_AVAILABLE">NOT AVAILABLE (Red)</option>
              <option value="AVAILABLE_FOR_WORK">AVAILABLE FOR WORK (Purple)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
              Status Note
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Enter status note..."
              required
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-600 resize-none"
            />
          </div>

          {statusError && (
            <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {statusError}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 rounded-lg transition text-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmittingStatus}
              className="flex-1 relative bg-linear-to-r from-pink-500 to-violet-500 text-white font-medium py-2 rounded-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer font-bold"
            >
              {isSubmittingStatus ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Manage CVs Modal */}
      <Modal
        isOpen={showCvModal}
        onClose={() => {
          setShowCvModal(false);
          setCvError("");
          setCvSuccess("");
        }}
        title={
          <div className="flex items-center space-x-2">
            <SiReaddotcv className="text-pink-500 text-lg" />
            <span className="font-bold text-white text-base">Manage Curriculum Vitae</span>
          </div>
        }
      >
        <div className="space-y-4">
          {cvError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs font-semibold">
              {cvError}
            </div>
          )}
          {cvSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs font-semibold">
              {cvSuccess}
            </div>
          )}

          {/* CREATIVE CV CARD */}
          <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
            <div className="flex justify-between items-center border-b border-neutral-800/50 pb-1.5">
              <span className="block text-gray-300 text-xs font-bold uppercase tracking-wider">
                Creative CV
              </span>
              <span className="text-[9px] text-gray-500 font-mono">
                {currentConfig.CV_CREATIVE_URL === "/cv-creative.pdf" ? "Default Local" : "Custom Cloud"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[11px] text-gray-400 break-all bg-neutral-950 px-2 py-1.5 rounded-md border border-neutral-850">
                <span className="block text-[9px] text-gray-650 uppercase font-bold">Current Link:</span>
                <Link
                  href={currentConfig.CV_CREATIVE_URL || "/cv-creative.pdf"}
                  target="_blank"
                  className="text-pink-400 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
                >
                  {currentConfig.CV_CREATIVE_URL || "/cv-creative.pdf"}
                </Link>
              </div>

              <div className="flex gap-2 mt-1">
                {/* Upload Action */}
                <input
                  type="file"
                  accept=".pdf"
                  id="creative-cv-upload"
                  className="hidden"
                  disabled={isUploadingCreative}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadCv('creative', file);
                  }}
                />
                <label
                  htmlFor="creative-cv-upload"
                  className={cn(
                    "flex-1 bg-linear-to-r from-pink-500 to-violet-500 text-white font-semibold py-1.5 px-3 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center gap-1.5 cursor-pointer shadow-md",
                    isUploadingCreative && "opacity-50 pointer-events-none"
                  )}
                >
                  {isUploadingCreative ? (
                    <>
                      <FaSpinner className="animate-spin text-[10px]" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload New PDF</span>
                  )}
                </label>

                {/* Reset Action */}
                {currentConfig.CV_CREATIVE_URL !== "/cv-creative.pdf" && (
                  <button
                    type="button"
                    onClick={() => handleResetCv('creative')}
                    className="bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-gray-300 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ATS CV CARD */}
          <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
            <div className="flex justify-between items-center border-b border-neutral-800/50 pb-1.5">
              <span className="block text-gray-300 text-xs font-bold uppercase tracking-wider">
                ATS CV
              </span>
              <span className="text-[9px] text-gray-500 font-mono">
                {currentConfig.CV_ATS_URL === "/resume_ats.pdf" ? "Default Local" : "Custom Cloud"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[11px] text-gray-400 break-all bg-neutral-950 px-2 py-1.5 rounded-md border border-neutral-850">
                <span className="block text-[9px] text-gray-650 uppercase font-bold">Current Link:</span>
                <Link
                  href={currentConfig.CV_ATS_URL || "/resume_ats.pdf"}
                  target="_blank"
                  className="text-violet-400 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
                >
                  {currentConfig.CV_ATS_URL || "/resume_ats.pdf"}
                </Link>
              </div>

              <div className="flex gap-2 mt-1">
                {/* Upload Action */}
                <input
                  type="file"
                  accept=".pdf"
                  id="ats-cv-upload"
                  className="hidden"
                  disabled={isUploadingAts}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadCv('ats', file);
                  }}
                />
                <label
                  htmlFor="ats-cv-upload"
                  className={cn(
                    "flex-1 bg-linear-to-r from-pink-500 to-violet-500 text-white font-semibold py-1.5 px-3 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center gap-1.5 cursor-pointer shadow-md",
                    isUploadingAts && "opacity-50 pointer-events-none"
                  )}
                >
                  {isUploadingAts ? (
                    <>
                      <FaSpinner className="animate-spin text-[10px]" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload New PDF</span>
                  )}
                </label>

                {/* Reset Action */}
                {currentConfig.CV_ATS_URL !== "/resume_ats.pdf" && (
                  <button
                    type="button"
                    onClick={() => handleResetCv('ats')}
                    className="bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-gray-300 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3.5 mt-4">
          <button
            type="button"
            onClick={() => {
              setShowCvModal(false);
              setCvError("");
              setCvSuccess("");
            }}
            className="w-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-gray-400 font-semibold py-2 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer font-bold"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Manage Social Links Modal */}
      <Modal
        isOpen={showSocialModal}
        onClose={() => {
          setShowSocialModal(false);
          setSocialError("");
          setSocialSuccess("");
        }}
        title={
          <div className="flex items-center space-x-2">
            <FaUsers className="text-blue-500 text-lg" />
            <span className="font-bold text-white text-base">Manage Social Media Links</span>
          </div>
        }
      >
        <form onSubmit={handleUpdateSocial} className="space-y-4">
          {socialError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs font-semibold">
              {socialError}
            </div>
          )}
          {socialSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs font-semibold">
              {socialSuccess}
            </div>
          )}

          <div className="space-y-3">
            {/* GITHUB */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-semibold">GitHub URL</label>
              <input
                type="url"
                value={socialGithub}
                onChange={(e) => setSocialGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* INSTAGRAM */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-semibold">Instagram URL</label>
              <input
                type="url"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="https://www.instagram.com/..."
                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* LINKEDIN */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-semibold">LinkedIn URL</label>
              <input
                type="url"
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-semibold">Email Address</label>
              <input
                type="text"
                value={socialEmail}
                onChange={(e) => setSocialEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3.5 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowSocialModal(false);
                setSocialError("");
                setSocialSuccess("");
              }}
              className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-400 font-semibold py-2 px-4 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingSocial}
              className="flex-1 bg-linear-to-r from-pink-500 to-violet-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center cursor-pointer shadow-md disabled:opacity-50 font-bold"
            >
              {isSubmittingSocial ? (
                <FaSpinner className="animate-spin text-sm" />
              ) : (
                "Save Links"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Projects Management Modal */}
      <Modal
        isOpen={showProjectsModal}
        onClose={() => {
          setShowProjectsModal(false);
          setEditingProject(null);
          resetProjectForm();
        }}
        title={
          <>
            <FaCode className="text-blue-500" />
            <span>{activeView === "list" ? "Manage Projects" : activeView === "edit" ? "Edit Project" : "Add Project"}</span>
          </>
        }
        glowClass="bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500"
      >
        {/* Projects List View */}
        {activeView === "list" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-gray-400">Total: {projectsList.length} projects</h4>
              <button
                onClick={() => {
                  resetProjectForm();
                  setActiveView("add");
                }}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <FaPlus size={10} /> Add New
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="flex justify-center py-10">
                <FaSpinner className="animate-spin text-blue-500 text-xl" />
              </div>
            ) : projectsList.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                No projects found.
              </div>
            ) : (
              <div className="space-y-2">
                {projectsList.map((project) => (
                  <div
                    key={project.id}
                    className="flex justify-between items-center bg-neutral-950 p-3 rounded-lg border border-neutral-800/60 hover:border-neutral-700 transition"
                  >
                    <div className="truncate pr-2 text-left">
                      <p className="text-sm font-medium text-white truncate">{project.title}</p>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800/80">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEditProject(project)}
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded transition cursor-pointer"
                        title="Edit Project"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 bg-red-950/30 hover:bg-red-900/40 text-red-400 rounded transition cursor-pointer"
                        title="Delete Project"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add / Edit Form View */}
        {(activeView === "add" || activeView === "edit") && (
          <form onSubmit={handleSaveProject} className="space-y-4 text-left">
            {/* General Info Card */}
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
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm cursor-pointer"
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
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Description Area */}
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
                className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-gray-650 resize-y"
              />
            </div>

            {/* Premium Project Images Uploader */}
            <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
              <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
                Project Images
              </span>

              {/* List of current images */}
              {pImagesList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pImagesList.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden group aspect-video bg-neutral-900 border border-neutral-850 shadow-md">
                      <Image
                        src={img.src}
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

              {/* Upload controls */}
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

              {/* Manual URL input fallback */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-850 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-hidden focus:border-blue-500"
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

            {/* Chip Selector for Tags */}
            <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
              <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
                Project Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = pTags.includes(tag.key);
                  return (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => handleToggleTag(tag.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer font-semibold",
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                          : "bg-neutral-900/40 border-neutral-800/60 text-gray-400 hover:border-neutral-700"
                      )}
                    >
                      {tag.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chip Selector for Techs */}
            <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
              <span className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-800/50 pb-1.5">
                Tech Stacks
              </span>
              <div className="flex flex-wrap gap-2">
                {availableTechs.map((tech) => {
                  const isSelected = pTechs.includes(tech.key);
                  return (
                    <button
                      key={tech.key}
                      type="button"
                      onClick={() => handleToggleTech(tech.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer font-semibold",
                        isSelected
                          ? "bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-sm"
                          : "bg-neutral-900/40 border-neutral-800/60 text-gray-400 hover:border-neutral-700"
                      )}
                    >
                      {tech.title}
                    </button>
                  );
                })}
              </div>
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
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-semibold block">Live Demo URL</label>
                  <input
                    type="url"
                    value={pDemo}
                    onChange={(e) => setPDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-semibold block">WhatsApp / Contact Link</label>
                  <input
                    type="url"
                    value={pContact}
                    onChange={(e) => setPContact(e.target.value)}
                    placeholder="https://wa.me/..."
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-semibold block">Figma Link</label>
                  <input
                    type="url"
                    value={pFigma}
                    onChange={(e) => setPFigma(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-gray-500 font-semibold block">Behance Link</label>
                  <input
                    type="url"
                    value={pBehance}
                    onChange={(e) => setPBehance(e.target.value)}
                    placeholder="https://behance.net/gallery/..."
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-hidden focus:border-blue-500"
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
                onClick={() => {
                  setActiveView("list");
                  setEditingProject(null);
                  resetProjectForm();
                }}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer"
              >
                Back to List
              </button>

              <button
                type="submit"
                disabled={isSavingProject}
                className="flex-1 relative bg-linear-to-r from-blue-600 to-cyan-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer"
              >
                {isSavingProject ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Save Project"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}