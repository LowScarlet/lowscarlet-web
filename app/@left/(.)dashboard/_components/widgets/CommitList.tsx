/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GrUpdate } from "react-icons/gr";

const staticCommits = [
  {
    message: "feat: add dashboard layout",
    date: "2026-04-12",
  },
  {
    message: "fix: improve mobile responsiveness",
    date: "2026-04-11",
  },
  {
    message: "style: refine UI spacing",
    date: "2026-04-10",
  },
  {
    message: "feat: add blog carousel",
    date: "2026-04-09",
  },
];

export default function CommitList() {
  const [commitsList, setCommitsList] = useState<any[]>(staticCommits);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await fetch("/api/commits");
        if (res.ok) {
          const data = await res.json();
          setCommitsList(data);
        }
      } catch (e) {
        console.error("Failed to fetch commits from server:", e);
      }
    };
    fetchCommits();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <h1 className="flex items-center space-x-2 font-bold text-white text-xl">
        <motion.span
          initial={{ rotate: -15, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <GrUpdate />
        </motion.span>
        <span>My Website Commits</span>
      </h1>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="space-y-3 bg-neutral-800 p-4 rounded-xl"
      >
        {commitsList.map((commit, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ x: 4 }}
            className="group flex items-start gap-3 transition"
          >
            {/* DOT */}
            <div className="relative mt-1">
              <span className="inline-flex absolute bg-green-400 opacity-75 blur-[2px] rounded-full w-2 h-2" />
              <span className="block relative bg-green-400 rounded-full w-2 h-2 group-hover:scale-125 transition" />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col text-left">
              <span className="text-white group-hover:text-green-400 text-sm transition">
                {commit.message}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(commit.date).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
