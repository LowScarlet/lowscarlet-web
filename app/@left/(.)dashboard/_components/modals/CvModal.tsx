/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import { SiReaddotcv } from "react-icons/si";
import Modal from "@/components/utils/Modal";
import { cn } from "@/libs/utils";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvAtsUrl: string;
  cvCreativeUrl: string;
  onUpdateConfig: (key: "CV_ATS_URL" | "CV_CREATIVE_URL", value: string) => void;
}

export default function CvModal({
  isOpen,
  onClose,
  cvAtsUrl,
  cvCreativeUrl,
  onUpdateConfig,
}: CvModalProps) {
  const [isUploadingAts, setIsUploadingAts] = useState(false);
  const [isUploadingCreative, setIsUploadingCreative] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cvSuccess, setCvSuccess] = useState("");

  const handleUploadCv = async (type: "ats" | "creative", file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setCvError("Hanya file PDF yang diperbolehkan!");
      return;
    }

    setCvError("");
    setCvSuccess("");
    if (type === "ats") setIsUploadingAts(true);
    else setIsUploadingCreative(true);

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengunggah file CV.");
      }

      const data = await res.json();
      const uploadedUrl = data.url;

      const configKey = type === "ats" ? "CV_ATS_URL" : "CV_CREATIVE_URL";
      const patchRes = await fetch(`/api/config/${configKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: uploadedUrl }),
      });

      if (patchRes.ok) {
        onUpdateConfig(configKey, uploadedUrl);
        setCvSuccess(`CV ${type === "ats" ? "ATS" : "Creative"} berhasil diperbarui!`);
      } else {
        throw new Error("Gagal menyimpan konfigurasi CV ke database.");
      }
    } catch (err: any) {
      console.error(err);
      setCvError(err.message || "Terjadi kesalahan saat mengunggah CV.");
    } finally {
      if (type === "ats") setIsUploadingAts(false);
      else setIsUploadingCreative(false);
    }
  };

  const handleResetCv = async (type: "ats" | "creative") => {
    setCvError("");
    setCvSuccess("");
    const defaultUrl = type === "ats" ? "/resume_ats.pdf" : "/cv-creative.pdf";
    const configKey = type === "ats" ? "CV_ATS_URL" : "CV_CREATIVE_URL";

    try {
      const patchRes = await fetch(`/api/config/${configKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: defaultUrl }),
      });

      if (patchRes.ok) {
        onUpdateConfig(configKey, defaultUrl);
        setCvSuccess(`CV ${type === "ats" ? "ATS" : "Creative"} berhasil di-reset ke default!`);
      } else {
        throw new Error("Gagal me-reset konfigurasi CV di database.");
      }
    } catch (err: any) {
      console.error(err);
      setCvError(err.message || "Terjadi kesalahan saat me-reset CV.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
              {cvCreativeUrl === "/cv-creative.pdf" ? "Default Local" : "Custom Cloud"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[11px] text-gray-400 break-all bg-neutral-950 px-2 py-1.5 rounded-md border border-neutral-855">
              <span className="block text-[9px] text-gray-650 uppercase font-bold">Current Link:</span>
              <Link
                href={cvCreativeUrl || "/cv-creative.pdf"}
                target="_blank"
                className="text-pink-400 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
              >
                {cvCreativeUrl || "/cv-creative.pdf"}
              </Link>
            </div>

            <div className="flex gap-2 mt-1">
              <input
                type="file"
                accept=".pdf"
                id="creative-cv-upload"
                className="hidden"
                disabled={isUploadingCreative}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadCv("creative", file);
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

              {cvCreativeUrl !== "/cv-creative.pdf" && (
                <button
                  type="button"
                  onClick={() => handleResetCv("creative")}
                  className="bg-neutral-800 hover:bg-neutral-755 border border-neutral-700 text-gray-300 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition"
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
              {cvAtsUrl === "/resume_ats.pdf" ? "Default Local" : "Custom Cloud"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-[11px] text-gray-400 break-all bg-neutral-950 px-2 py-1.5 rounded-md border border-neutral-855">
              <span className="block text-[9px] text-gray-650 uppercase font-bold">Current Link:</span>
              <Link
                href={cvAtsUrl || "/resume_ats.pdf"}
                target="_blank"
                className="text-violet-400 hover:underline inline-flex items-center gap-1 font-medium mt-0.5"
              >
                {cvAtsUrl || "/resume_ats.pdf"}
              </Link>
            </div>

            <div className="flex gap-2 mt-1">
              <input
                type="file"
                accept=".pdf"
                id="ats-cv-upload"
                className="hidden"
                disabled={isUploadingAts}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadCv("ats", file);
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

              {cvAtsUrl !== "/resume_ats.pdf" && (
                <button
                  type="button"
                  onClick={() => handleResetCv("ats")}
                  className="bg-neutral-800 hover:bg-neutral-755 border border-neutral-700 text-gray-300 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition"
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
          onClick={onClose}
          className="w-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-gray-400 font-semibold py-2 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer font-bold"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
