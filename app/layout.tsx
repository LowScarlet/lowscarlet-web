import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ensureConfigs } from "@/db/queries/config";
import { seedProjects } from "@/db/queries/seed";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: 'LowScarlet - Personal Website',
  description: 'Hi 👋, I am Tegar Maulana Fahreza, a web developer from Indonesia.',
  metadataBase: new URL('https://lowscarlet.my.id'),
  openGraph: {
    type: "website",
    url: "https://lowscarlet.my.id",
    title: "LowScarlet - Personal Website",
    description: "Hi 👋, I am Tegar Maulana Fahreza, a web developer from Indonesia.",
    siteName: "LowScarlet",
    images: [
      'images/pp.png'
    ]
  },
  twitter: {
    card: 'summary',
  },
  creator: "Tegar Maulana Fahreza",
  publisher: "Vercel"
}

export const viewport: Viewport = {
  colorScheme: "dark",
}

export default async function RootLayout({
  children,
  global,
  left,
  right,
}: {
  children: React.ReactNode;
  global: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  await ensureConfigs();
  await seedProjects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Tegar Maulana Fahreza",
      "alternateName": "LowScarlet",
      "description": "Hi 👋, I am Tegar Maulana Fahreza, a web developer from Indonesia.",
      "jobTitle": "Web Developer",
      "url": "https://lowscarlet.my.id",
      "sameAs": [
        "https://github.com/lowscarlet"
      ],
      "knowsAbout": [
        "Web Development",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Internet of Things (IoT)",
        "Game Development"
      ]
    }
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex">
        {/* GLOBAL MODAL */}
        {global}

        {/* LEFT PANEL */}
        {left}

        {/* MAIN */}
        <div className="lg:z-60 flex-1">
          {children}
        </div>

        {/* RIGHT PANEL */}
        {right}
      </div>
    </MainLayout>
  );
}
