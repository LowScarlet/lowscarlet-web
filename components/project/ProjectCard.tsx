/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Badge from "@/components/utils/Badge";
import { formatDate } from "@/libs/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type ProjectProps = {
  images: string[];
  title: string;
  description: string;
  tags: any[];
  techs: any[];
  links: {
    href: string;
    icon: any;
  }[];
  contributors?: string[];
  startDate: Date;
  releaseDate?: Date;
  isLast?: boolean;
};

/* ANIMATION VARIANTS FOR CONTENT */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

/* SLOW-SLIDE VARIANTS FOR IMAGES */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.3,
    scale: 1.05,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0.3,
    scale: 0.95,
  }),
};

export default function ProjectCard({
  images = [],
  title,
  description,
  tags,
  techs,
  links,
  contributors,
  startDate,
  releaseDate,
  isLast = false,
}: ProjectProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 180;
  const isLong = description.length > MAX_LENGTH;
  const shortText = description.slice(0, MAX_LENGTH) + "...";

  // Slow Auto-slide every 4.5 seconds (paused when hovered)
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSelect = (newIndex: number) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };

  return (
    <div className="space-y-4">
      {/* IMAGE SLOW-SLIDER CONTAINER */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="group relative rounded-2xl w-full aspect-video overflow-hidden bg-neutral-900 shadow-lg border border-white/5 select-none"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 220, damping: 28 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {images.length > 0 && (
              <Image
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMDEwMTAiLz48L3N2Zz4="
                src={images[index]}
                alt={`${title} screenshot ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* IMAGE GRADIENT OVERLAY FOR CONTRAST */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10" />

        {/* COUNTER BADGE */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-mono font-medium text-white/90 tracking-wide">
            {index + 1} / {images.length}
          </div>
        )}

        {/* PREV / NEXT NAV BUTTONS */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Previous image"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Next image"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </>
        )}

        {/* PAGINATION DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* TITLE + TAGS */}
        <div>
          <motion.h1
            variants={item}
            className="mt-4 font-bold text-white text-xl"
          >
            {title}
          </motion.h1>

          <motion.div variants={item} className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                title={tag.title}
                icon={tag.icon}
                href={tag.link}
                scale="small"
              />
            ))}
          </motion.div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <motion.div variants={item}>
            {/* COLLAPSED */}
            {!expanded && (
              <div className="dark:prose-invert mt-2 max-w-none prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    p: ({ children }) => (
                      <p className="inline text-gray-400 leading-relaxed">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {shortText}
                </ReactMarkdown>

                {isLong && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="inline ml-2 text-blue-400 text-sm hover:underline cursor-pointer"
                  >
                    Read more
                  </button>
                )}
              </div>
            )}

            {/* EXPANDED */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="dark:prose-invert mt-2 max-w-none prose">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        h2: ({ children }) => (
                          <h2 className="font-bold text-white text-xl">
                            {children}
                          </h2>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-400 leading-relaxed">
                            {children}
                          </p>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-400">{children}</li>
                        ),
                      }}
                    >
                      {description}
                    </ReactMarkdown>

                    <button
                      onClick={() => setExpanded(false)}
                      className="mt-2 text-blue-400 text-sm hover:underline cursor-pointer"
                    >
                      Show less
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* LINKS */}
          <motion.div
            variants={item}
            className="flex gap-3 mt-6 py-2 overflow-x-auto"
          >
            {links.map(({ href, icon: Icon }, i) => (
              <Link
                key={i}
                target="_blank"
                href={href}
                aria-label={`Project link ${i + 1} for ${title}`}
                className="flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-900 px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 transition"
              >
                <Icon className="text-2xl" />
              </Link>
            ))}
          </motion.div>

          {/* DATE */}
          <motion.div variants={item} className="mt-4 text-sm">
            <span className="font-medium text-white">
              Development Date:{" "}
            </span>
            <span className="text-gray-400">
              {formatDate(startDate)} -{" "}
              {releaseDate ? formatDate(releaseDate) : "Present"}
            </span>
          </motion.div>

          {/* CONTRIBUTORS */}
          {contributors && contributors.length > 1 && (
            <motion.div variants={item} className="mt-4 text-sm">
              <span className="font-medium text-white">
                Contributors:{" "}
              </span>
              <span className="text-gray-400">
                {contributors.length === 2
                  ? `${contributors[0]} and ${contributors[1]}`
                  : `${contributors
                      .slice(0, -1)
                      .join(", ")} and ${contributors.at(-1)}`}
              </span>
            </motion.div>
          )}

          {/* TECH STACK */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-2 mt-4"
          >
            <span className="font-medium text-white text-sm">
              Tech Stacks:
            </span>
            {techs.map((tech, i) => (
              <Badge
                key={i}
                title={tech.title}
                icon={tech.icon}
                href={tech.link}
              />
            ))}
          </motion.div>

          {/* DIVIDER */}
          {!isLast && (
            <motion.div variants={item} className="pt-6">
              <div className="bg-neutral-200 dark:bg-neutral-700 w-full h-px" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}