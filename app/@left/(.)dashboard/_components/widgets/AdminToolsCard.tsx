'use client'

import { motion } from "framer-motion";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { HiOutlineDocumentText } from "react-icons/hi2";

interface AdminToolsCardProps {
  onOpenCoverLetter: () => void;
}

export default function AdminToolsCard({
  onOpenCoverLetter,
}: AdminToolsCardProps) {
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
            <HiOutlineWrenchScrewdriver />
          </motion.span>
          <span>Admin Tools</span>
        </span>
      </h1>

      <div className="grid grid-cols-1 gap-2 pt-1">
        {/* Generate Cover Letter / Application */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <button
            type="button"
            onClick={onOpenCoverLetter}
            className="w-full flex items-center justify-center gap-2 relative bg-linear-to-r from-amber-600 via-orange-600 to-red-600 hover:opacity-90 px-4 py-2.5 rounded-lg overflow-hidden font-semibold text-white text-xs text-center transition cursor-pointer shadow-md"
          >
            <span className="absolute inset-0 bg-white/10 opacity-30 blur-sm" />
            <HiOutlineDocumentText className="relative z-10 text-base" />
            <span className="relative z-10">Buat Lamaran Kerja / Magang</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
