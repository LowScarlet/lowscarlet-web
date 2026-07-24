"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiPython,
  SiDocker,
  SiGit,
  SiGithub,
  SiPostgresql,
  SiMongodb,
  SiFigma,
  SiVite,
  SiRust,
  SiGo,
  SiVercel,
  SiPrisma,
  SiDrizzle,
  SiKotlin,
  SiFlutter,
  SiUnity,
  SiUnrealengine,
  SiGodotengine,
  SiRoblox,
  SiArduino,
  SiRaspberrypi,
  SiExpress,
  SiRedis,
  SiNginx,
  SiLinux,
  SiCplusplus,
  SiHtml5,
  SiCss,
  SiGraphql,
  SiRedux,
  SiAndroidstudio,
} from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
import { FaJava } from "react-icons/fa";

interface IconItem {
  name: string;
  icon: React.ReactNode;
}

const row1: IconItem[] = [
  { name: "React", icon: <SiReact /> },
  { name: "Next.js", icon: <TbBrandNextjs /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  { name: "Vite", icon: <SiVite /> },
  { name: "Vercel", icon: <SiVercel /> },
  { name: "HTML5", icon: <SiHtml5 /> },
  { name: "CSS3", icon: <SiCss /> },
];

const row2: IconItem[] = [
  { name: "Python", icon: <SiPython /> },
  { name: "PostgreSQL", icon: <SiPostgresql /> },
  { name: "MongoDB", icon: <SiMongodb /> },
  { name: "Prisma", icon: <SiPrisma /> },
  { name: "Drizzle ORM", icon: <SiDrizzle /> },
  { name: "Redis", icon: <SiRedis /> },
  { name: "Express.js", icon: <SiExpress /> },
  { name: "GraphQL", icon: <SiGraphql /> },
];

const row3: IconItem[] = [
  { name: "Docker", icon: <SiDocker /> },
  { name: "Git", icon: <SiGit /> },
  { name: "GitHub", icon: <SiGithub /> },
  { name: "Linux", icon: <SiLinux /> },
  { name: "Nginx", icon: <SiNginx /> },
  { name: "Rust", icon: <SiRust /> },
  { name: "Go", icon: <SiGo /> },
  { name: "C++", icon: <SiCplusplus /> },
];

const row4: IconItem[] = [
  { name: "Figma", icon: <SiFigma /> },
  { name: "Kotlin", icon: <SiKotlin /> },
  { name: "Flutter", icon: <SiFlutter /> },
  { name: "Java", icon: <FaJava /> },
  { name: "Android Studio", icon: <SiAndroidstudio /> },
  { name: "Redux", icon: <SiRedux /> },
];

const row5: IconItem[] = [
  { name: "Unity", icon: <SiUnity /> },
  { name: "Unreal Engine", icon: <SiUnrealengine /> },
  { name: "Godot", icon: <SiGodotengine /> },
  { name: "Roblox", icon: <SiRoblox /> },
  { name: "Arduino", icon: <SiArduino /> },
  { name: "Raspberry Pi", icon: <SiRaspberrypi /> },
];

interface MousePos {
  x: number;
  y: number;
}

interface RepellingIconProps {
  item: IconItem;
  mousePos: MousePos | null;
}

// 2 Solid accent colors: Pink (#ec4899) and Violet (#a855f7)
const ACCENT_COLORS = [
  { hex: "#ec4899", shadow: "drop-shadow(0 0 22px rgba(236, 72, 153, 0.95))" },
  { hex: "#a855f7", shadow: "drop-shadow(0 0 22px rgba(168, 85, 247, 0.95))" },
];

const RepellingIconItem: React.FC<RepellingIconProps> = ({ item, mousePos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const activeColorRef = useRef(ACCENT_COLORS[0]);
  const isCurrentlyActiveRef = useRef(false);

  useEffect(() => {
    let animFrameId: number;

    const checkProximity = () => {
      const containerEl = containerRef.current;
      const innerEl = innerRef.current;
      if (!containerEl || !innerEl) return;

      if (!mousePos) {
        if (isCurrentlyActiveRef.current) {
          innerEl.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
          innerEl.style.filter = "";
          innerEl.style.color = "";
          isCurrentlyActiveRef.current = false;
        }
        return;
      }

      // Measure untransformed container position to prevent feedback loop jitter
      const rect = containerEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - mousePos.x;
      const dy = centerY - mousePos.y;
      const dist = Math.hypot(dx, dy);

      // Proximity radius of repulsion effect in pixels
      const radius = 160;

      if (dist < radius && dist > 0) {
        const factor = 1 - dist / radius;
        const maxRepel = 50; // Max displacement distance in px
        const pushX = (dx / dist) * factor * maxRepel;
        const pushY = (dy / dist) * factor * maxRepel;
        const scale = 1 + factor * 0.35; // Zoom perbesaran saat mouse mendekat

        // Pick a random color between Pink & Violet when becoming active
        if (!isCurrentlyActiveRef.current) {
          activeColorRef.current = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
          isCurrentlyActiveRef.current = true;
        }

        innerEl.style.transform = `translate3d(${pushX}px, ${pushY}px, 0px) scale(${scale})`;
        innerEl.style.color = activeColorRef.current.hex;
        innerEl.style.filter = activeColorRef.current.shadow;
      } else {
        if (isCurrentlyActiveRef.current || innerEl.style.color !== "") {
          innerEl.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
          innerEl.style.filter = "";
          innerEl.style.color = "";
          isCurrentlyActiveRef.current = false;
        }
      }

      // Continuously check proximity on frame loop so moving marquee items automatically reset when scrolling past stationary mouse
      animFrameId = requestAnimationFrame(checkProximity);
    };

    checkProximity();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [mousePos]);

  return (
    <div ref={containerRef} className="relative overflow-visible shrink-0">
      <div
        ref={innerRef}
        className="flex items-center gap-3 text-neutral-400/80 transform-gpu select-none"
        style={{
          transition:
            "transform 0.25s ease-out, color 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <span className="text-3xl sm:text-4xl lg:text-5xl transition-transform duration-200">
          {item.icon}
        </span>
        <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase opacity-70">
          {item.name}
        </span>
      </div>
    </div>
  );
};

interface MarqueeRowProps {
  items: IconItem[];
  direction: "left" | "right";
  duration: number;
  mousePos: MousePos | null;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, direction, duration, mousePos }) => {
  // Triple array for seamless infinite marquee loop
  const duplicatedItems = [...items, ...items, ...items];
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-visible py-6 flex whitespace-nowrap">
      <div
        className={`${animationClass} flex items-center gap-12 sm:gap-16 lg:gap-20 overflow-visible`}
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicatedItems.map((item, index) => (
          <RepellingIconItem
            key={`${item.name}-${index}`}
            item={item}
            mousePos={mousePos}
          />
        ))}
      </div>
    </div>
  );
};

export default function BrandBackground() {
  const [mousePos, setMousePos] = useState<MousePos | null>(null);

  useEffect(() => {
    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#101010] select-none"
    >
      {/* Radial vignette mask in center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#101010_85%)] z-10 pointer-events-none" />

      {/* Marquee container with diagonal rotation */}
      <div className="absolute inset-0 opacity-[0.25] md:opacity-[0.3] flex flex-col justify-around -rotate-6 scale-125 transform-gpu pointer-events-none">
        <MarqueeRow items={row1} direction="left" duration={35} mousePos={mousePos} />
        <MarqueeRow items={row2} direction="right" duration={42} mousePos={mousePos} />
        <MarqueeRow items={row3} direction="left" duration={38} mousePos={mousePos} />
        <MarqueeRow items={row4} direction="right" duration={45} mousePos={mousePos} />
        <MarqueeRow items={row5} direction="left" duration={40} mousePos={mousePos} />
      </div>
    </div>
  );
}
