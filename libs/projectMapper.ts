/* eslint-disable @typescript-eslint/no-explicit-any */
import { project_type } from "@/components/utils/ProjectType";
import { techs as techsMap } from "@/components/utils/Techs";
import { FiGithub } from "react-icons/fi";
import { AiOutlineLink } from "react-icons/ai";
import { FaWhatsapp, FaChrome, FaPlay, FaAndroid, FaFigma, FaBehance } from "react-icons/fa";

export function getIconComponent(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "github":
    case "figithub":
      return FiGithub;
    case "link":
    case "aioutlinelink":
    case "external":
      return AiOutlineLink;
    case "whatsapp":
    case "fawhatsapp":
      return FaWhatsapp;
    case "chrome":
    case "fachrome":
      return FaChrome;
    case "play":
    case "faplay":
      return FaPlay;
    case "android":
    case "faandroid":
      return FaAndroid;
    case "figma":
      return FaFigma;
    case "behance":
      return FaBehance;
    default:
      return AiOutlineLink;
  }
}

export function mapProjectFromDb(dbProject: any) {
  return {
    ...dbProject,
    images: (dbProject.images || []).map((img: any) => img.src),
    tags: (dbProject.tags || []).map((key: string) => (project_type as any)[key] || { title: key }),
    techs: (dbProject.techs || []).map((key: string) => (techsMap as any)[key] || { title: key }),
    links: (dbProject.links || []).map((link: any) => ({
      href: link.href,
      icon: getIconComponent(link.icon),
    })),
    startDate: dbProject.startDate ? new Date(dbProject.startDate) : new Date(),
    releaseDate: dbProject.releaseDate ? new Date(dbProject.releaseDate) : undefined,
  };
}
