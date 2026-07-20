/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import { FaUsers, FaSpinner } from "react-icons/fa";
import Modal from "@/components/utils/Modal";

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSocials: {
    github: string;
    instagram: string;
    linkedin: string;
    email: string;
  };
  onSave: (socials: {
    github: string;
    instagram: string;
    linkedin: string;
    email: string;
  }) => Promise<void>;
}

export default function SocialModal({
  isOpen,
  onClose,
  initialSocials,
  onSave,
}: SocialModalProps) {
  const [socialGithub, setSocialGithub] = useState(initialSocials.github);
  const [socialInstagram, setSocialInstagram] = useState(initialSocials.instagram);
  const [socialLinkedin, setSocialLinkedin] = useState(initialSocials.linkedin);
  const [socialEmail, setSocialEmail] = useState(initialSocials.email);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialError, setSocialError] = useState("");
  const [socialSuccess, setSocialSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSocialGithub(initialSocials.github);
      setSocialInstagram(initialSocials.instagram);
      setSocialLinkedin(initialSocials.linkedin);
      setSocialEmail(initialSocials.email);
      setSocialError("");
      setSocialSuccess("");
    }
  }, [isOpen, initialSocials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialError("");
    setSocialSuccess("");
    setIsSubmitting(true);

    try {
      await onSave({
        github: socialGithub,
        instagram: socialInstagram,
        linkedin: socialLinkedin,
        email: socialEmail,
      });
      setSocialSuccess("Link media sosial berhasil diperbarui!");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setSocialError(err.message || "Gagal memperbarui link media sosial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <FaUsers className="text-blue-500 text-lg" />
          <span className="font-bold text-white text-base">Manage Social Media Links</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
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
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
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
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
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
              className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3.5 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-gray-400 font-semibold py-2 px-4 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-linear-to-r from-pink-500 to-violet-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center cursor-pointer shadow-md disabled:opacity-50 font-bold"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin text-sm" />
            ) : (
              "Save Links"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
