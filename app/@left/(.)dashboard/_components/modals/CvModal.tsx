'use client'

import Link from "next/link";
import { SiReaddotcv } from "react-icons/si";
import { FaExternalLinkAlt } from "react-icons/fa";
import Modal from "@/components/utils/Modal";

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
}: CvModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <SiReaddotcv className="text-pink-500 text-lg" />
          <span className="font-bold text-white text-base">Curriculum Vitae Details</span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* ATS CV CARD */}
        <div className="border border-neutral-800/80 rounded-xl p-4 bg-neutral-950/40 space-y-3">
          <div className="flex justify-between items-center border-b border-neutral-800/50 pb-1.5">
            <span className="block text-gray-300 text-xs font-bold uppercase tracking-wider">
              ATS Version (Automated DB Generator)
            </span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live DB Auto-Generated
            </span>
          </div>

          <p className="text-xs text-gray-400">
            CV ATS digenerate secara otomatis secara real-time dari data PostgreSQL (Profile, Education, Experience, Projects, Certifications, dan Skills).
          </p>

          <div className="pt-1">
            <Link
              href="/cv/ats"
              target="_blank"
              className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-semibold py-2 px-3 rounded-lg text-xs flex justify-center items-center gap-2 transition shadow-md"
            >
              <span>Buka CV ATS Generator</span>
              <FaExternalLinkAlt size={11} />
            </Link>
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
