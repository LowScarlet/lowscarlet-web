'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import { FaUsers, FaEdit, FaWhatsapp, FaDiscord } from "react-icons/fa";
import { FiGithub, FiInstagram, FiMail } from "react-icons/fi";
import { BiLogoLinkedin } from "react-icons/bi";

interface SocialLinksCardProps {
  isAdmin: boolean;
  onManageSocial: () => void;
  socialGithub: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialEmail: string;
  socialWhatsapp: string;
  socialDiscord?: string;
}

export default function SocialLinksCard({
  isAdmin,
  onManageSocial,
  socialGithub,
  socialInstagram,
  socialLinkedin,
  socialEmail,
  socialWhatsapp,
  socialDiscord,
}: SocialLinksCardProps) {
  const mailtoLink = socialEmail
    ? (socialEmail.startsWith("mailto:") ? socialEmail : "mailto:" + socialEmail)
    : "mailto:tegarmaulanafahreza.email@gmail.com";

  const waLink = socialWhatsapp
    ? (socialWhatsapp.startsWith("http") ? socialWhatsapp : "https://wa.me/" + socialWhatsapp.replace(/\D/g, ""))
    : "https://wa.me/6281270634992";

  const discordLink = socialDiscord
    ? (socialDiscord.startsWith("http") ? socialDiscord : `https://discord.com/users/${socialDiscord}`)
    : "https://discord.com/users/lowscarlet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="space-y-2"
    >
      <h1 className="flex items-center justify-between font-bold text-white text-xl">
        <span className="flex items-center space-x-2">
          <FaUsers className="text-blue-400" />
          <span>Social Media Links</span>
        </span>
        {isAdmin && (
          <button
            onClick={onManageSocial}
            className="p-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-400 hover:text-white rounded-md cursor-pointer transition shadow-xs"
            title="Manage Social Links"
          >
            <FaEdit size={14} />
          </button>
        )}
      </h1>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Link
          href={socialGithub || "https://github.com/LowScarlet"}
          target="_blank"
          className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
        >
          <FiGithub className="text-blue-400 text-sm" />
          <span className="truncate">GitHub</span>
        </Link>
        <Link
          href={socialInstagram || "https://www.instagram.com/lowscarl3t"}
          target="_blank"
          className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
        >
          <FiInstagram className="text-pink-400 text-sm" />
          <span className="truncate">Instagram</span>
        </Link>
        <Link
          href={socialLinkedin || "https://www.linkedin.com/in/tegar-maulana-fahreza-04615a221"}
          target="_blank"
          className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
        >
          <BiLogoLinkedin className="text-blue-400 text-sm" />
          <span className="truncate">LinkedIn</span>
        </Link>
        <Link
          href={mailtoLink}
          target="_blank"
          className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
        >
          <FiMail className="text-red-400 text-sm" />
          <span className="truncate">Email</span>
        </Link>
        <Link
          href={waLink}
          target="_blank"
          className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
        >
          <FaWhatsapp className="text-emerald-400 text-sm" />
          <span className="truncate">WhatsApp</span>
        </Link>
        <Link
          href={discordLink}
          target="_blank"
          className="bg-neutral-800 hover:bg-neutral-755 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-300 transition"
        >
          <FaDiscord className="text-indigo-400 text-sm" />
          <span className="truncate">Discord</span>
        </Link>
      </div>
    </motion.div>
  );
}
