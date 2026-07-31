'use client'

import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { cn } from "@/libs/utils";
import Image from "next/image";

interface StatusCardProps {
  isAdmin: boolean;
  status: string;
  statusNote: string;
  onEditStatus: () => void;
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function StatusCard({
  isAdmin,
  status,
  statusNote,
  onEditStatus,
}: StatusCardProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        if (isAdmin) {
          onEditStatus();
        }
      }}
      className={cn(
        "relative flex justify-between items-center bg-neutral-800 p-4 rounded-xl transition",
        isAdmin && "hover:bg-neutral-700/80 cursor-pointer border border-dashed border-violet-500/40"
      )}
    >
      <div className="grow text-left">
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
            status === "AVAILABLE"
              ? "text-green-400"
              : status === "NOT_AVAILABLE"
                ? "text-red-400"
                : "text-violet-500"
          )}
        >
          {statusNote || "Doing Something..."}
        </p>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 shrink-0",
          status === "AVAILABLE"
            ? "text-green-400"
            : status === "NOT_AVAILABLE"
              ? "text-red-400"
              : "text-violet-500"
        )}
      >
        <span
          className={cn(
            "rounded-full w-2 h-2 animate-pulse",
            status === "AVAILABLE"
              ? "bg-green-400"
              : status === "NOT_AVAILABLE"
                ? "bg-red-400"
                : "bg-violet-500"
          )}
        />
      </div>

      {/* PIXEL CAT GIF */}
      <div className="absolute -bottom-0 right-8 z-10 pointer-events-none select-none">
        <Image
          src="/pixel-cat.gif"
          alt="Pixel cat"
          width={80}
          height={70}
          className="w-28 h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}
