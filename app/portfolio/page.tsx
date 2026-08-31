import { Metadata } from "next";
import { getAllConfigs } from "@/db/queries/config";
import PortfolioPageClient from "./_components/PortfolioPageClient";

export const revalidate = 0;

function getFormattedDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const configs = await getAllConfigs();
  const dateStr = getFormattedDate();
  const title = `PORTFOLIO_${configs.PROFILE_FULL_NAME}_${dateStr}`;
  return {
    title,
    description: `Project Portfolio of ${configs.PROFILE_FULL_NAME}`,
  };
}

export default async function PortfolioPage() {
  const configs = await getAllConfigs();

  const profile = {
    fullName: configs.PROFILE_FULL_NAME,
    email: configs.SOCIAL_EMAIL,
    website: configs.PROFILE_WEBSITE,
    github: configs.SOCIAL_GITHUB,
    linkedin: configs.SOCIAL_LINKEDIN,
    summary: configs.PROFILE_SUMMARY,
  };

  return (
    <>
      {/* Scoped font import and print style — landscape A4 for portfolio */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@500;600;700&display=swap');

            .font-portfolio {
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            }
            .font-display {
              font-family: 'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            @media print {
              @page {
                size: A4 landscape;
                margin: 0mm;
              }
              body, html, main {
                background-color: #0b0c10 !important;
                background: #0b0c10 !important;
                color: #f1f5f9 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `,
        }}
      />
      <PortfolioPageClient profile={profile} />
    </>
  );
}
