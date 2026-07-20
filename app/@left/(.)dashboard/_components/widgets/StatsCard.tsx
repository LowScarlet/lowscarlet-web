'use client'

import { motion } from "framer-motion";
import { FaUsers, FaCode } from "react-icons/fa";
import { Counter } from "@/components/utils/Counter";
import { cn } from "@/libs/utils";

interface StatsCardProps {
  isAdmin: boolean;
  visitorsCount: number;
  projectsCount: number;
  onManageProjects: () => void;
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function StatsCard({
  isAdmin,
  visitorsCount,
  projectsCount,
  onManageProjects,
}: StatsCardProps) {
  return (
    <div className="gap-3 grid grid-cols-2">
      {/* Visitors Stat */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.03 }}
        className="relative bg-neutral-800 p-4 rounded-xl overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-linear-to-r from-pink-500/10 to-violet-500/10" />

        <div className="z-10 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-400 text-xs">Visitors</h2>
            <FaUsers className="text-pink-400 text-sm" />
          </div>
          <p className="mt-1 font-bold text-white text-xl">
            <Counter value={visitorsCount} />
          </p>
        </div>
      </motion.div>

      {/* Projects Stat */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.03 }}
        onClick={() => {
          if (isAdmin) {
            onManageProjects();
          }
        }}
        className={cn(
          "relative bg-neutral-800 p-4 rounded-xl overflow-hidden",
          isAdmin ? "cursor-pointer border border-dashed border-blue-500/40 hover:bg-neutral-700/80" : "cursor-default"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10" />

        <div className="z-10 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <h2 className="text-gray-400 text-xs font-semibold">Projects</h2>
              {isAdmin && (
                <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1 py-0.2 rounded font-mono">
                  Manage
                </span>
              )}
            </div>
            <FaCode className="text-blue-400 text-sm" />
          </div>
          <p className="mt-1 font-bold text-white text-xl">
            <Counter value={projectsCount} />
          </p>
        </div>
      </motion.div>
    </div>
  );
}
