"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Position, Hover & Scroll tracking via Refs (0 React re-renders on move/hover/scroll)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const currentScaleDot = useRef(1);
  const currentScaleRing = useRef(1);

  // Scroll Animation Physics Refs
  const scrollVel = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Stable clickable detection (handles nested children inside buttons/links)
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!(
          target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer"
        );
        isHoveredRef.current = isClickable;

        if (ringRef.current) {
          if (isClickable) {
            ringRef.current.classList.add("ring-hover");
          } else {
            ringRef.current.classList.remove("ring-hover");
          }
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Scroll Physics Event Handler
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;
      scrollVel.current = Math.min(scrollVel.current + delta * 0.08, 1.2);
    };

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY);
      scrollVel.current = Math.min(scrollVel.current + delta * 0.003, 1.2);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    // Continuous 60-120fps RAF loop handling position, scale & scroll physics
    const render = () => {
      // 1. Decay scroll velocity smoothly towards 0
      scrollVel.current *= 0.88;

      const scrollStretchX = 1 - Math.min(scrollVel.current * 0.25, 0.35);
      const scrollStretchY = 1 + Math.min(scrollVel.current * 0.45, 0.6);

      const targetScaleDot = isHoveredRef.current ? 1.5 : 1;
      const targetScaleRing = isHoveredRef.current ? 1.4 : 1;

      // Smooth lerp for scale to eliminate sudden size jumps/glitches
      currentScaleDot.current += (targetScaleDot - currentScaleDot.current) * 0.2;
      currentScaleRing.current += (targetScaleRing - currentScaleRing.current) * 0.2;

      // 2. Inner dot snaps to mouse position
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x - 5}px, ${mousePos.current.y - 5}px, 0) scale(${currentScaleDot.current.toFixed(3)})`;
      }

      // 3. Outer ring follows with smooth 0.3 lerp + Scroll velocity dynamic stretch & squeeze
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.3;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.3;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px, 0) scale(${currentScaleRing.current.toFixed(3)}) scale(${scrollStretchX.toFixed(3)}, ${scrollStretchY.toFixed(3)})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <>
      {/* Inner Glowing Pink Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-2.5 h-2.5 bg-pink-500 rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_#ec4899] transition-opacity duration-200 print:hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Responsive Following Outer Ring with Scroll Fluid Stretch Physics */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-pink-500/60 bg-pink-500/5 shadow-[0_0_10px_rgba(236,72,153,0.2)] pointer-events-none z-[99998] transition-colors duration-200 [&.ring-hover]:border-pink-500/90 [&.ring-hover]:bg-pink-500/20 [&.ring-hover]:shadow-[0_0_15px_rgba(236,72,153,0.5)] print:hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
