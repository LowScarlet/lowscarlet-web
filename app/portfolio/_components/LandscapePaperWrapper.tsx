'use client';

import React, { useEffect, useRef, useState } from "react";

interface LandscapePaperWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * LandscapePaperWrapper ensures exact A4 landscape dimensions (297mm × 210mm).
 * On mobile/small screens, it proportionally scales down the sheet
 * using CSS zoom / scale so layout remains intact.
 */
export default function LandscapePaperWrapper({
  children,
  className = "",
}: LandscapePaperWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const targetWidth = 1122; // 297mm in px at 96dpi

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
      className={`w-full flex justify-center items-start overflow-x-hidden overflow-y-visible print:overflow-visible ${className}`}
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
        className="w-[297mm] min-h-[210mm] h-auto bg-[#0b0c10] text-neutral-100 shadow-2xl rounded-2xl border border-neutral-800/80 font-sans leading-relaxed shrink-0 print:zoom-100 print:transform-none print:shadow-none print:border-none print:rounded-none print:w-full print:min-h-0 print:m-0 print:bg-[#0b0c10] print:text-neutral-100"
      >
        {children}
      </div>
    </div>
  );
}
