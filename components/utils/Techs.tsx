"use client"

import {
  SiExpress,
  SiPrisma,
  SiDrizzle,
  SiPostgresql,
  SiRailway,
  SiVercel,
  SiReact,
  SiFlutter,
  SiKotlin,
  SiAndroidstudio,
  SiUnity,
  SiUnrealengine,
  SiGodotengine,
  SiRoblox,
  SiBehance,
  SiArduino,
  SiRaspberrypi,
} from "react-icons/si"
import { TbBrandNextjs } from "react-icons/tb"
import { FaJava, FaFigma } from "react-icons/fa"

export const techs = {
  // =========================
  // Web Development
  // =========================
  nextJs: {
    title: "Next.js",
    icon: <TbBrandNextjs />,
    link: "https://nextjs.org/",
  },
  expressJs: {
    title: "Express.js",
    icon: <SiExpress />,
    link: "https://expressjs.com/",
  },
  reactNative: {
    title: "React Native",
    icon: <SiReact />,
    link: "https://reactnative.dev/",
  },

  // =========================
  // Database & ORM
  // =========================
  postgreSql: {
    title: "PostgreSQL",
    icon: <SiPostgresql />,
    link: "https://www.postgresql.org/",
  },
  prismaOrm: {
    title: "Prisma ORM",
    icon: <SiPrisma />,
    link: "https://www.prisma.io/",
  },
  drizzleOrm: {
    title: "Drizzle ORM",
    icon: <SiDrizzle />,
    link: "https://orm.drizzle.team/",
  },

  // =========================
  // Deployment
  // =========================
  railway: {
    title: "Railway",
    icon: <SiRailway />,
    link: "https://railway.com/",
  },
  vercel: {
    title: "Vercel",
    icon: <SiVercel />,
    link: "https://vercel.com/",
  },

  // =========================
  // Mobile Development
  // =========================
  kotlin: {
    title: "Kotlin",
    icon: <SiKotlin />,
    link: "https://kotlinlang.org/",
  },
  java: {
    title: "Java",
    icon: <FaJava />,
    link: "https://www.java.com/",
  },
  flutter: {
    title: "Flutter",
    icon: <SiFlutter />,
    link: "https://flutter.dev/",
  },
  androidStudio: {
    title: "Android Studio",
    icon: <SiAndroidstudio />,
    link: "https://developer.android.com/studio",
  },

  // =========================
  // Game Development
  // =========================
  robloxStudio: {
    title: "Roblox Studio",
    icon: <SiRoblox />,
    link: "https://create.roblox.com/",
  },
  luau: {
    title: "Luau",
    icon: <SiRoblox />,
    link: "https://luau.org/",
  },
  unity: {
    title: "Unity",
    icon: <SiUnity />,
    link: "https://unity.com/",
  },
  unrealEngine: {
    title: "Unreal Engine",
    icon: <SiUnrealengine />,
    link: "https://www.unrealengine.com/",
  },
  godot: {
    title: "Godot Engine",
    icon: <SiGodotengine />,
    link: "https://godotengine.org/",
  },

  // =========================
  // Design
  // =========================
  figma: {
    title: "Figma",
    icon: <FaFigma />,
    link: "https://www.figma.com/",
  },
  behance: {
    title: "Behance",
    icon: <SiBehance />,
    link: "https://www.behance.net/",
  },

  // =========================
  // Embedded & IoT
  // =========================
  arduino: {
    title: "Arduino",
    icon: <SiArduino />,
    link: "https://www.arduino.cc/",
  },
  raspberryPi: {
    title: "Raspberry Pi",
    icon: <SiRaspberrypi />,
    link: "https://www.raspberrypi.com/",
  },
}