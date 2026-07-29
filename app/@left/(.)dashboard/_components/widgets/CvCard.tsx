'use client'

import { motion } from "framer-motion";
import { SiReaddotcv } from "react-icons/si";
import { FaUserCheck } from "react-icons/fa";
import Link from "next/link";

interface CvCardProps {
  onPreviewCv: (url: string, title: string) => void;
}

export default function CvCard({
  onPreviewCv,
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
      </h1>

      <div className="grid grid-cols-2 gap-2 pt-1">

        {/* CREATIVE CV */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <button
            type="button"
            onClick={() => onPreviewCv("/cv/creative", "Creative CV (Generated from DB)")}
            className="w-full block relative bg-linear-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:opacity-90 px-4 py-2.5 rounded-lg overflow-hidden font-semibold text-white text-xs text-center transition cursor-pointer shadow-md"
          >
            <span className="absolute inset-0 bg-white/10 opacity-30 blur-sm" />
            Creative
          </button>
        </motion.div>

        {/* ATS CV */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <button
            type="button"
            onClick={() => onPreviewCv("/cv/ats", "ATS CV (Generated from DB)")}
            className="w-full block relative bg-linear-to-r from-pink-600 via-purple-600 to-violet-600 hover:opacity-90 px-4 py-2.5 rounded-lg overflow-hidden font-semibold text-white text-xs text-center transition cursor-pointer shadow-md"
          >
            <span className="absolute inset-0 bg-white/10 opacity-30 blur-sm" />
            ATS Version
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
