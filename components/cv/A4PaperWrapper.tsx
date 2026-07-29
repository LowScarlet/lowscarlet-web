'use client';

import React, { useEffect, useRef, useState } from "react";

interface A4PaperWrapperProps {
  children: React.ReactNode;
  variant?: "ats" | "creative";
  className?: string;
}

/**
 * A4PaperWrapper ensures exact A4 paper dimensions (210mm x 297mm) and layout.
 * On mobile/small screens or inside modals, it proportionally scales down the A4 sheet
 * using CSS zoom / scale so that layout, line wraps, font proportions, and columns remain 100% intact.
 */
export default function A4PaperWrapper({
  children,
  variant = "ats",
  className = "",
}: A4PaperWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const targetWidth = 794; // 210mm in px at 96dpi

      if (containerWidth > 0 && containerWidth < targetWidth) {
        setScale(containerWidth / targetWidth);
      } else {
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);

    const observer = new ResizeObserver(calculateScale);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", calculateScale);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center items-start overflow-hidden print:overflow-visible ${className}`}
    >
      <div
        style={{
          zoom: scale < 1 ? scale : undefined,
          transform:
            typeof CSS !== "undefined" && CSS.supports && CSS.supports("zoom", "1")
              ? undefined
              : scale < 1
              ? `scale(${scale})`
              : undefined,
          transformOrigin: "top center",
        }}
        className={
          variant === "creative"
            ? "w-[210mm] min-h-[297mm] h-auto bg-white text-slate-900 shadow-2xl rounded-sm font-sans text-left shrink-0 print:zoom-100 print:transform-none print:shadow-none print:w-full print:min-h-0 print:m-0 print:p-6"
            : "w-[210mm] min-h-[297mm] h-auto bg-white text-gray-900 p-6 sm:p-10 shadow-2xl rounded-sm font-sans leading-relaxed shrink-0 print:zoom-100 print:transform-none print:shadow-none print:w-full print:min-h-0 print:p-8 print:m-0 print:bg-white print:text-black"
        }
      >
        {children}
      </div>
    </div>
  );
}
