"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedPos = sessionStorage.getItem("lowscarlet_mouse_pos");
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          return parsed;
        }
      }
    } catch {
      // Ignore parse error
    }
    return null;
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      setMousePosition(pos);
      setIsVisible(true);

      // Save last position in sessionStorage
      sessionStorage.setItem("lowscarlet_mouse_pos", JSON.stringify(pos));
    };

    const onMouseEnter = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovered(isClickable);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseenter", onMouseEnter, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  // DO NOT RENDER until mousePosition is valid to prevent (0,0) top-left jump!
  if (!isVisible || !mousePosition) return null;

  return (
    <>
      {/* Small Inner Glowing Pink Dot */}
      <motion.div
        aria-hidden="true"
        initial={false}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-pink-500 rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_#ec4899]"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
      />

      {/* Smooth Following Outer Ring */}
      <motion.div
        aria-hidden="true"
        initial={false}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-pink-500/60 pointer-events-none z-[99998] shadow-[0_0_15px_rgba(236,72,153,0.3)]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovered ? 1.8 : 1,
          backgroundColor: isHovered ? "rgba(236, 72, 153, 0.18)" : "rgba(236, 72, 153, 0.04)",
          borderColor: isHovered ? "rgba(236, 72, 153, 0.9)" : "rgba(236, 72, 153, 0.5)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />
    </>
  );
}
