/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import Modal from "@/components/utils/Modal";
import { SiReaddotcv } from "react-icons/si";
import { FaSpinner, FaExternalLinkAlt } from "react-icons/fa";
import AtsCvContent from "@/components/cv/AtsCvContent";
import CreativeCvContent from "@/components/cv/CreativeCvContent";
import Link from "next/link";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfTitle: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  pdfTitle,
}: PreviewModalProps) {
  const [cvData, setCvData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCreativeRoute = pdfUrl === "/cv/creative" || pdfTitle.toLowerCase().includes("creative");
  const isAtsRoute = pdfUrl === "/cv/ats" || pdfTitle.toLowerCase().includes("ats") || !isCreativeRoute;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError("");
      fetch("/api/cv")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load CV data");
          return res.json();
        })
        .then((json) => {
          if (json.success) {
            setCvData(json.data);
          } else {
            throw new Error(json.error || "Failed to load CV data");
          }
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || "Failed to load CV data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <SiReaddotcv className={isCreativeRoute ? "text-cyan-400 text-lg" : "text-pink-500 text-lg"} />
          <span className="font-bold text-white text-base">
            {isCreativeRoute ? "Live Creative CV Preview" : "Live ATS CV Preview"}
          </span>
        </div>
      }
    >
      <div className="space-y-4 flex flex-col h-[78vh]">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-3 bg-neutral-950/60 rounded-xl border border-neutral-800">
            <FaSpinner className="animate-spin text-pink-500 text-2xl" />
            <span className="text-xs text-gray-400 font-medium">Fetching CV Data from Database...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex justify-center items-center text-xs text-red-400 bg-neutral-950/60 rounded-xl border border-neutral-800 p-4">
            {error}
          </div>
        ) : cvData ? (
          isCreativeRoute ? (
            <div className="flex-1 overflow-y-auto bg-slate-400 text-slate-900 p-2 sm:p-4 rounded-xl shadow-xl font-sans text-left">
              {/* Creative CV Content (Includes Left Sidebar & Right Column with Header) */}
              <CreativeCvContent
                profile={cvData.profile}
                educations={cvData.educations}
                experiences={cvData.experiences}
                projects={cvData.projects}
                certifications={cvData.certifications}
                skills={cvData.skills}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-white text-gray-900 p-6 sm:p-8 rounded-xl shadow-xl font-sans text-left space-y-4">
              {/* Unified ATS CV Component (Header + Content) */}
              <AtsCvContent
                profile={cvData.profile}
                educations={cvData.educations}
                experiences={cvData.experiences}
                projects={cvData.projects}
                certifications={cvData.certifications}
                skills={cvData.skills}
              />
            </div>
          )
        ) : null}

        {/* Bottom Actions Bar */}
        <div className="flex gap-3 pt-2 shrink-0">
          <Link
            href={isCreativeRoute ? "/cv/creative" : "/cv/ats"}
            target="_blank"
            className={
              isCreativeRoute
                ? "flex-1 bg-linear-to-r from-cyan-600 via-indigo-600 to-blue-600 text-white text-center font-bold py-2 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center gap-2 shadow-md"
                : "flex-1 bg-linear-to-r from-pink-600 via-purple-600 to-violet-600 text-white text-center font-bold py-2 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center gap-2 shadow-md"
            }
          >
            <FaExternalLinkAlt size={12} />
            <span>Open Standalone & Print PDF</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-400 font-bold py-2 px-5 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
