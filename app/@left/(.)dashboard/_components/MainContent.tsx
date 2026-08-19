/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoWarningOutline } from "react-icons/io5";
import { AppConfigMap } from "@/db/queries/config";

// Subcomponents - Widgets
import DashboardHeader from "./widgets/DashboardHeader";
import StatsCard from "./widgets/StatsCard";
import StatusCard from "./widgets/StatusCard";
import CvCard from "./widgets/CvCard";
import AdminToolsCard from "./widgets/AdminToolsCard";
import SocialLinksCard from "./widgets/SocialLinksCard";
import CommitList from "./widgets/CommitList";

// Subcomponents - Modals
import StatusModal from "./modals/StatusModal";
import SocialModal from "./modals/SocialModal";
import PreviewModal from "./modals/PreviewModal";
import ProjectsModal from "./modals/ProjectsModal";
import ProfileModal from "./modals/ProfileModal";
import CoverLetterModal from "./modals/CoverLetterModal";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MainContent({
  config,
}: {
  config: AppConfigMap;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals Visibility
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);

  // Centralized Config / Projects state
  const [currentConfig, setCurrentConfig] = useState<AppConfigMap>(config);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [previewPdfUrl, setPreviewPdfUrl] = useState("");
  const [previewPdfTitle, setPreviewPdfTitle] = useState("");

  const fetchAllProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAllProjects();
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAdmin(false);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleSaveStatus = async (status: string, note: string) => {
    const statusRes = await fetch("/api/config/STATUS", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: status }),
    });

    const noteRes = await fetch("/api/config/STATUS_NOTE", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: note }),
    });

    if (statusRes.ok && noteRes.ok) {
      setCurrentConfig((prev) => ({
        ...prev,
        STATUS: status,
        STATUS_NOTE: note,
      }));
    } else {
      throw new Error("Failed to update status");
    }
  };

  const handleSaveSocials = async (socials: {
    github: string;
    instagram: string;
    linkedin: string;
    email: string;
    whatsapp: string;
    discord: string;
  }) => {
    const gitRes = await fetch("/api/config/SOCIAL_GITHUB", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: socials.github }),
    });

    const igRes = await fetch("/api/config/SOCIAL_INSTAGRAM", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: socials.instagram }),
    });

    const liRes = await fetch("/api/config/SOCIAL_LINKEDIN", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: socials.linkedin }),
    });

    const emailRes = await fetch("/api/config/SOCIAL_EMAIL", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: socials.email }),
    });

    const waRes = await fetch("/api/config/SOCIAL_WHATSAPP", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: socials.whatsapp }),
    });

    const dcRes = await fetch("/api/config/SOCIAL_DISCORD", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: socials.discord }),
    });

    if (gitRes.ok && igRes.ok && liRes.ok && emailRes.ok && waRes.ok && dcRes.ok) {
      setCurrentConfig((prev) => ({
        ...prev,
        SOCIAL_GITHUB: socials.github,
        SOCIAL_INSTAGRAM: socials.instagram,
        SOCIAL_LINKEDIN: socials.linkedin,
        SOCIAL_EMAIL: socials.email,
        SOCIAL_WHATSAPP: socials.whatsapp,
        SOCIAL_DISCORD: socials.discord,
      }));
    } else {
      throw new Error("Failed to update one of the social media links.");
    }
  };

  const handleUpdateConfig = (key: "CV_ATS_URL" | "CV_CREATIVE_URL", value: string) => {
    setCurrentConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePreviewCv = (url: string, title: string) => {
    setPreviewPdfUrl(url);
    setPreviewPdfTitle(title);
    setShowPreviewModal(true);
  };

  return (
    <>
      {/* Dashboard Top Navigation */}
      <DashboardHeader
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onManageProfile={() => setShowProfileModal(true)}
      />

      {/* Main Widgets Container */}
      <div className="space-y-4 px-6 py-2 overflow-y-auto text-gray-400 grow">

        {/* Under Development Notice */}
        {/* <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-xl overflow-hidden font-bold text-white text-left"
        >
          <div className="absolute inset-0 bg-white/10 opacity-30 blur-xl" />
          <h1 className="z-10 relative flex items-center space-x-2">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
            >
              <IoWarningOutline />
            </motion.span>
            <span>Sorry, the website is currently under development</span>
          </h1>
        </motion.div> */}

        {/* Dynamic Interactive Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {/* Stats Widget */}
          <StatsCard
            isAdmin={isAdmin}
            visitorsCount={currentConfig.VISITORS_COUNT ?? 0}
            projectsCount={projectsList.length || currentConfig.PROJECTS_COUNT || 0}
            onManageProjects={() => setShowProjectsModal(true)}
          />

          {/* Status Widget */}
          <StatusCard
            isAdmin={isAdmin}
            status={currentConfig.STATUS || "AVAILABLE_FOR_WORK"}
            statusNote={currentConfig.STATUS_NOTE || ""}
            onEditStatus={() => setShowEditModal(true)}
          />
        </motion.div>

        {/* Admin Tools Widget (admin only) */}
        {isAdmin && <AdminToolsCard onOpenCoverLetter={() => setShowCoverLetterModal(true)} />}

        {/* Curriculum Vitae Widget */}
        <CvCard
          onPreviewCv={handlePreviewCv}
        />

        {/* Social Connections Widget */}
        <SocialLinksCard
          isAdmin={isAdmin}
          socialGithub={currentConfig.SOCIAL_GITHUB || "https://github.com/LowScarlet"}
          socialInstagram={currentConfig.SOCIAL_INSTAGRAM || "https://www.instagram.com/lowscarl3t"}
          socialLinkedin={currentConfig.SOCIAL_LINKEDIN || "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221"}
          socialEmail={currentConfig.SOCIAL_EMAIL || "tegarmaulanafahreza.email@gmail.com"}
          socialWhatsapp={currentConfig.SOCIAL_WHATSAPP || "https://wa.me/6281270634992"}
          socialDiscord={currentConfig.SOCIAL_DISCORD || "https://discord.com/users/lowscarlet"}
          onManageSocial={() => setShowSocialModal(true)}
        />

        {/* Commits History Widget */}
        <CommitList />
      </div>

      {/* Orchestrated Modals */}
      <StatusModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialStatus={currentConfig.STATUS || "AVAILABLE_FOR_WORK"}
        initialStatusNote={currentConfig.STATUS_NOTE || ""}
        onSave={handleSaveStatus}
      />

      <SocialModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        initialSocials={{
          github: currentConfig.SOCIAL_GITHUB || "https://github.com/LowScarlet",
          instagram: currentConfig.SOCIAL_INSTAGRAM || "https://www.instagram.com/lowscarl3t",
          linkedin: currentConfig.SOCIAL_LINKEDIN || "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221",
          email: currentConfig.SOCIAL_EMAIL || "tegarmaulanafahreza.email@gmail.com",
          whatsapp: currentConfig.SOCIAL_WHATSAPP || "https://wa.me/6281270634992",
          discord: currentConfig.SOCIAL_DISCORD || "https://discord.com/users/lowscarlet",
        }}
        onSave={handleSaveSocials}
      />

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewPdfUrl("");
          setPreviewPdfTitle("");
        }}
        pdfUrl={previewPdfUrl}
        pdfTitle={previewPdfTitle}
      />

      <ProjectsModal
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        onProjectsChanged={fetchAllProjects}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onCvDataUpdated={() => {
          // Re-fetch projects or config if needed
          fetchAllProjects();
        }}
      />

      <CoverLetterModal
        isOpen={showCoverLetterModal}
        onClose={() => setShowCoverLetterModal(false)}
      />
    </>
  );
}