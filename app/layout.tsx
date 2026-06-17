import type { Metadata } from "next";
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
  colorScheme: "dark",
  creator: "Tegar Maulana Fahreza",
  publisher: "Vercel"
}

export default async function RootLayout({
  children,
  left,
  right,
}: {
  children: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  await ensureConfigs();
  await seedProjects();

  return (
    <MainLayout>
      <div className="flex">
        {/* LEFT PANEL */}
        {left}

        {/* MAIN */}
        <div className="lg:z-60 flex-1 bg-[#101010] shadow-xl">
          {children}
        </div>

        {/* RIGHT PANEL */}
        {right}
      </div>
    </MainLayout>
  );
}
