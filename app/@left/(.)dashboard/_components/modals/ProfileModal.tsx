/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import { FaUserEdit, FaSpinner } from "react-icons/fa";
import Modal from "@/components/utils/Modal";
import { cn } from "@/libs/utils";

import ProfileTab from "./profile-tabs/ProfileTab";
import EducationsTab from "./profile-tabs/EducationsTab";
import ExperiencesTab from "./profile-tabs/ExperiencesTab";
import CertificationsTab from "./profile-tabs/CertificationsTab";
import SkillsTab from "./profile-tabs/SkillsTab";
import VolunteersTab from "./profile-tabs/VolunteersTab";
import LanguagesTab from "./profile-tabs/LanguagesTab";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCvDataUpdated: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onCvDataUpdated,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "educations" | "experiences" | "certifications" | "skills" | "volunteers" | "languages"
  >("profile");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cvData, setCvData] = useState<any>({
    profile: null,
    educations: [],
    experiences: [],
    certifications: [],
    skills: [],
    volunteers: [],
    languages: [],
  });

  const fetchCvData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cv");
      if (!res.ok) throw new Error("Failed to load profile & CV data");
      const json = await res.json();
      if (json.success) {
        setCvData(json.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCvData(false);
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleRefresh = () => {
    fetchCvData(true);
    onCvDataUpdated();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <FaUserEdit className="text-cyan-400 text-lg" />
          <span className="font-bold text-white text-base">Manage Profile & CV Data</span>
        </div>
      }
    >
      <div className="space-y-4 max-h-[75vh] flex flex-col text-left">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 shrink-0 gap-1 overflow-x-auto pb-1 text-xs">
          {[
            { id: "profile", label: "1. Profil" },
            { id: "educations", label: "2. Pendidikan" },
            { id: "experiences", label: "3. Pengalaman" },
            { id: "certifications", label: "4. Sertifikasi" },
            { id: "skills", label: "5. Skill Set" },
            { id: "volunteers", label: "6. Volunteer" },
            { id: "languages", label: "7. Bahasa (Languages)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setError("");
                setSuccess("");
              }}
              className={cn(
                "px-3 py-2 rounded-t-lg font-semibold transition cursor-pointer shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-neutral-800 text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-neutral-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs font-semibold shrink-0">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs font-semibold shrink-0">
            {success}
          </div>
        )}

        {/* Active Tab Content */}
        {loading ? (
          <div className="py-12 flex justify-center items-center text-cyan-400 space-x-2 text-xs">
            <FaSpinner className="animate-spin text-lg" />
            <span>Memuat Data CV...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1">
            {activeTab === "profile" && (
              <ProfileTab
                profile={cvData.profile}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
            {activeTab === "educations" && (
              <EducationsTab
                educationsList={cvData.educations}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
            {activeTab === "experiences" && (
              <ExperiencesTab
                experiencesList={cvData.experiences}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
            {activeTab === "certifications" && (
              <CertificationsTab
                certificationsList={cvData.certifications}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
            {activeTab === "skills" && (
              <SkillsTab
                skillsList={cvData.skills}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
            {activeTab === "volunteers" && (
              <VolunteersTab
                volunteersList={cvData.volunteers}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
            {activeTab === "languages" && (
              <LanguagesTab
                languagesList={cvData.languages}
                onRefresh={handleRefresh}
                setParentSuccess={setSuccess}
                setParentError={setError}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-gray-400 font-semibold py-2 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
