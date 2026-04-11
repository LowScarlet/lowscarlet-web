"use client"

import { SiExpress, SiPrisma } from "react-icons/si"
import { TbBrandNextjs } from "react-icons/tb"

export const techs = {
  nextJs: {
    title: 'Next.js',
    icon: <TbBrandNextjs />,
    link: 'https://nextjs.org/'
  },
  expressJs: {
    title: 'Express.js',
    icon: <SiExpress />,
    link: 'https://expressjs.com/'
  },
  prismaOrm: {
    title: 'Prisma ORM',
    icon: <SiPrisma />,
    link: 'https://www.prisma.io/'
  }
}