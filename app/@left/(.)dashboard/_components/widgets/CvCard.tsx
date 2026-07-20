'use client'

import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { SiReaddotcv } from "react-icons/si";

interface CvCardProps {
  isAdmin: boolean;
  onManageCv: () => void;
  onPreviewCv: (url: string, title: string) => void;
  cvCreativeUrl: string;
  cvAtsUrl: string;
}

export default function CvCard({
  isAdmin,
  onManageCv,
  onPreviewCv,
  cvCreativeUrl,
  cvAtsUrl,
}: CvCardProps) {
  return (
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
            onClick={onManageCv}
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
          <button
            type="button"
            onClick={() => onPreviewCv(cvCreativeUrl || "/cv-creative.pdf", "Creative CV")}
            className="w-full block relative bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-lg overflow-hidden font-medium text-white text-sm text-center cursor-pointer"
          >
            <span className="absolute inset-0 bg-white/20 opacity-30 blur-lg" />
            Creative
          </button>
        </motion.div>

        {/* ATS */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex-1">
          <button
            type="button"
            onClick={() => onPreviewCv(cvAtsUrl || "/resume_ats.pdf", "ATS CV")}
            className="w-full block relative bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg overflow-hidden font-medium text-sm text-center transition cursor-pointer"
          >
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition" />
            ATS Version
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
