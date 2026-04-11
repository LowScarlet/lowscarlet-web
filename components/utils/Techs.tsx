"use client"

import { SiExpress, SiPostgresql, SiPrisma, SiRailway, SiVercel } from "react-icons/si"
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
  },
  postgreSql: {
    title: 'PostgreSql',
    icon: <SiPostgresql />,
    link: 'https://www.postgresql.org/'
  },
  railway: {
    title: 'Railway',
    icon: <SiRailway />,
    link: 'https://railway.com/'
  },
  vercel: {
    title: 'Vercel',
    icon: <SiVercel />,
    link: 'https://vercel.com/'
  }
}