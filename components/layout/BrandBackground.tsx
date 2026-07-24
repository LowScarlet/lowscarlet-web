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

const RepellingIconItem: React.FC<RepellingIconProps> = ({ item, mousePos }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    if (!mousePos) {
      el.style.transform = "translate(0px, 0px) scale(1)";
      el.style.opacity = "";
      el.style.filter = "";
      el.style.color = "";
      return;
    }

    const rect = el.getBoundingClientRect();
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
      const scale = 1 + factor * 0.35; // Scale up when mouse is near

      el.style.transform = `translate(${pushX}px, ${pushY}px) scale(${scale})`;
      el.style.opacity = "1";
      el.style.filter = "drop-shadow(0 0 16px rgba(255, 255, 255, 0.6))";
      el.style.color = "#ffffff";
    } else {
      el.style.transform = "translate(0px, 0px) scale(1)";
      el.style.opacity = "";
      el.style.filter = "";
      el.style.color = "";
    }
  }, [mousePos]);

  return (
    <div
      ref={itemRef}
      className="flex items-center gap-3 text-neutral-400/80 transition-all duration-200 ease-out transform-gpu select-none"
    >
      <span className="text-3xl sm:text-4xl lg:text-5xl transition-transform duration-200">
        {item.icon}
      </span>
      <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase opacity-70 transition-opacity duration-200">
        {item.name}
      </span>
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

      {/* Marquee container with subtle opacity and diagonal rotation */}
      <div className="absolute inset-0 opacity-[0.14] md:opacity-[0.18] flex flex-col justify-around -rotate-6 scale-125 transform-gpu pointer-events-none">
        <MarqueeRow items={row1} direction="left" duration={35} mousePos={mousePos} />
        <MarqueeRow items={row2} direction="right" duration={42} mousePos={mousePos} />
        <MarqueeRow items={row3} direction="left" duration={38} mousePos={mousePos} />
        <MarqueeRow items={row4} direction="right" duration={45} mousePos={mousePos} />
        <MarqueeRow items={row5} direction="left" duration={40} mousePos={mousePos} />
      </div>
    </div>
  );
}
