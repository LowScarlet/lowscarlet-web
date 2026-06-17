"use client"

import { CgWebsite } from "react-icons/cg"
import { PiStudentBold } from "react-icons/pi"
import { FaAndroid, FaGamepad, FaMobileAlt, FaLaptop, FaMicrochip, FaPalette } from "react-icons/fa"

export const project_type = {
  finalProjectThesis: {
    title: 'Undergraduate Final Project',
    icon: <PiStudentBold />,
    link: undefined
  },
  casualWebsite: {
    title: 'Casual Website',
    icon: <CgWebsite />,
    link: undefined
  },
  webApplication: {
    title: 'Web Application',
    icon: <CgWebsite />,
    link: undefined
  },
  androidApp: {
    title: 'Android Application',
    icon: <FaAndroid />,
    link: undefined
  },
  mobileApplication: {
    title: 'Mobile Application',
    icon: <FaMobileAlt />,
    link: undefined
  },
  gameDevelopment: {
    title: 'Game Development',
    icon: <FaGamepad />,
    link: undefined
  },
  indieGame: {
    title: 'Indie Game',
    icon: <FaGamepad />,
    link: undefined
  },
  desktopApp: {
    title: 'Desktop Application',
    icon: <FaLaptop />,
    link: undefined
  },
  iotProject: {
    title: 'IoT & Hardware',
    icon: <FaMicrochip />,
    link: undefined
  },
  uiuxDesign: {
    title: 'UI/UX Design',
    icon: <FaPalette />,
    link: undefined
  }
}