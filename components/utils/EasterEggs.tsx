"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGamepad, FaCat, FaFire } from "react-icons/fa";

// Secret Konami Code sequence: Up Up Down Down Left Right Left Right
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

interface EasterEggNotice {
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface DanmakuCat {
  id: string;
  topPercent: number;
  duration: number;
  text: string;
  borderColor: string;
  textColor: string;
}

const CAT_MESSAGES = [
  "🐱 Meow! Nyaaa~ 🐾",
  "🐱 Purrrr... 💖",
  "🐱 Code Cat reporting for duty! ⚡",
  "🐱 Meow meow meow! 🎉",
  "🐱 Catch me if you can! 💨",
  "🐱 LowScarlet&apos;s loyal cat ✦",
  "🐱 🐈 🐾 Nya!",
  "🐱 Bug hunter cat on the loose! 🔍",
  "🐱 Infinite Danmaku Cats! 🚀",
];

const CAT_COLORS = [
  { border: "border-yellow-500/50", text: "text-yellow-300" },
  { border: "border-pink-500/50", text: "text-pink-300" },
  { border: "border-purple-500/50", text: "text-purple-300" },
  { border: "border-cyan-500/50", text: "text-cyan-300" },
  { border: "border-emerald-500/50", text: "text-emerald-300" },
];

export default function EasterEggs() {
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEggNotice | null>(null);
  const [cats, setCats] = useState<DanmakuCat[]>([]);
  const [rainbowMode, setRainbowMode] = useState(false);

  // 1. Console ASCII Art Easter Egg for curious developers
  useEffect(() => {
    console.log(
      `%c
   __                      _____                      __     __ 
  / /  ___ _    __/ __/ _____ ______/ /__ / /_
 / /__/ _ \\ |/|/ /\\ \\/ ___/ _ \`/ __/ / -_) __/
/____/\\___/__,__/___/\\__/  \\_,_/_/  /_/\\__/\\__/ 
                                                  
 %c✨ Hey curious developer! You discovered the console Easter Egg.
 🚀 Built with Next.js 16, TailwindCSS, TypeScript & Framer Motion.
 💡 Try typing 'scarlet', 'cat', or the Konami Code on your keyboard!`,
      "color: #ec4899; font-weight: bold; font-size: 13px;",
      "color: #a855f7; font-size: 12px; font-style: italic;"
    );
  }, []);

  // 2. Secret Keyboard Listeners (Konami Code, 'scarlet', 'cat')
  useEffect(() => {
    let konamiIndex = 0;
    let typedBuffer = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when user is typing inside an input/textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      // Check Konami Code
      if (e.key.toLowerCase() === KONAMI_CODE[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === KONAMI_CODE.length) {
          konamiIndex = 0;
          setRainbowMode((prev) => !prev);
          triggerConfetti();
          setActiveEasterEgg({
            title: "🎮 Konami Code Unlocked!",
            message: "You activated Rainbow Cyberpunk Mode! (Type Konami code again to toggle)",
            icon: <FaGamepad className="text-2xl text-pink-400" />,
          });
        }
      } else {
        konamiIndex = 0;
      }

      // Check Typed Word Buffer
      typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-10);

      if (typedBuffer.endsWith("scarlet")) {
        typedBuffer = "";
        triggerConfetti();
        setActiveEasterEgg({
          title: "🔥 Scarlet VIP Visitor!",
          message: "You typed the secret word 'scarlet'! You unlocked VIP visitor aura ✨",
          icon: <FaFire className="text-2xl text-orange-400" />,
        });
      }

      // Danmaku Cat Rain Trigger
      if (typedBuffer.endsWith("cat")) {
        typedBuffer = "";
        
        // Spawn 3 danmaku cat bullets across random heights & speeds
        const newCats: DanmakuCat[] = Array.from({ length: 3 }).map(() => {
          const colorScheme = CAT_COLORS[Math.floor(Math.random() * CAT_COLORS.length)];
          return {
            id: `${Date.now()}-${Math.random()}`,
            topPercent: Math.floor(Math.random() * 75) + 10, // 10% to 85% Y height
            duration: 5 + Math.random() * 4, // 5s to 9s flight duration
            text: CAT_MESSAGES[Math.floor(Math.random() * CAT_MESSAGES.length)].replace("&apos;", "'"),
            borderColor: colorScheme.border,
            textColor: colorScheme.text,
          };
        });

        setCats((prev) => [...prev, ...newCats]);

        setActiveEasterEgg({
          title: "🐱 Danmaku Cat Rain Unleashed!",
          message: "Keep typing 'cat' to spawn more and more flying cats! 🐾",
          icon: <FaCat className="text-2xl text-yellow-400" />,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lightweight Canvas Confetti Burst
  const triggerConfetti = () => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }[] = [];

    const colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity
        p.alpha -= 0.015;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      frame++;
      if (frame < 80) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  // Auto hide notice toast after 3 seconds
  useEffect(() => {
    if (!activeEasterEgg) return;
    const timer = setTimeout(() => {
      setActiveEasterEgg(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeEasterEgg]);

  return (
    <>
      {/* Rainbow Glow Mode outline when Konami Code is triggered */}
      {rainbowMode && (
        <div className="fixed inset-0 border-8 border-pink-500/70 pointer-events-none z-[9999] animate-pulse transition-all duration-500 shadow-[inset_0_0_50px_rgba(236,72,153,0.3)]" />
      )}

      {/* Secret Toast Banner Notification */}
      <AnimatePresence>
        {activeEasterEgg && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] bg-neutral-900/95 backdrop-blur-xl border border-pink-500/50 p-4 rounded-2xl shadow-2xl text-white flex items-center gap-3.5 cursor-pointer select-none"
            onClick={() => setActiveEasterEgg(null)}
          >
            <div className="p-3 rounded-xl bg-white/10 shrink-0">
              {activeEasterEgg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-pink-400">{activeEasterEgg.title}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">{activeEasterEgg.message}</p>
            </div>
            <button
              className="text-neutral-400 hover:text-white text-xs px-2.5 py-1 rounded-full bg-white/10 transition-colors"
              onClick={() => setActiveEasterEgg(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danmaku Bullet Comments Flying Cat Rain */}
      {cats.map((cat) => (
        <motion.div
          key={cat.id}
          initial={{ x: "100vw" }}
          animate={{ x: "-120vw" }}
          transition={{ duration: cat.duration, ease: "linear" }}
          onAnimationComplete={() => {
            setCats((prev) => prev.filter((c) => c.id !== cat.id));
          }}
          style={{ top: `${cat.topPercent}%` }}
          className="fixed right-0 z-[9990] pointer-events-none whitespace-nowrap select-none transform-gpu"
        >
          <div
            className={`flex items-center gap-2 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border ${cat.borderColor} text-xs font-mono ${cat.textColor} shadow-2xl`}
          >
            <span>{cat.text}</span>
          </div>
        </motion.div>
      ))}
    </>
  );
}
